import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, expect, test, vi } from 'vitest';
import AIChatbot from './AIChatbot';
import { useAuth } from '../../context/AuthContext';
import { aiChatService } from '../../services/aiChatService';

vi.mock('../../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../../services/aiChatService', () => ({
  aiChatService: { send: vi.fn(), history: vi.fn() },
}));

let container, root;
const guestId = '11111111-1111-4111-8111-111111111111';

async function renderChat() {
  await act(async () => root.render(<MemoryRouter><AIChatbot /></MemoryRouter>));
}
async function click(selector) {
  await act(async () => container.querySelector(selector).click());
}
async function ask(text) {
  await act(async () => {
    const input = container.querySelector('input[aria-label="Ask the AI assistant"]');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
}

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  sessionStorage.clear();
  vi.resetAllMocks();
  localStorage.setItem('veganhelper-ai-chat-guest-id', guestId);
  useAuth.mockReturnValue({ user: null, isAuthenticated: false, isLoading: false });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.clearAllMocks();
});

test('guest chat sends to API, shows remaining trial, and opens sign-in prompt at the limit', async () => {
  aiChatService.send.mockResolvedValue({ sessionId: 7, guestSessionId: guestId, answer: 'Try tofu.', guestQuestionsRemaining: 0 });
  aiChatService.history.mockResolvedValue({ messages: [
    { id: 1, senderType: 'user', messageText: 'Protein?' },
    { id: 2, senderType: 'ai', messageText: 'Try tofu.' },
  ] });
  await renderChat();
  await click('#chat-fab');
  await ask('Protein?');

  expect(aiChatService.send).toHaveBeenCalledWith('Protein?', null, guestId, { signal: expect.any(AbortSignal) });
  expect(container.textContent).toContain('Try tofu.');
  expect(container.textContent).toContain('Continue your conversation');
  expect(container.querySelector('a[href="/login"]')).not.toBeNull();
  expect(JSON.parse(sessionStorage.getItem('veganhelper-ai-chat-guest'))).toEqual({ sessionId: 7, guestSessionId: guestId });
});

test('member reopens saved conversation with authenticated history', async () => {
  useAuth.mockReturnValue({ user: { id: 31 }, isAuthenticated: true, isLoading: false });
  sessionStorage.setItem('veganhelper-ai-chat-member-31', JSON.stringify({ sessionId: 8, guestSessionId: null }));
  aiChatService.history.mockResolvedValue({ messages: [{ id: 3, senderType: 'ai', messageText: 'Welcome back.' }] });
  await renderChat();
  await click('#chat-fab');

  expect(aiChatService.history).toHaveBeenCalledWith(8, null, { signal: expect.any(AbortSignal) });
  expect(container.textContent).toContain('Welcome back.');
  expect(container.textContent).toContain('Uses your health profile when available');
});

test('provider failure keeps the draft and shows an actionable error', async () => {
  aiChatService.send.mockRejectedValue({ response: { status: 503 } });
  await renderChat();
  await click('#chat-fab');
  await ask('Lunch idea');

  expect(container.querySelector('input').value).toBe('Lunch idea');
  expect(container.querySelector('[role="alert"]').textContent).toContain('temporarily unavailable');
});

test('shows the question immediately, clears the composer and appends only one answer', async () => {
  let resolve;
  aiChatService.send.mockImplementation(() => new Promise((done) => { resolve = done; }));
  await renderChat();
  await click('#chat-fab');
  await ask('Quick lunch?');
  expect(container.querySelector('[role="log"]').textContent).toContain('Quick lunch?');
  expect(container.querySelector('input').value).toBe('');
  expect(container.querySelector('[aria-label="Stop AI response"] svg').classList.contains('animate-spin')).toBe(true);
  await act(async () => resolve({ sessionId: 7, guestSessionId: guestId, answer: 'Try lentils.', guestQuestionsRemaining: 2 }));
  expect(container.querySelector('[aria-label="Stop AI response"]')).toBeNull();
  expect(container.querySelector('[role="log"]').textContent.match(/Quick lunch\?/g)).toHaveLength(1);
  expect(container.textContent).toContain('Try lentils.');
});

test('stop aborts the request and rejects a late answer even after closing and reopening', async () => {
  let resolve;
  aiChatService.send.mockImplementation(() => new Promise((done) => { resolve = done; }));
  await renderChat();
  await click('#chat-fab');
  await ask('Quick lunch?');
  const signal = aiChatService.send.mock.calls[0][3].signal;
  await click('[aria-label="Stop AI response"]');
  expect(signal.aborted).toBe(true);
  expect(container.textContent).toContain('You stopped this request before a reply was received.');
  await click('[aria-label="Close AI assistant"]');
  await click('#chat-fab');
  await act(async () => resolve({ sessionId: 7, answer: 'Late answer', guestQuestionsRemaining: 2 }));
  expect(container.textContent).not.toContain('Late answer');
  expect(container.textContent).toContain('3 of 3 free questions remaining');
  expect(container.querySelector('[role="alert"]')).toBeNull();
});

test('a stopped request cannot clear the next request or overwrite its conversation', async () => {
  let resolveFirst, resolveSecond;
  aiChatService.send.mockImplementationOnce(() => new Promise((done) => { resolveFirst = done; }))
    .mockImplementationOnce(() => new Promise((done) => { resolveSecond = done; }));
  await renderChat();
  await click('#chat-fab');
  await ask('First question');
  await click('[aria-label="Stop AI response"]');
  await ask('Second question');
  await act(async () => resolveFirst({ sessionId: 11, answer: 'Old answer' }));
  expect(container.querySelector('[aria-label="Stop AI response"]')).not.toBeNull();
  await act(async () => resolveSecond({ sessionId: 12, guestSessionId: guestId, answer: 'New answer', guestQuestionsRemaining: 2 }));
  expect(container.textContent).toContain('New answer');
  expect(container.textContent).not.toContain('Old answer');
  expect(JSON.parse(sessionStorage.getItem('veganhelper-ai-chat-guest')).sessionId).toBe(12);
});

test('switching accounts aborts in-flight chat and clears its optimistic message', async () => {
  let resolve;
  aiChatService.send.mockImplementation(() => new Promise((done) => { resolve = done; }));
  await renderChat();
  await click('#chat-fab');
  await ask('Private question');
  const signal = aiChatService.send.mock.calls[0][3].signal;
  useAuth.mockReturnValue({ user: { id: 31 }, isAuthenticated: true, isLoading: false });
  await renderChat();
  expect(signal.aborted).toBe(true);
  await act(async () => resolve({ sessionId: 7, answer: 'Old account answer' }));
  expect(container.textContent).not.toContain('Private question');
  expect(container.textContent).not.toContain('Old account answer');
});
