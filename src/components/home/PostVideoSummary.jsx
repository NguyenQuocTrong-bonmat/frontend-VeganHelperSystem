import { useEffect, useId, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import ChatMarkdown from '../chat/ChatMarkdown';
import { getPostSummary, requestPostSummary } from '../../services/postSummaryService';

const isPending = (status) => ['pending', 'processing'].includes(status);
const canGenerate = (status) => ['not_requested', 'failed', 'stale'].includes(status);
const buttonClass = 'min-h-11 rounded-lg border border-[#DCE3D5] px-3 py-2 text-sm font-medium text-[#2F5233] hover:bg-[#F3F6EE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5233] disabled:opacity-60';

export default function PostVideoSummary(props) {
  return <VideoSummaryPanel key={props.postId} {...props} />;
}

function VideoSummaryPanel({ postId, isGuest, onAuthRequired }) {
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const requestRef = useRef(null);
  const panelId = useId();
  const transcriptId = useId();

  useEffect(() => () => requestRef.current?.abort(), []);

  useEffect(() => {
    if (!expanded || busy || !isPending(result?.status)) return undefined;
    const controller = new AbortController();
    let timer;
    async function refresh() {
      try {
        const data = await getPostSummary(postId, { signal: controller.signal });
        if (controller.signal.aborted) return;
        setResult(data);
        setError('');
        if (isPending(data.status)) timer = window.setTimeout(refresh, 4000);
      } catch {
        if (!controller.signal.aborted) setError('The summary status could not be refreshed. Please try again.');
      }
    }
    timer = window.setTimeout(refresh, 4000);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [expanded, busy, postId, result?.status]);

  async function loadSummary(generate = false) {
    if (requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    setExpanded(true);
    setBusy(true);
    setError('');
    try {
      const saved = await getPostSummary(postId, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setResult(saved);
      if (saved.status === 'not_requested' || (generate && canGenerate(saved.status))) {
        if (isGuest) {
          onAuthRequired?.();
        } else {
          const requested = await requestPostSummary(postId, { signal: controller.signal });
          if (!controller.signal.aborted) setResult(requested);
        }
      }
    } catch (cause) {
      if (!controller.signal.aborted) {
        setError(cause.response?.data?.message || cause.response?.data?.error || 'Could not load the video summary. Please try again.');
      }
    } finally {
      if (!controller.signal.aborted) setBusy(false);
      if (requestRef.current === controller) requestRef.current = null;
    }
  }

  function toggleSummary() {
    if (expanded) {
      setExpanded(false);
      setShowTranscript(false);
    } else if (result?.status === 'completed') {
      setExpanded(true);
    } else {
      loadSummary();
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
          <p className="mt-1 text-sm text-[#6B6F63]">Open a short recipe summary and the video transcript.</p>
        </div>
        <button type="button" onClick={toggleSummary} disabled={busy} aria-expanded={expanded} aria-controls={panelId}
          className="min-h-11 shrink-0 rounded-lg bg-[#2F5233] px-4 py-2 text-sm font-medium text-white hover:bg-[#25401F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5233] disabled:opacity-60">
          {busy ? 'Loading summary...' : expanded ? 'Hide summary' : 'View video summary'}
        </button>
      </div>
      <div id={panelId} hidden={!expanded} aria-busy={busy}>
        {busy && <p className="mt-4 text-sm text-[#6B6F63]" role="status">Checking or preparing your summary...</p>}
        {error && <div className="mt-4 space-y-2"><p className="text-sm text-red-700" role="alert">{error}</p><button type="button" onClick={() => loadSummary()} disabled={busy} className={buttonClass}>Check again</button></div>}
        {isPending(result?.status) && <p className="mt-4 text-sm text-[#2F5233]" role="status">{result.status === 'pending' ? 'Waiting to process the video...' : 'Transcribing and summarizing the video...'}</p>}
        {!busy && canGenerate(result?.status) && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-[#6B6F63]">{result.status === 'failed' ? result.error || 'The previous attempt could not be completed.' : result.status === 'stale' ? 'This video has changed. Create an updated summary.' : isGuest ? 'No summary is available yet. Sign in to create one.' : 'No summary is available yet. Create one to continue.'}</p>
            <button type="button" onClick={() => loadSummary(true)} className={buttonClass}>{isGuest ? 'Sign in to create summary' : result.status === 'failed' ? 'Try again' : result.status === 'stale' ? 'Update summary' : 'Create summary'}</button>
          </div>
        )}
        {result?.status === 'completed' && (
          <div className="mt-5 space-y-5">
            <div className="border-t border-[#DCE3D5] pt-4 text-sm leading-6 text-[#2B2A25]"><ChatMarkdown content={result.summary || ''} /></div>
            {result.transcript && <div className="border-t border-[#DCE3D5] pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => setShowTranscript((value) => !value)} aria-expanded={showTranscript} aria-controls={transcriptId} className={buttonClass}>{showTranscript ? 'Hide transcript' : 'View full transcript'}</button>
                <button type="button" onClick={copyTranscript} className={buttonClass}>Copy transcript</button>
              </div>
              <pre id={transcriptId} hidden={!showTranscript} className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-white p-4 text-sm leading-6 text-[#2B2A25]">{result.transcript}</pre>
            </div>}
          </div>
        )}
      </div>
    </section>
  );
}
