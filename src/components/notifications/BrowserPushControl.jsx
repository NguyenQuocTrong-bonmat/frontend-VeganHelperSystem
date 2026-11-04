import { useEffect, useRef, useState } from 'react';
import { browserPushStatus, enableBrowserPush } from '../../services/browserPushService';

export default function BrowserPushControl({ userId }) {
  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const running = useRef(false);
  useEffect(() => {
    let active = true;
    browserPushStatus(userId).then(value => { if (active) setState(value); })
      .catch(() => { if (active) setError('Could not load browser push settings. Reopen notifications to retry.'); });
    return () => { active = false; };
  }, [userId]);
  async function enable() {
    if (state?.active) return;
    if (running.current) return;
    running.current = true; setBusy(true); setError('');
    try {
      await enableBrowserPush(userId, state.publicKey);
      setState(await browserPushStatus(userId));
    } catch (failure) {
      setError(failure.message);
      try { setState(await browserPushStatus(userId)); } catch { /* Keep the last known settings. */ }
    }
    finally { running.current = false; setBusy(false); }
  }
  if (state?.active && !error) return null;
  return <div className="p-4 border-t border-[#DCE3D5] text-xs text-[#6B6F63] space-y-2">
    {!state?.active && <p>{!state ? 'Loading browser push settings…' : !state.supported ? 'Browser push requires HTTPS and a supported browser.'
      : !state.enabled ? 'Browser push is not configured. In-app notifications still work.'
      : state.permission === 'denied' ? 'Notifications are blocked. Allow them in browser site settings, then reopen this menu.'
      : 'Receive notifications on this browser, even when the website is not open.'}</p>}
    {state?.supported && state.enabled && !state.active && <button type="button" onClick={enable} disabled={busy || state.permission === 'denied'} className="rounded-lg border border-[#DCE3D5] px-3 py-2 text-[#2F5233] font-semibold focus-visible:ring-2 focus-visible:ring-[#2F5233] disabled:opacity-50">
      {busy ? 'Enabling…' : 'Always enable notifications'}
    </button>}
    {error && <p role="alert" className="text-[#A63446]">{error}</p>}
  </div>;
}
