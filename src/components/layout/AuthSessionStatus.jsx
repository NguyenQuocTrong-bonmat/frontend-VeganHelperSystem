import { useAuth } from '../../context/AuthContext';

export default function AuthSessionStatus() {
  const { isLoading, restoreSession } = useAuth();
  return <div className="min-h-screen flex flex-col gap-4 items-center justify-center text-[#2F5233] font-medium">
    {isLoading ? <p role="status">Loading...</p> : <>
      <p role="alert">Unable to reconnect. Your saved session has been kept.</p>
      <button type="button" onClick={restoreSession} className="rounded-lg border border-[#2F5233] px-4 py-2 focus-visible:ring-2 focus-visible:ring-[#2F5233]">Retry</button>
    </>}
  </div>;
}
