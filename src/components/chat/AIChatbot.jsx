import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { aiChatService } from '../../services/aiChatService';
import ChatMarkdown from './ChatMarkdown';

const welcome = 'Hello! Ask me about plant-based meals, ingredients, or balanced nutrition.';
const guestIdentityKey = 'veganhelper-ai-chat-guest-id';
const guestStateKey = 'veganhelper-ai-chat-guest-state';
const guestConversationKey = 'veganhelper-ai-chat-guest';
const memberConversationPrefix = 'veganhelper-ai-chat-member-';

function clearConversationOnReload() {
  try {
    const navigation = performance.getEntriesByType('navigation')?.[0];
    if (navigation?.type !== 'reload') return;

    for (let index = sessionStorage.length - 1; index >= 0; index -= 1) {
      const key = sessionStorage.key(index);
      if (key === guestConversationKey || key?.startsWith(memberConversationPrefix)) {
        sessionStorage.removeItem(key);
      }
    }
  } catch {
    // Storage may be unavailable in restricted browser contexts.
  }
}

clearConversationOnReload();

function readGuestRemaining() {
  try {
    const guestSessionId = localStorage.getItem(guestIdentityKey);
    const state = JSON.parse(localStorage.getItem(guestStateKey) || 'null');
    if (guestSessionId && state?.guestSessionId === guestSessionId && Number.isInteger(state.remaining)) {
      return Math.max(0, Math.min(3, state.remaining));
    }
  } catch {
    // Fall back to the trial allowance when browser storage is unavailable.
  }
  return 3;
}

function saveGuestRemaining(guestSessionId, remaining) {
  try {
    localStorage.setItem(guestStateKey, JSON.stringify({
      guestSessionId,
      remaining: Math.max(0, Math.min(3, remaining)),
    }));
  } catch {
    // The server remains authoritative for the guest trial limit.
  }
}

function readSession(key) {
  try {
    const value = JSON.parse(sessionStorage.getItem(key) || 'null');
    return value && Number.isSafeInteger(value.sessionId) && value.sessionId > 0 ? value : null;
  } catch {
    return null;
  }
}

function errorText(error) {
  const status = error.response?.status;
  if (status === 429 && error.response?.data?.code === 'GUEST_CHAT_LIMIT_REACHED') return 'Your three free questions are used. Sign in or create an account to continue.';
  if (status === 429) return 'Too many requests right now. Please try again later.';
  if (status === 503 || status === 502) return 'The AI assistant is temporarily unavailable. Please try again later.';
  if (status === 422) return 'I could not answer that question. Please try wording it differently.';
  if (status === 404) return 'This conversation is no longer available. Start a new one.';
  if (status === 400) return error.response?.data?.error || 'Please check your question and try again.';
  return 'Unable to reach the assistant. Please try again.';
}

export default function AIChatbot() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([]);
  const [session, setSession] = useState(null);
  const [remaining, setRemaining] = useState(readGuestRemaining);
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [limitReached, setLimitReached] = useState(false);
  const endRef = useRef(null);
  const activeScope = useRef('');
  const skipHistoryForSession = useRef(null);
  const pendingRequest = useRef(null);
  const hasLocalMessages = useRef(false);
  const storageKey = authLoading ? null : isAuthenticated ? `${memberConversationPrefix}${user?.id}` : guestConversationKey;

  useEffect(() => {
    if (!storageKey || storageKey === activeScope.current) return;
    activeScope.current = storageKey;
    pendingRequest.current?.controller.abort();
    pendingRequest.current = null;
    hasLocalMessages.current = false;
    setBusy(false);
    setSending(false);
    skipHistoryForSession.current = null;
    setSession(readSession(storageKey));
    setMessages([]);
    setDraft('');
    setError('');
    const guestRemaining = isAuthenticated ? 3 : readGuestRemaining();
    setRemaining(guestRemaining);
    setLimitReached(!isAuthenticated && guestRemaining === 0);
  }, [storageKey, isAuthenticated]);

  useEffect(() => {
    if (!isOpen || !storageKey || !session?.sessionId || hasLocalMessages.current) return;
    if (skipHistoryForSession.current === session.sessionId) {
      skipHistoryForSession.current = null;
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    setBusy(true);
    aiChatService.history(session.sessionId, isAuthenticated ? null : session.guestSessionId, { signal: controller.signal })
      .then((history) => {
        if (cancelled || hasLocalMessages.current) return;
        setMessages(history.messages || []);
      })
      .catch((cause) => {
        if (cancelled) return;
        if (cause.response?.status === 404) {
          sessionStorage.removeItem(storageKey);
          setSession(null);
        }
        setError(errorText(cause));
      })
      .finally(() => { if (!cancelled) setBusy(false); });
    return () => { cancelled = true; controller.abort(); };
  }, [isOpen, isAuthenticated, session?.sessionId, session?.guestSessionId, storageKey]);

  useEffect(() => { endRef.current?.scrollIntoView?.({ behavior: 'smooth' }); }, [messages, busy, isOpen]);

  useEffect(() => () => {
    pendingRequest.current?.controller.abort();
    pendingRequest.current = null;
  }, []);

  function stopResponse() {
    const request = pendingRequest.current;
    if (!request) return;
    pendingRequest.current = null;
    request.controller.abort();
    setMessages((previous) => [...previous.map((item) => item.id === request.messageId ? { ...item, delivery: 'stopped' } : item),
      { id: `stopped-${request.messageId}`, senderType: 'system', messageText: 'You stopped this request before a reply was received.' },
    ]);
    setBusy(false);
    setSending(false);
    setError('');
  }

  async function send(event) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || busy || pendingRequest.current || authLoading || !storageKey || limitReached) return;
    const scope = storageKey;
    const guestSessionId = isAuthenticated ? null : session?.guestSessionId || localStorage.getItem(guestIdentityKey) || crypto.randomUUID();
    if (!isAuthenticated) localStorage.setItem(guestIdentityKey, guestSessionId);
    const request = { controller: new AbortController(), messageId: crypto.randomUUID() };
    pendingRequest.current = request;
    hasLocalMessages.current = true;
    setBusy(true);
    setSending(true);
    setError('');
    setDraft('');
    setMessages((previous) => [...previous, { id: request.messageId, senderType: 'user', messageText: message, delivery: 'pending' }]);
    try {
      const result = await aiChatService.send(message, session?.sessionId || null, guestSessionId, { signal: request.controller.signal });
      if (activeScope.current !== scope || pendingRequest.current !== request || request.controller.signal.aborted) return;
      const nextSession = { sessionId: result.sessionId, guestSessionId: result.guestSessionId || null };
      sessionStorage.setItem(scope, JSON.stringify(nextSession));
      skipHistoryForSession.current = result.sessionId;
      setSession(nextSession);
      setMessages((previous) => [...previous.map((item) => item.id === request.messageId ? { ...item, delivery: 'sent' } : item),
      {
        id: `ai-${Date.now()}`,
        senderType: 'ai',
        messageText: result.answer,
        recommendedPosts: Array.isArray(result.recommendedPosts) ? result.recommendedPosts.slice(0, 3) : [],
      },
      ]);
      if (!isAuthenticated && typeof result.guestQuestionsRemaining === 'number') {
        const guestRemaining = Math.max(0, Math.min(3, result.guestQuestionsRemaining));
        setRemaining(guestRemaining);
        setLimitReached(guestRemaining === 0);
        saveGuestRemaining(guestSessionId, guestRemaining);
      }
    } catch (cause) {
      if (activeScope.current !== scope || pendingRequest.current !== request || request.controller.signal.aborted) return;
      setMessages((previous) => previous.map((item) => item.id === request.messageId ? { ...item, delivery: 'failed' } : item));
      setDraft((current) => current || message);
      setError(errorText(cause));
      if (cause.response?.data?.code === 'GUEST_CHAT_LIMIT_REACHED') {
        setLimitReached(true);
        setRemaining(0);
        if (guestSessionId) saveGuestRemaining(guestSessionId, 0);
      }
    } finally {
      if (activeScope.current === scope && pendingRequest.current === request) {
        pendingRequest.current = null;
        setBusy(false);
        setSending(false);
      }
    }
  }

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpen);
    return () => window.removeEventListener('open-ai-chat', handleOpen);
  }, []);

  return (
    <aside className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50">
      {isOpen ? (
        <section aria-label="AI Nutrition Assistant" className="relative flex h-[min(520px,85vh)] w-[calc(100vw-3rem)] sm:w-[380px] flex-col overflow-hidden rounded-2xl border border-[#DCE3D5] bg-[#FDFBF6] shadow-xl">
          <header className="flex items-center justify-between border-b border-[#DCE3D5] px-4 py-3">
            <div>
              <h2 className="font-semibold text-[#2B2A25]">AI Nutrition Assistant</h2>
              <p className="text-xs text-[#6B6F63]">{isAuthenticated ? 'Uses your health profile when available' : `${remaining} of 3 free questions remaining`}</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close AI assistant" className="rounded-lg px-2 py-1 text-[#2B2A25] hover:bg-[#EAF0E9] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none cursor-pointer">×</button>
          </header>
          <div role="log" aria-live="polite" aria-relevant="additions" className="flex-1 space-y-3 overflow-y-auto bg-[#F3F6EE]/40 p-4 text-sm">
            <p className="max-w-[88%] rounded-xl border border-[#DCE3D5] bg-white p-3 text-[#2B2A25]">{welcome}</p>
            {messages.map((item, index) => (
              <div key={item.id || index} className={`max-w-[88%] break-words rounded-xl p-3 ${item.senderType === 'user' ? 'ml-auto whitespace-pre-wrap bg-[#2F5233] text-white' : 'border border-[#DCE3D5] bg-white text-[#2B2A25]'}`}>
                {item.senderType === 'ai' ? <ChatMarkdown content={item.messageText} /> : item.senderType === 'system' ? <p role="status" className="text-xs text-[#6B6F63]">{item.messageText}</p> : item.messageText}
                {item.delivery === 'failed' && <p className="mt-1 text-xs">Not sent successfully. Please try again.</p>}
                {item.senderType === 'ai' && Array.isArray(item.recommendedPosts) && item.recommendedPosts.length > 0 && (
                  <div aria-label="Suggested VeganHelper posts" className="mt-3 space-y-2">
                    {item.recommendedPosts.slice(0, 3).map((post) => {
                      const postId = post?.postId;
                      const title = typeof post?.title === 'string' ? post.title.trim() : '';
                      if (!postId || !title) return null;

                      return (
                        <Link
                          key={postId}
                          to={isAuthenticated ? `/posts/${postId}` : `/posts/${postId}/guest`}
                          onClick={() => setIsOpen(false)}
                          aria-label={`Open recipe post: ${title}`}
                          className="flex min-h-16 min-w-0 items-center gap-3 rounded-xl border border-[#DCE3D5] bg-[#F8FAF5] p-2 text-[#2B2A25] transition-colors hover:bg-[#EAF0E9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F5233]"
                        >
                          {post.thumbnailUrl && (
                            <img
                              src={post.thumbnailUrl}
                              alt=""
                              loading="lazy"
                              width="56"
                              height="56"
                              className="h-14 w-14 shrink-0 rounded-lg object-cover"
                            />
                          )}
                          <span className="min-w-0 flex-1 font-medium leading-snug [overflow-wrap:anywhere]">{title}</span>
                          <span aria-hidden="true" className="shrink-0 text-[#2F5233]">→</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {busy && <p className="text-xs text-[#6B6F63]">Assistant is responding…</p>}
            <div ref={endRef} />
          </div>
          {error && <p role="alert" className="px-4 py-2 text-sm text-red-700">{error}</p>}
          <form onSubmit={send} className="flex gap-2 border-t border-[#DCE3D5] p-3">
            <input aria-label="Ask the AI assistant" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={4000} disabled={authLoading || limitReached} placeholder="Ask about plant-based food…" className="min-w-0 flex-1 rounded-xl border border-[#DCE3D5] bg-white px-3 py-2 text-sm text-[#2B2A25] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:border-[#2F5233] disabled:opacity-60" />
            {sending ? (
              <button type="button" onClick={stopResponse} aria-label="Stop AI response" className="flex min-h-11 items-center gap-2 rounded-xl bg-[#2F5233] px-3 py-2 text-sm font-medium text-white hover:bg-[#1E3B21] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5233]">
                <svg aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.3" /><path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                Stop
              </button>
            ) : <button type="submit" disabled={busy || authLoading || limitReached || !draft.trim()} className="min-h-11 rounded-xl bg-[#2F5233] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E3B21] transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-1 active:scale-95 motion-reduce:transform-none cursor-pointer disabled:active:scale-100">Send</button>}
          </form>
          {limitReached && !isAuthenticated && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1E3B21]/35 p-5">
              <div className="rounded-2xl bg-white p-5 text-center shadow-xl">
                <h3 className="font-semibold text-[#2B2A25]">Continue your conversation</h3>
                <p className="mt-2 text-sm text-[#6B6F63]">You have used your three free questions. Sign in or create an account to keep chatting.</p>
                <div className="mt-4 flex justify-center gap-3 text-sm">
                  <Link to="/login" className="rounded-lg bg-[#2F5233] px-4 py-2 text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none">Log in</Link>
                  <Link to="/sign-up" className="rounded-lg border border-[#2F5233] px-4 py-2 text-[#2F5233] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none">Sign up</Link>
                </div>
                <button type="button" onClick={() => setIsOpen(false)} className="mt-4 text-sm text-[#6B6F63] underline hover:text-[#2F5233] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] rounded px-1 active:opacity-80">Close</button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <button id="chat-fab" type="button" onClick={() => setIsOpen(true)} aria-label="Open AI Nutrition Assistant" className="hidden md:flex h-14 w-14 items-center justify-center rounded-full bg-[#2F5233] text-white shadow-lg transition-all hover:scale-105 hover:bg-[#1E3B21] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none cursor-pointer">
          <svg aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3zM18 17l.7 2.3L21 20l-2.3.7L18 23l-.7-2.3L15 20l2.3-.7L18 17z" /></svg>
        </button>
      )}
    </aside>
  );
}
