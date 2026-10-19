import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getImageUrl } from '../../utils/imageUtils';
import { getPaginationPages } from '../../utils/paginationUtils';
import {
  decideAiFlag,
  decideCommentReport,
  decidePostReport,
  getAdminAiFlags,
  getAdminCommentReportDetail,
  getAdminCommentReports,
  getAdminModerationPostDetail,
  getAdminPostReportDetail,
  getAdminPostReports,
} from '../../services/adminService';

const PAGE_SIZE = 10;

const QUEUES = [
  { id: 'ai', label: 'AI flagged posts' },
  { id: 'posts', label: 'Reported posts' },
  { id: 'comments', label: 'Reported comments' },
];

const ACTIONS = {
  ai: [
    { id: 'keep', label: 'Keep post', tone: 'positive' },
    { id: 'remove', label: 'Hide post', tone: 'danger' },
  ],
  posts: [
    { id: 'dismiss', label: 'Dismiss report', tone: 'neutral' },
    { id: 'keep', label: 'Keep post', tone: 'positive' },
    { id: 'remove', label: 'Hide post', tone: 'danger' },
  ],
  comments: [
    { id: 'keep', label: 'Keep comment', tone: 'positive' },
    { id: 'remove', label: 'Remove comment', tone: 'danger' },
  ],
};

const formatDate = (value) => value
  ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  : 'Unknown time';

const queueTitle = (queue, item) => {
  if (queue === 'ai') return item.title || `Post #${item.postId}`;
  if (queue === 'posts') return `Reported post #${item.postId}`;
  return item.postTitle || `Comment #${item.commentId}`;
};

const queueDescription = (queue, item) => {
  if (queue === 'comments') return item.commentContent || 'Comment content unavailable.';
  return item.reason || 'No report reason provided.';
};

function EmptyState({ message }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-[#C9D4C3] bg-[#F9FAF7] px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF0E9] text-[#2F5233]">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <p className="font-semibold text-[#26362A]">Queue is clear</p>
      <p className="mt-1 max-w-sm text-sm text-[#6B746B]">{message}</p>
    </div>
  );
}

export default function AdminContentManagement() {
  const [activeQueue, setActiveQueue] = useState('ai');
  const [items, setItems] = useState([]);
  const [queueCounts, setQueueCounts] = useState({ ai: 0, posts: 0, comments: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [detailError, setDetailError] = useState('');
  const [decision, setDecision] = useState({ action: '', reason: '' });
  const [toast, setToast] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([
      getAdminAiFlags({ pageIndex: 1, pageSize: 1 }),
      getAdminPostReports({ pageIndex: 1, pageSize: 1, status: 'pending' }),
      getAdminCommentReports({ pageIndex: 1, pageSize: 1, status: 'pending' }),
    ]).then(([ai, posts, comments]) => {
      if (active) setQueueCounts({ ai: ai.totalCount || 0, posts: posts.totalCount || 0, comments: comments.totalCount || 0 });
    }).catch(() => {
      if (active) setQueueCounts({ ai: 0, posts: 0, comments: 0 });
    });
    return () => { active = false; };
  }, [reloadKey]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      setError('');
      setSelected(null);
      setDetail(null);
      setDecision({ action: '', reason: '' });
      try {
        let response;
        if (activeQueue === 'ai') response = await getAdminAiFlags({ pageIndex: page, pageSize: PAGE_SIZE });
        if (activeQueue === 'posts') response = await getAdminPostReports({ pageIndex: page, pageSize: PAGE_SIZE, status: 'pending' });
        if (activeQueue === 'comments') response = await getAdminCommentReports({ pageIndex: page, pageSize: PAGE_SIZE, status: 'pending' });
        if (!active) return;
        const nextItems = Array.isArray(response?.items) ? response.items : [];
        setItems(nextItems);
        setTotalPages(Math.max(1, response?.totalPages || 1));
        if (nextItems.length > 0) setSelected(nextItems[0]);
      } catch (loadError) {
        if (active) {
          setItems([]);
          setTotalPages(1);
          setError(loadError.message || 'The moderation queue could not be loaded.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [activeQueue, page, reloadKey]);

  useEffect(() => {
    let active = true;
    if (!selected) {
      setDetail(null);
      return () => { active = false; };
    }
    const loadDetail = async () => {
      setIsDetailLoading(true);
      setDetailError('');
      setDecision({ action: '', reason: '' });
      try {
        let response;
        if (activeQueue === 'ai') response = await getAdminModerationPostDetail(selected.postId);
        if (activeQueue === 'posts') response = await getAdminPostReportDetail(selected.id);
        if (activeQueue === 'comments') response = await getAdminCommentReportDetail(selected.id);
        if (active) setDetail(response);
      } catch (loadError) {
        if (active) {
          setDetail(null);
          setDetailError(loadError.message || 'Details could not be loaded.');
        }
      } finally {
        if (active) setIsDetailLoading(false);
      }
    };
    loadDetail();
    return () => { active = false; };
  }, [activeQueue, selected]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => `${queueTitle(activeQueue, item)} ${queueDescription(activeQueue, item)}`.toLowerCase().includes(keyword));
  }, [activeQueue, items, search]);

  const activeDefinition = QUEUES.find((queue) => queue.id === activeQueue);
  const currentContent = activeQueue === 'posts' ? detail?.currentContent : detail;

  const submitDecision = async (event) => {
    event.preventDefault();
    if (!selected || !decision.action || !decision.reason.trim()) return;
    setIsSubmitting(true);
    try {
      if (activeQueue === 'ai') {
        await decideAiFlag(selected.id, {
          action: decision.action,
          reason: decision.reason.trim(),
          expectedRevision: currentContent?.contentRevision || selected.contentRevision,
        });
      } else if (activeQueue === 'posts') {
        await decidePostReport(selected.id, {
          action: decision.action,
          reason: decision.reason.trim(),
          expectedRevision: currentContent?.contentRevision,
        });
      } else {
        await decideCommentReport(selected.id, { action: decision.action, reason: decision.reason.trim() });
      }
      setToast({ type: 'success', message: 'The moderation decision was saved.' });
      setReloadKey((value) => value + 1);
    } catch (submitError) {
      setToast({ type: 'error', message: submitError.message || 'The moderation decision could not be saved.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        {toast && (
          <div role="status" className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border px-5 py-3 text-sm font-semibold shadow-xl ${toast.type === 'error' ? 'border-[#F4C2BC] bg-[#FDF2F2] text-[#A63446]' : 'border-[#25401F] bg-[#2F5233] text-white'}`}>
            {toast.message}
          </div>
        )}

        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2A25] tracking-tight">Content Management</h1>
            <p className="text-sm text-[#6B6F63] mt-1">Review content identified by AI or reported by members. Every decision is recorded in the Admin audit log.</p>
          </div>
        </header>

        <nav aria-label="Moderation queues" className="grid gap-3 md:grid-cols-3">
          {QUEUES.map((queue) => {
            const isActive = queue.id === activeQueue;
            return (
              <button type="button" key={queue.id} onClick={() => { setActiveQueue(queue.id); setPage(1); setSearch(''); }} className={`min-h-11 rounded-xl border px-4 py-2 text-left transition ${isActive ? 'border-[#2F5233] bg-[#2F5233] text-white shadow-sm' : 'border-[#DCE3D5] bg-white text-[#27342A] hover:border-[#91A58B]'}`} aria-current={isActive ? 'page' : undefined}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold">{queue.label}</span>
                  <span className={`min-w-8 rounded-full px-2.5 py-1 text-center text-xs font-extrabold ${isActive ? 'bg-white/15 text-white' : 'bg-[#EAF0E9] text-[#2F5233]'}`}>{queueCounts[queue.id]}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {error && (
          <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-[#F4C2BC] bg-[#FDF2F2] p-4 text-sm text-[#8B2B3A] sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="self-start rounded-full border border-[#A63446] px-4 py-2 text-xs font-bold hover:bg-white sm:self-auto">Try again</button>
          </div>
        )}

        <div className="grid items-start gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)]">
          <section className="min-w-0 overflow-hidden rounded-3xl border border-[#DCE3D5] bg-white shadow-sm" aria-labelledby="queue-heading">
            <div className="border-b border-[#E4E9DF] p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 id="queue-heading" className="text-lg font-extrabold text-[#26362A]">{activeDefinition.label}</h2>
                  <p className="mt-1 text-xs text-[#747D74]">Select an item to inspect its evidence.</p>
                </div>
                <span className="text-xs font-bold text-[#5F795E]">{queueCounts[activeQueue]} pending</span>
              </div>
              <label className="relative mt-4 block">
                <span className="sr-only">Search current queue</span>
                <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7B847A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" /></svg>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, content, or reason" className="w-full rounded-xl border border-[#DCE3D5] bg-[#F8FAF6] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#2F5233] focus:bg-white" />
              </label>
            </div>

            <div className="max-h-[680px] space-y-2 overflow-y-auto p-3">
              {isLoading ? (
                <div className="space-y-3 p-2" aria-label="Loading moderation queue">{[1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl bg-[#F0F3ED]" />)}</div>
              ) : filteredItems.length === 0 ? (
                <EmptyState message={search ? 'No pending item matches this search.' : 'There are no pending items in this queue.'} />
              ) : filteredItems.map((item) => {
                const isSelected = selected?.id === item.id;
                return (
                  <button type="button" key={item.id} onClick={() => setSelected(item)} className={`w-full rounded-2xl border p-4 text-left transition ${isSelected ? 'border-[#2F5233] bg-[#F1F5ED] shadow-sm' : 'border-transparent hover:border-[#D5DED0] hover:bg-[#FAFBF8]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#27342A]">{queueTitle(activeQueue, item)}</p>
                        {activeQueue !== 'ai' && <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#6D756D]">{queueDescription(activeQueue, item)}</p>}
                      </div>
                      {activeQueue !== 'ai' && <span className="shrink-0 rounded-full bg-[#FBEAE7] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#A63446]">Review</span>}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#7B847A]">
                      <time dateTime={item.createdAt || undefined}>{formatDate(item.createdAt)}</time>
                      {activeQueue === 'comments' && <span>{item.reportCount} report{item.reportCount === 1 ? '' : 's'}</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-[#E4E9DF] px-5 py-4 text-xs text-[#697369]">
              <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-full border border-[#D4DDD0] px-3 py-1.5 font-bold disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
              <div className="flex items-center gap-1.5">
                {getPaginationPages(page, totalPages, 5).map((pageNum) => (
                  <button
                    type="button"
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                      page === pageNum
                        ? 'bg-[#2F5233] text-white shadow-xs'
                        : 'border border-[#DCE3D5] bg-white text-[#6B6F63] hover:border-[#2F5233] hover:text-[#2B2A25]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-full border border-[#D4DDD0] px-3 py-1.5 font-bold disabled:cursor-not-allowed disabled:opacity-40">Next</button>
            </div>
          </section>

          <section className="min-w-0 break-words overflow-hidden rounded-3xl border border-[#DCE3D5] bg-white shadow-sm" aria-labelledby="review-heading">
            {!selected ? (
              <EmptyState message="Choose an item from the queue to review its content and evidence." />
            ) : isDetailLoading ? (
              <div className="space-y-4 p-6" aria-label="Loading moderation details">
                <div className="h-8 w-2/3 animate-pulse rounded-lg bg-[#EDF1EA]" />
                <div className="h-40 animate-pulse rounded-2xl bg-[#F2F4F0]" />
                <div className="h-28 animate-pulse rounded-2xl bg-[#F2F4F0]" />
              </div>
            ) : detailError ? (
              <div role="alert" className="m-6 rounded-2xl border border-[#F4C2BC] bg-[#FDF2F2] p-5 text-sm text-[#8B2B3A]">{detailError}</div>
            ) : (
              <div className="divide-y divide-[#E7EBE3]">
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6A8167]">Review evidence</p>
                  <h2 id="review-heading" className="mt-2 text-xl font-extrabold leading-tight text-[#243128] sm:text-2xl">{activeQueue === 'comments' ? detail?.postTitle : currentContent?.title || queueTitle(activeQueue, selected)}</h2>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-[#EAF0E9] px-3 py-1 font-semibold text-[#2F5233]">{activeQueue === 'comments' ? `Comment #${detail?.commentId}` : `Post #${selected.postId}`}</span>
                    <span className="rounded-full bg-[#F5F1E8] px-3 py-1 font-semibold text-[#756343]">{formatDate(selected.createdAt)}</span>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  {activeQueue === 'comments' ? (
                    <>
                      <div className="rounded-2xl border border-[#DDE5D9] bg-[#F8FAF6] p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#718070]">Reported comment</p>
                        <blockquote className="mt-2 text-sm leading-6 text-[#303B31]">“{detail?.commentContent}”</blockquote>
                        <p className="mt-3 text-xs text-[#737C73]">By {detail?.authorName} · Reported by {detail?.reporterName}</p>
                      </div>
                      <div className="rounded-2xl border border-[#F0D4CF] bg-[#FFF8F6] p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#A14C49]">Community reason</p>
                        <p className="mt-2 text-sm leading-6 text-[#4A3B39]">{detail?.reason}</p>
                        <p className="mt-2 text-xs font-semibold text-[#A14C49]">{detail?.reportCount} pending report{detail?.reportCount === 1 ? '' : 's'} for this comment</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-2xl border border-[#DDE5D9] bg-[#F8FAF6] p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#718070]">Current post content</p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#303B31]">{currentContent?.content || 'No text content.'}</p>
                      </div>
                      <div className="rounded-2xl border border-[#F0D4CF] bg-[#FFF8F6] p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#A14C49]">{activeQueue === 'ai' ? 'AI finding' : 'Community report'}</p>
                        <p className="mt-2 text-sm leading-6 text-[#4A3B39]">{selected.reason || detail?.report?.reason || 'No reason provided.'}</p>
                        {activeQueue === 'ai' && selected.aiModelName && <p className="mt-2 text-xs text-[#7F6965]">Model: {selected.aiModelName}</p>}
                      </div>
                      {Array.isArray(currentContent?.media) && currentContent.media.length > 0 && (
                        <div>
                          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#718070]">Attached media</p>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {currentContent.media.map((media) => media.mediaType === 'image' ? (
                              <img key={media.id} src={getImageUrl(media.mediaUrl)} alt="Post evidence" className="aspect-square w-full rounded-xl border border-[#DCE3D5] object-cover" />
                            ) : (
                              <a key={media.id} href={media.mediaUrl} target="_blank" rel="noreferrer" className="flex aspect-square items-center justify-center rounded-xl border border-[#DCE3D5] bg-[#F5F7F3] px-3 text-center text-xs font-bold text-[#2F5233]">Open video evidence</a>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <form onSubmit={submitDecision} className="space-y-4 bg-[#FBFCF9] p-5 sm:p-6">
                  <fieldset>
                    <legend className="text-sm font-extrabold text-[#27342A]">Admin decision</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {ACTIONS[activeQueue].map((action) => (
                        <label key={action.id} className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-bold transition ${decision.action === action.id ? action.tone === 'danger' ? 'border-[#A63446] bg-[#A63446] text-white' : action.tone === 'positive' ? 'border-[#2F5233] bg-[#2F5233] text-white' : 'border-[#5E685F] bg-[#5E685F] text-white' : 'border-[#CED8C9] bg-white text-[#4D584F] hover:border-[#7F947A]'}`}>
                          <input type="radio" name="moderation-action" value={action.id} checked={decision.action === action.id} onChange={(event) => setDecision((value) => ({ ...value, action: event.target.value }))} className="sr-only" />
                          {action.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className="block">
                    <span className="text-xs font-bold text-[#3D493F]">Decision reason</span>
                    <textarea required maxLength={1000} rows={4} value={decision.reason} onChange={(event) => setDecision((value) => ({ ...value, reason: event.target.value }))} placeholder="Explain the evidence and why this action is appropriate." className="mt-2 w-full resize-y rounded-xl border border-[#CED8C9] bg-white p-3 text-sm leading-6 outline-none transition focus:border-[#2F5233]" />
                  </label>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[11px] leading-5 text-[#788078]">This action is saved to the Admin audit log.</p>
                    <button type="submit" disabled={!decision.action || !decision.reason.trim() || isSubmitting} className="rounded-full bg-[#2F5233] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#25452A] disabled:cursor-not-allowed disabled:opacity-45">{isSubmitting ? 'Saving…' : 'Confirm decision'}</button>
                  </div>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
