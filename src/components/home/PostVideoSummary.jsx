import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ChatMarkdown from '../chat/ChatMarkdown';
import { getPostSummary, requestPostSummary } from '../../services/postSummaryService';

export default function PostVideoSummary({ postId, isGuest, onAuthRequired }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setResult(null);
    setError('');
    getPostSummary(postId)
      .then((data) => { if (active) setResult(data); })
      .catch(() => { if (active) setError('Could not load the video summary.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [postId]);

  useEffect(() => {
    if (!['pending', 'processing'].includes(result?.status)) return undefined;
    let active = true;
    const timer = window.setInterval(async () => {
      try {
        const data = await getPostSummary(postId);
        if (active) { setResult(data); setError(''); }
      } catch {
        if (active) setError('The summary status could not be refreshed.');
      }
    }, 4000);
    return () => { active = false; window.clearInterval(timer); };
  }, [postId, result?.status]);

  async function handleRequest() {
    if (isGuest) {
      onAuthRequired?.();
      return;
    }
    setRequesting(true);
    setError('');
    try {
      setResult(await requestPostSummary(postId));
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.response?.data?.error ||
        'Could not start video summarization.');
    } finally {
      setRequesting(false);
    }
  }

  async function copyTranscript() {
    try {
      await navigator.clipboard.writeText(result.transcript);
      toast.success('Transcript copied');
    } catch {
      toast.error('Could not copy the transcript');
    }
  }

  return (
    <section className="rounded-xl border border-[#DCE3D5] bg-[#FDFBF6] p-4 sm:p-6" aria-label="Video recipe summary">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-fraunces text-xl font-medium text-[#2B2A25]">Video recipe summary</h2>
          <p className="mt-1 text-sm text-[#6B6F63]">Turn the cooking video audio into a short recipe and transcript.</p>
        </div>
        {!loading && !['pending', 'processing', 'completed'].includes(result?.status) && (
          <button type="button" onClick={handleRequest} disabled={requesting}
            className="min-h-11 rounded-lg bg-[#2F5233] px-4 py-2 text-sm font-medium text-white hover:bg-[#25401F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5233] disabled:opacity-60">
            {requesting ? 'Starting…' : result?.status === 'failed' ? 'Try again' : 'Summarize video'}
          </button>
        )}
      </div>
      {loading && <p className="mt-4 text-sm text-[#6B6F63]" role="status">Loading summary…</p>}
      {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
      {['pending', 'processing'].includes(result?.status) && (
        <p className="mt-4 text-sm text-[#2F5233]" role="status">
          {result.status === 'pending' ? 'Waiting to process the video…' : 'Transcribing and summarizing the video…'}
        </p>
      )}
      {result?.status === 'failed' && <p className="mt-4 text-sm text-red-700" role="alert">{result.error}</p>}
      {result?.status === 'completed' && (
        <div className="mt-5 space-y-5">
          <div className="border-t border-[#DCE3D5] pt-4 text-sm leading-6 text-[#2B2A25]">
            <ChatMarkdown content={result.summary || ''} />
          </div>
          <div className="border-t border-[#DCE3D5] pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setShowTranscript((value) => !value)}
                aria-expanded={showTranscript}
                className="min-h-11 rounded-lg border border-[#DCE3D5] px-3 py-2 text-sm font-medium text-[#2F5233] hover:bg-[#F3F6EE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F5233]">
                {showTranscript ? 'Hide transcript' : 'View full transcript'}
              </button>
              <button type="button" onClick={copyTranscript}
                className="min-h-11 rounded-lg border border-[#DCE3D5] px-3 py-2 text-sm font-medium text-[#2F5233] hover:bg-[#F3F6EE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F5233]">
                Copy transcript
              </button>
            </div>
            {showTranscript && <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-white p-4 text-sm leading-6 text-[#2B2A25]">{result.transcript}</pre>}
          </div>
        </div>
      )}
    </section>
  );
}
