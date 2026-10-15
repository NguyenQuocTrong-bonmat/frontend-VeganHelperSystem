import { useEffect, useRef, useState } from 'react';
import { browserPushStatus, enableBrowserPush, disableBrowserPush } from '../../services/browserPushService';

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
  async function toggle() {
    if (running.current) return;
    running.current = true; setBusy(true); setError('');
    try {
      if (state.active) await disableBrowserPush();
      else await enableBrowserPush(userId, state.publicKey);
      setState(await browserPushStatus(userId));
    } catch (failure) {
      setError(failure.message);
      // An unsubscribe may succeed at the browser even when server cleanup fails.
      if (failure.localDisabled) setState(current => ({ ...current, active: false }));
      else try { setState(await browserPushStatus(userId)); } catch { /* Keep the last known settings. */ }
    }
    finally { running.current = false; setBusy(false); }
  }
  return <div className="p-4 border-t border-[#DCE3D5] text-xs text-[#6B6F63] space-y-2">
    <p>{!state ? 'Loading browser push settings…' : !state.supported ? 'Browser push requires HTTPS and a supported browser.'
      : state.active ? 'Browser notifications are enabled for this account on this browser.'
      : !state.enabled ? 'Browser push is not configured. In-app notifications still work.'
      : state.permission === 'denied' ? 'Notifications are blocked. Allow them in browser site settings, then reopen this menu.'
      : 'Receive notifications on this browser, even when the website is not open.'}</p>
    {state?.supported && (state.enabled || state.active) && <button type="button" onClick={toggle} disabled={busy || (!state.active && state.permission === 'denied')} className="rounded-lg border border-[#DCE3D5] px-3 py-2 text-[#2F5233] font-semibold focus-visible:ring-2 focus-visible:ring-[#2F5233] disabled:opacity-50">
      {busy ? 'Updating…' : state.active ? 'Disable browser notifications' : 'Enable browser notifications'}
    </button>}
    {error && <p role="alert" className="text-[#A63446]">{error}</p>}
  </div>;
}
