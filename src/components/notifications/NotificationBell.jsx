import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import notificationsApi from '../../services/notificationService';
import { notificationTarget } from '../../utils/notificationTarget';
import { formatDateTime } from '../../utils/dateUtils';
import BrowserPushControl from './BrowserPushControl';
import { dropdownVariants, reducedMotionVariants } from '../ui/dropdownMotion';

export default function NotificationBell({ userId }) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [countError, setCountError] = useState('');
  const container = useRef(null);
  const trigger = useRef(null);
  const listRequest = useRef(null);
  const countRequest = useRef(null);
  const mutation = useRef(false);
  const alive = useRef(true);

  const fetchCount = useCallback(async () => {
    if (!userId || mutation.current) return;
    countRequest.current?.abort();
    const controller = new AbortController(); countRequest.current = controller;
    try {
      const result = await notificationsApi.getUnreadCount(controller.signal);
      if (!controller.signal.aborted && alive.current) { setUnread(result.unreadCount); setCountError(''); }
    } catch {
      if (!controller.signal.aborted && alive.current) setCountError('Unread count is unavailable. Reopen this menu to retry.');
    }
  }, [userId]);

  const load = useCallback(async (index = 1) => {
    if (!userId || mutation.current) return;
    listRequest.current?.abort();
    const controller = new AbortController(); listRequest.current = controller;
    setLoading(true); setError('');
    try {
      const result = await notificationsApi.getNotifications(index, 20, false, controller.signal);
      if (controller.signal.aborted || !alive.current) return;
      setItems(current => index === 1 ? result.items : [...new Map([...current, ...result.items].map(item => [item.id, item])).values()]);
      setPage(result.pageIndex); setPages(result.totalPages);
    } catch {
      if (!controller.signal.aborted && alive.current) setError('Could not load notifications. Please try again.');
    } finally { if (!controller.signal.aborted && alive.current) setLoading(false); }
  }, [userId]);

  useEffect(() => {
    alive.current = true;
    const refresh = () => { if (document.visibilityState !== 'hidden') fetchCount(); };
    fetchCount();
    const timer = setInterval(refresh, 60000);
    const receive = event => { if (event.data?.type === 'notification-received') { refresh(); } };
    window.addEventListener('focus', refresh);
    navigator.serviceWorker?.addEventListener('message', receive);
    return () => {
      alive.current = false; clearInterval(timer);
      listRequest.current?.abort(); countRequest.current?.abort();
      window.removeEventListener('focus', refresh);
      navigator.serviceWorker?.removeEventListener('message', receive);
    };
  }, [fetchCount]);

  useEffect(() => {
    if (!open) return;
    const outside = event => { if (!container.current?.contains(event.target)) setOpen(false); };
    const escape = event => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener('mousedown', outside); document.addEventListener('keydown', escape);
    // Receive push while the popup is open: reload the current inbox, without requesting permission.
    const receive = event => { if (event.data?.type === 'notification-received' && !mutation.current) load(); };
    navigator.serviceWorker?.addEventListener('message', receive);
    return () => {
      document.removeEventListener('mousedown', outside); document.removeEventListener('keydown', escape);
      navigator.serviceWorker?.removeEventListener('message', receive);
    };
  }, [open, load]);

  async function mark(item) {
    if (mutation.current) return;
    if (item?.isRead) { setOpen(false); navigate(notificationTarget(item.targetUrl)); return; }
    mutation.current = true; setBusy(true); setError('');
    // A stale poll/list response must not overwrite the result of marking notifications read.
    countRequest.current?.abort(); listRequest.current?.abort(); setLoading(false);
    try {
      const result = item ? await notificationsApi.markAsRead(item.id) : await notificationsApi.markAllAsRead();
      if (!alive.current) return;
      setUnread(result.unreadCount); setCountError('');
      setItems(current => current.map(value => !item || value.id === item.id ? { ...value, isRead: true } : value));
      if (item) { setOpen(false); navigate(notificationTarget(item.targetUrl)); }
    } catch {
      if (alive.current) setError('Could not mark notifications as read. Please try again.');
    } finally { mutation.current = false; if (alive.current) setBusy(false); }
  }

  const dateLabel = value => formatDateTime(value);
  const activeVariants = shouldReduceMotion ? reducedMotionVariants : dropdownVariants;

  return (
    <div ref={container} className="relative flex items-center">
      <button
        type="button"
        ref={trigger}
        title="Notifications"
        aria-label={`Notifications, ${unread} unread`}
        aria-expanded={open}
        aria-controls="notification-inbox"
        onClick={() => {
          setOpen(current => !current);
          if (!open) {
            fetchCount();
            load();
          }
        }}
        className="relative w-9 h-9 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] bg-[#FDFBF6] focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none transition-all cursor-pointer"
      >
        <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
        </svg>
        {unread > 0 && (
          <span aria-hidden="true" className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#A63446] text-white text-[10px] font-bold">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.section
            id="notification-inbox"
            aria-label="Notification inbox"
            className="fixed right-3 top-[4.5rem] w-[calc(100vw-1.5rem)] max-w-96 max-h-[calc(100dvh-5rem)] sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-96 bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl shadow-lg z-50 overflow-y-auto origin-top-right"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={activeVariants}
          >
            <div className="p-4 border-b border-[#DCE3D5] flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-fraunces font-semibold text-[#2B2A25]">Notifications</h2>
              {unread > 0 && (
                <button
                  type="button"
                  disabled={busy || loading}
                  onClick={() => mark(null)}
                  className="text-xs text-[#2F5233] underline disabled:opacity-50"
                >
                  Mark all as read
                </button>
              )}
            </div>
            {countError && <p role="status" className="px-4 pt-3 text-xs text-[#A63446]">{countError}</p>}
            {error && (
              <div role="alert" className="p-4 text-sm text-[#A63446]">
                {error}{' '}
                <button
                  type="button"
                  disabled={busy || loading}
                  onClick={() => {
                    fetchCount();
                    load();
                  }}
                  className="underline"
                >
                  Retry
                </button>
              </div>
            )}
            <div aria-busy={loading || busy} className="divide-y divide-[#DCE3D5] max-h-80 overflow-y-auto">
              {items.map(item => (
                <button
                  type="button"
                  key={item.id}
                  disabled={busy}
                  onClick={() => mark(item)}
                  className={`block w-full text-left p-4 hover:bg-[#E9EFE6] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2F5233] disabled:opacity-60 ${
                    item.isRead ? 'bg-[#FDFBF6]' : 'bg-[#F3F6EE]'
                  }`}
                >
                  <span className={`block text-sm text-[#2B2A25] ${item.isRead ? 'font-medium' : 'font-semibold'}`}>
                    {item.title}
                    {!item.isRead && <span className="sr-only"> (unread)</span>}
                  </span>
                  <span className="block mt-1 text-[13px] text-[#4A4D44] whitespace-pre-wrap break-words">{item.message}</span>
                  <time dateTime={item.createdAt} className="block mt-1 text-xs text-[#6B6F63]">
                    {dateLabel(item.createdAt)}
                  </time>
                </button>
              ))}
              {!loading && !error && items.length === 0 && (
                <p className="p-6 text-center text-sm text-[#6B6F63]">You have no notifications yet.</p>
              )}
            </div>
            {loading && <p role="status" className="p-4 text-sm text-[#6B6F63]">Loading notifications…</p>}
            {page < pages && (
              <button
                type="button"
                disabled={loading || busy}
                onClick={() => load(page + 1)}
                className="w-full p-3 text-sm text-[#2F5233] font-semibold disabled:opacity-50"
              >
                Load more
              </button>
            )}
            <BrowserPushControl userId={userId} />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
