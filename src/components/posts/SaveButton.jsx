export default function SaveButton({ postId, saved }) {
  const selected = saved.isSaved(postId);
  const pending = saved.pending.has(String(postId));
  return <button type="button" aria-pressed={saved.loading || saved.error ? undefined : selected}
    aria-label={saved.error ? 'Retry saved status' : selected ? 'Unsave recipe' : 'Save recipe'}
    disabled={saved.loading || pending}
    onClick={() => saved.error ? saved.retry() : saved.toggle(postId)}
    className={`px-4 py-2 rounded-lg border text-sm flex items-center gap-2 disabled:opacity-50 ${selected ? 'bg-[#F3F6EE] border-[#2F5233] text-[#2F5233]' : 'bg-[#FDFBF6] border-[#DCE3D5] text-[#2B2A25]'}`}>
    <svg aria-hidden="true" className={`w-5 h-5 ${selected ? 'fill-current' : 'fill-none'}`} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
    <span>{saved.loading ? 'Checking…' : pending ? 'Updating…' : saved.error ? 'Retry saved status' : selected ? 'Saved' : 'Save recipe'}</span>
  </button>;
}
