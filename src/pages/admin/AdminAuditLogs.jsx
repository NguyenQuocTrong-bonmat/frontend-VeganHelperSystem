import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ModalMotion from '../../components/ui/ModalMotion';
import { getAdminAuditLogs, getAdminAuditLogById } from '../../services/adminService';

const ACTIONS = {
  'member.ban': ['Restricted an account', 'Account', 'The administrator applied an account restriction.'],
  'member.unban': ['Lifted an account restriction', 'Account', 'The administrator lifted an account restriction.'],
  'category.create': ['Created a category', 'Category', 'A category was added for organizing content.'],
  'category.update': ['Updated a category', 'Category', 'Category information was changed.'],
  'category.delete': ['Deleted a category', 'Category', 'A category was deleted.'],
  'post.approve': ['Approved a post', 'Post', 'The post was approved for publication.'],
  'post.reject': ['Rejected a post', 'Post', 'The administrator rejected the post.'],
  'post.remove': ['Hid a post', 'Post', 'The administrator hid the post from public view.'],
  'ai_flag.keep': ['Kept a flagged post', 'Post', 'After reviewing an automatically flagged post, the administrator chose to keep it.'],
  'ai_flag.remove': ['Hid a flagged post', 'Post', 'After reviewing an automatically flagged post, the administrator hid it from public view.'],
  'report.dismiss': ['Dismissed a post report', 'Post', 'The administrator closed the report without applying a removal.'],
  'report.keep': ['Kept a reported post', 'Post', 'The administrator reviewed the report and chose to keep the post.'],
  'report.remove': ['Hid a reported post', 'Post', 'The administrator reviewed the report and hid the post from public view.'],
  'comment_report.dismiss': ['Dismissed a comment report', 'Comment', 'The administrator closed the comment report.'],
  'comment_report.keep': ['Kept a reported comment', 'Comment', 'The administrator reviewed the report and restored or kept the comment.'],
  'comment_report.remove': ['Deleted a reported comment', 'Comment', 'The administrator reviewed the report and deleted the comment.'],
  'moderation.settings.update': ['Updated content review preferences', 'Content review', 'The administrator changed the content review preferences.'],
};
const describe = (entry) => ACTIONS[entry.action] || ['Administrative change', 'Other', 'An administrative change was recorded.'];
const person = (name, username, fallback) => name?.trim() || (username ? `@${username}` : fallback);
const adminName = (entry) => person(entry.adminName, entry.adminUsername, 'Administrator name unavailable');
const ownerName = (entry) => person(entry.ownerName, entry.ownerUsername, 'Owner information unavailable');
const subjectName = (entry) => entry.subjectName?.trim() || (entry.subjectType === 'comment'
  ? `Comment by ${ownerName(entry)}` : `${describe(entry)[1]} information unavailable`);
export function formatAuditTime(value) {
  if (!value) return 'Time not recorded';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Time not recorded';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23', timeZoneName: 'shortOffset',
  }).format(date);
}
export function auditCsv(entries) {
  const cell = (value) => {
    let text = String(value ?? '');
    if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  return [['Date and time', 'Administrator', 'Activity', 'Affected item', 'Content owner', 'Related post'],
    ...entries.map((entry) => [formatAuditTime(entry.createdAt), adminName(entry), describe(entry)[0],
      subjectName(entry), entry.ownerName || entry.ownerUsername ? ownerName(entry) : '', entry.postTitle || ''])]
    .map((row) => row.map(cell).join(',')).join('\r\n');
}
const buttonClass = 'min-h-11 rounded-xl border border-[#DCE3D5] px-4 py-2 text-sm font-semibold text-[#2F5233] hover:bg-[#EDF2E9] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] transition-colors';
const inputClass = 'mt-2 w-full min-h-11 rounded-xl border border-[#DCE3D5] bg-white px-3 py-2 text-sm text-[#2B2A25] focus:outline-none focus:ring-2 focus:ring-[#2F5233]';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState('');
  const [period, setPeriod] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const detailSequence = useRef(0);
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError('');
    setLogs([]);
    const params = { pageIndex: page, pageSize, importantOnly: true };
    if (action) params.action = action;
    if (period) {
      const start = new Date();
      if (period === 'today') start.setHours(0, 0, 0, 0);
      else start.setDate(start.getDate() - Number(period));
      params.from = start.toISOString();
    }
    getAdminAuditLogs(params, controller.signal).then((data) => {
      if (!active) return;
      setLogs(data.items || []);
      setTotal(Number(data.totalItems ?? data.totalCount ?? 0));
    }).catch((err) => {
      if (active) { setError(err?.message || 'Activity could not be loaded. Please try again.'); setTotal(0); }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [page, action, period, refresh]);

  const closeDetails = useCallback(() => {
    detailSequence.current += 1;
    setSelected(null);
    triggerRef.current?.focus();
  }, []);
  useEffect(() => {
    if (selected) dialogRef.current?.querySelector('button')?.focus();
  }, [selected?.id]);
  useEffect(() => () => { detailSequence.current += 1; }, []);

  const showDetails = async (entry, trigger) => {
    if (trigger) triggerRef.current = trigger;
    const sequence = ++detailSequence.current;
    setSelected(entry);
    setDetailLoading(true);
    setDetailError('');
    try {
      const detail = await getAdminAuditLogById(entry.id);
      if (sequence === detailSequence.current) setSelected(detail);
    } catch {
      if (sequence === detailSequence.current) setDetailError('The latest details could not be loaded. The information below is from the activity list.');
    } finally { if (sequence === detailSequence.current) setDetailLoading(false); }
  };
  const exportPage = () => {
    const url = URL.createObjectURL(new Blob(['\uFEFF', auditCsv(logs)], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-activity-page-${page}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  const trapFocus = (event) => {
    if (event.key !== 'Tab') return;
    const controls = dialogRef.current?.querySelectorAll('button:not(:disabled), a[href]');
    if (!controls?.length) return;
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  const detailsButton = (entry) => <button type="button" className={buttonClass}
    aria-label={`View details: ${describe(entry)[0]} — ${subjectName(entry)}`}
    onClick={(event) => showDetails(entry, event.currentTarget)}>View details</button>;

  return <AdminLayout>
    <div className="mx-auto max-w-7xl text-[#2B2A25]">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div><p className="text-xs uppercase tracking-widest font-bold text-[#587350] mb-2">Administration history</p>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#606658]">See who changed an account, reviewed content, or updated a category, and when it happened. Only recorded administrator changes appear here.</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0"><button type="button" className={buttonClass} disabled={loading} onClick={() => setRefresh((value) => value + 1)}>Refresh</button>
          <button type="button" className={buttonClass} disabled={loading || !logs.length} onClick={exportPage}>Export this page</button></div>
      </header>
      <section aria-label="Activity filters" className="mb-5 rounded-2xl border border-[#DCE3D5] bg-white p-4 sm:p-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <label className="text-sm font-semibold">Activity
            <select className={inputClass} value={action} onChange={(event) => { setAction(event.target.value); setPage(1); }}>
              <option value="">All activities</option>
              {Object.entries(ACTIONS).map(([key, value]) => <option key={key} value={key}>{value[0]}</option>)}
            </select></label>
          <label className="text-sm font-semibold">Time period
            <select className={inputClass} value={period} onChange={(event) => { setPeriod(event.target.value); setPage(1); }}>
              <option value="">All time</option><option value="today">Today</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option>
            </select></label>
          <button className={buttonClass} type="button" onClick={() => { setAction(''); setPeriod(''); setPage(1); }}>Reset filters</button>
        </div>
      </section>
      <section aria-label="Recorded administrator changes" className="rounded-2xl border border-[#DCE3D5] bg-white overflow-hidden">
        <div className="flex flex-wrap gap-2 items-center justify-between border-b border-[#E5E9DF] px-5 py-4">
          <h2 className="font-bold">Recorded changes <span className="ml-2 rounded-full bg-[#EDF2E9] px-3 py-1 text-sm text-[#2F5233]">{loading ? '…' : total.toLocaleString()}</span></h2>
          <p className="text-xs text-[#606658]">Newest first · Times shown in your local time zone</p>
        </div>
        {loading ? <p role="status" className="p-10 text-center text-[#606658]">Loading activity…</p>
          : error ? <div role="alert" className="p-8 text-center"><p className="mb-4 text-red-700">{error}</p><button className={buttonClass} onClick={() => setRefresh((value) => value + 1)}>Try again</button></div>
          : !logs.length ? <div className="p-12 text-center"><h3 className="font-semibold">No changes found</h3><p className="mt-2 text-sm text-[#606658]">Try another activity or a wider time period.</p></div>
          : <>
            <div className="hidden md:block overflow-x-auto"><table className="w-full text-left text-sm">
              <thead className="bg-[#F5F7F1] text-xs uppercase tracking-wide text-[#606658]"><tr>{['Date and time', 'Administrator', 'Activity', 'Affected item', 'Details'].map((label) => <th key={label} scope="col" className="px-5 py-4 font-semibold">{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-[#E5E9DF]">{logs.map((entry) => <tr key={entry.id} className="hover:bg-[#FAFBF8]">
                <td className="px-5 py-5 text-[#606658] whitespace-nowrap"><time dateTime={entry.createdAt || undefined}>{formatAuditTime(entry.createdAt)}</time></td>
                <td className="px-5 py-5"><p className="font-semibold break-words">{adminName(entry)}</p>{entry.adminUsername && entry.adminName && <p className="mt-1 text-xs text-[#606658]">@{entry.adminUsername}</p>}</td>
                <td className="px-5 py-5"><span className="rounded-lg bg-[#EDF2E9] px-2.5 py-1.5 text-[#2F5233] font-medium inline-block">{describe(entry)[0]}</span></td>
                <td className="px-5 py-5 max-w-xs"><p className="text-xs text-[#606658] mb-1">{describe(entry)[1]}</p><p className="font-semibold break-words line-clamp-2">{subjectName(entry)}</p>{entry.subjectType === 'post' && <p className="mt-1 text-xs text-[#606658]">By {ownerName(entry)}</p>}</td>
                <td className="px-5 py-5">{detailsButton(entry)}</td>
              </tr>)}</tbody>
            </table></div>
            <ul className="md:hidden divide-y divide-[#E5E9DF]">{logs.map((entry) => <li key={entry.id} className="p-5 space-y-3">
              <time className="text-xs text-[#606658]" dateTime={entry.createdAt || undefined}>{formatAuditTime(entry.createdAt)}</time>
              <div><p className="font-semibold">{describe(entry)[0]}</p><p className="mt-1 text-sm break-words">{subjectName(entry)}</p></div>
              <p className="text-sm text-[#606658]">By {adminName(entry)}</p>{detailsButton(entry)}
            </li>)}</ul>
          </>}
        {!loading && !error && total > 0 && <nav aria-label="Activity pagination" className="flex flex-wrap gap-3 items-center justify-between border-t border-[#E5E9DF] p-4">
          <p className="text-sm text-[#606658]">Page {page} of {totalPages} · {pageSize} changes per page</p>
          <div className="flex gap-2"><button className={buttonClass} disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button>
            <button className={buttonClass} disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)}>Next</button></div>
        </nav>}
      </section>
      <p className="mt-4 text-xs leading-5 text-[#606658]">Names and titles reflect currently available records. Older entries may no longer have a related account, post, or category to display. This history does not show ordinary member activity.</p>
    </div>
    <ModalMotion isOpen={Boolean(selected)} onClose={closeDetails} ariaLabelledBy="audit-detail-title" dialogRef={dialogRef}
      backdropClassName="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      dialogClassName="w-full max-w-xl max-h-[90dvh] overflow-y-auto rounded-2xl bg-white shadow-xl text-[#2B2A25]">
      {selected && <div onKeyDown={trapFocus}>
        <header className="flex items-start justify-between gap-4 p-6 border-b border-[#E5E9DF]"><div><p className="text-xs font-semibold uppercase tracking-widest text-[#587350] mb-2">Administration history</p><h2 id="audit-detail-title" className="text-xl font-bold">Activity details</h2></div><button className={buttonClass} onClick={closeDetails} aria-label="Close activity details">Close</button></header>
        <div className="p-6 space-y-5">
          {detailLoading && <p role="status" className="text-sm text-[#606658]">Loading latest details…</p>}
          {detailError && <div role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900"><p>{detailError}</p><button className={`${buttonClass} mt-3`} onClick={() => showDetails(selected)}>Try again</button></div>}
          <div className="rounded-xl border border-[#DCE3D5] bg-[#F5F7F1] p-4"><h3 className="font-bold text-[#2F5233]">{describe(selected)[0]}</h3><p className="mt-2 text-sm leading-6">{describe(selected)[2]}</p><p className="mt-2 text-xs text-[#606658]">This describes the recorded action, not the item's current status.</p></div>
          <dl className="space-y-4 text-sm">
            {[
              ['Date and time', formatAuditTime(selected.createdAt)], ['Administrator', adminName(selected)],
              ['Affected item', subjectName(selected)],
              ...(selected.ownerName || selected.ownerUsername ? [['Content owner / account', ownerName(selected)]] : []),
              ...(selected.postTitle && selected.subjectType === 'comment' ? [['Comment on post', selected.postTitle]] : []),
            ].map(([label, value]) => <div key={label}><dt className="font-medium text-[#606658]">{label}</dt><dd className="mt-1 font-semibold whitespace-pre-wrap break-words">{value}</dd></div>)}
          </dl>
          <div className="rounded-xl border border-[#E5E9DF] p-4 text-sm leading-6 text-[#606658]"><p>Detailed reasons and before-and-after values were not stored in this activity record.</p><p className="mt-2">Names and titles come from currently available records and may have changed since this activity.</p></div>
        </div>
      </div>}
    </ModalMotion>
  </AdminLayout>;
}
