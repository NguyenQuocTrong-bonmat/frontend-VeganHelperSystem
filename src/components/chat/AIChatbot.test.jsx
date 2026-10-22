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

  expect(aiChatService.send).toHaveBeenCalledWith('Protein?', null, guestId);
  expect(container.textContent).toContain('Try tofu.');
  expect(container.textContent).toContain('Continue your conversation');
  expect(container.querySelector('a[href="/login"]')).not.toBeNull();
  expect(JSON.parse(localStorage.getItem('veganhelper-ai-chat-guest'))).toEqual({ sessionId: 7, guestSessionId: guestId });
});

test('member reopens saved conversation with authenticated history', async () => {
  useAuth.mockReturnValue({ user: { id: 31 }, isAuthenticated: true, isLoading: false });
  localStorage.setItem('veganhelper-ai-chat-member-31', JSON.stringify({ sessionId: 8, guestSessionId: null }));
  aiChatService.history.mockResolvedValue({ messages: [{ id: 3, senderType: 'ai', messageText: 'Welcome back.' }] });
  await renderChat();
  await click('#chat-fab');

  expect(aiChatService.history).toHaveBeenCalledWith(8, null);
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
