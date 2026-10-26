import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { aiChatService } from '../../services/aiChatService';
import ChatMarkdown from './ChatMarkdown';

const welcome = 'Hello! Ask me about plant-based meals, ingredients, or balanced nutrition.';
const guestIdentityKey = 'veganhelper-ai-chat-guest-id';

function readSession(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
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
  const [remaining, setRemaining] = useState(3);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [limitReached, setLimitReached] = useState(false);
  const endRef = useRef(null);
  const activeScope = useRef('');
  const skipHistoryForSession = useRef(null);
  const storageKey = authLoading ? null : isAuthenticated ? `veganhelper-ai-chat-member-${user?.id}` : 'veganhelper-ai-chat-guest';

  useEffect(() => {
    if (!storageKey || storageKey === activeScope.current) return;
    activeScope.current = storageKey;
    skipHistoryForSession.current = null;
    setSession(readSession(storageKey));
    setMessages([]);
    setDraft('');
    setError('');
    setRemaining(3);
    setLimitReached(false);
  }, [storageKey]);

  useEffect(() => {
    if (!isOpen || !storageKey || !session?.sessionId) return;
    if (skipHistoryForSession.current === session.sessionId) {
      skipHistoryForSession.current = null;
      return;
    }
    let cancelled = false;
    setBusy(true);
    aiChatService.history(session.sessionId, isAuthenticated ? null : session.guestSessionId)
      .then((history) => {
        if (cancelled) return;
        setMessages(history.messages || []);
        if (!isAuthenticated) {
          const used = (history.messages || []).filter((message) => message.senderType === 'ai').length;
          setRemaining(Math.max(0, 3 - used));
          setLimitReached(used >= 3);
        }
      })
      .catch((cause) => {
        if (cancelled) return;
        if (cause.response?.status === 404) {
          localStorage.removeItem(storageKey);
          setSession(null);
        }
        setError(errorText(cause));
      })
      .finally(() => { if (!cancelled) setBusy(false); });
    return () => { cancelled = true; };
  }, [isOpen, isAuthenticated, session?.sessionId, session?.guestSessionId, storageKey]);

  useEffect(() => { endRef.current?.scrollIntoView?.({ behavior: 'smooth' }); }, [messages, busy, isOpen]);

  async function send(event) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || busy || authLoading || !storageKey || limitReached) return;
    const scope = storageKey;
    const guestSessionId = isAuthenticated ? null : session?.guestSessionId || localStorage.getItem(guestIdentityKey) || crypto.randomUUID();
    if (!isAuthenticated) localStorage.setItem(guestIdentityKey, guestSessionId);
    setBusy(true);
    setError('');
    try {
      const result = await aiChatService.send(message, session?.sessionId || null, guestSessionId);
      if (activeScope.current !== scope) return;
      const nextSession = { sessionId: result.sessionId, guestSessionId: result.guestSessionId || null };
      localStorage.setItem(scope, JSON.stringify(nextSession));
      skipHistoryForSession.current = result.sessionId;
      setSession(nextSession);
      setMessages((previous) => [...previous,
      { id: `user-${Date.now()}`, senderType: 'user', messageText: message },
      {
        id: `ai-${Date.now()}`,
        senderType: 'ai',
        messageText: result.answer,
        recommendedPosts: Array.isArray(result.recommendedPosts) ? result.recommendedPosts.slice(0, 3) : [],
      },
      ]);
      setDraft('');
      if (!isAuthenticated && typeof result.guestQuestionsRemaining === 'number') {
        setRemaining(result.guestQuestionsRemaining);
        setLimitReached(result.guestQuestionsRemaining === 0);
      }
    } catch (cause) {
      if (activeScope.current !== scope) return;
      setError(errorText(cause));
      if (cause.response?.data?.code === 'GUEST_CHAT_LIMIT_REACHED') setLimitReached(true);
    } finally {
      if (activeScope.current === scope) setBusy(false);
    }
  }

  return (
    <aside className="fixed bottom-6 right-6 z-50">
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
                {item.senderType === 'ai' ? <ChatMarkdown content={item.messageText} /> : item.messageText}
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
            <button type="submit" disabled={busy || authLoading || limitReached || !draft.trim()} className="rounded-xl bg-[#2F5233] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E3B21] transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-1 active:scale-95 motion-reduce:transform-none cursor-pointer disabled:active:scale-100">Send</button>
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
        <button id="chat-fab" type="button" onClick={() => setIsOpen(true)} aria-label="Open AI Nutrition Assistant" className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2F5233] text-white shadow-lg transition-all hover:scale-105 hover:bg-[#1E3B21] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none cursor-pointer">
          <svg aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3zM18 17l.7 2.3L21 20l-2.3.7L18 23l-.7-2.3L15 20l2.3-.7L18 17z" /></svg>
        </button>
      )}
    </aside>
  );
}
