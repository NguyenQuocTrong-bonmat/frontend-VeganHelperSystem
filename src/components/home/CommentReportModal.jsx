import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function CommentReportModal({ open, onClose, onSubmit, busy }) {
  const [reason, setReason] = useState('');
  const dialog = useRef(null);
  const latest = useRef({ busy, onClose });
  latest.current = { busy, onClose };
  useEffect(() => {
    if (!open) return;
    setReason('');
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.querySelector('textarea')?.focus();
    const key = event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); if (!latest.current.busy) latest.current.onClose(); }
      if (event.key === 'Tab') {
        const items = [...dialog.current.querySelectorAll('button:not(:disabled), textarea:not(:disabled)')];
        if (!items.length) { event.preventDefault(); return; }
        const first = items[0], last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', key, true);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', key, true); previous?.focus(); };
  }, [open]);
  if (!open) return null;
  return createPortal(<div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 p-4" onClick={() => { if (!latest.current.busy) latest.current.onClose(); }}>
    <section ref={dialog} role="dialog" aria-modal="true" aria-labelledby="comment-report-title" className="w-full max-w-md rounded-2xl border border-[#DCE3D5] bg-[#FDFBF6] p-6 shadow-xl" onClick={event => event.stopPropagation()}>
      <h2 id="comment-report-title" className="text-xl font-semibold text-[#26342B]">Report comment</h2>
      <p className="mt-2 text-sm text-[#6B6F63]">Tell the moderation team what is wrong. Your report will be reviewed; reporting does not immediately delete the comment.</p>
      <form onSubmit={event => { event.preventDefault(); if (reason.trim() && !busy) onSubmit(reason.trim()); }}>
        <label className="mt-4 block text-sm font-medium" htmlFor="comment-report-reason">Reason</label>
        <textarea id="comment-report-reason" required maxLength={500} rows={4} disabled={busy} value={reason} onChange={event => setReason(event.target.value)} className="mt-2 w-full rounded-xl border border-[#DCE3D5] bg-white p-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F5233]" />
        <p className="text-right text-xs text-[#6B6F63]">{reason.length}/500</p>
        <div className="mt-5 flex justify-end gap-3"><button type="button" disabled={busy} onClick={onClose} className="min-h-11 rounded-xl border px-4 text-sm">Cancel</button><button disabled={busy || !reason.trim()} className="min-h-11 rounded-xl bg-[#2F5233] px-4 text-sm text-white disabled:opacity-50">{busy ? 'Submitting?' : 'Submit report'}</button></div>
      </form>
    </section>
  </div>, document.body);
}
