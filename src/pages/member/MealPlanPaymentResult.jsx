import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import { getMealPlanAccess, getMealPlanPaymentOrder } from '../../services/mealPlanPaymentService';
import { getMealPlanCheckoutContext } from '../../utils/mealPlanPaymentContext';
import { formatDate } from '../../utils/dateUtils';

const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

function dateLabel(value) {
  if (!value) return null;
  return formatDate(value) || null;
}

function ResultIcon({ kind }) {
  const color = kind === 'success' ? '#347A50' : kind === 'failed' ? '#A63446' : '#A66A19';
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-8 w-8" style={{ color }}>
    {kind === 'success'
      ? <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      : kind === 'failed'
        ? <path d="m7 7 10 10M17 7 7 17M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        : <><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /></>}
  </svg>;
}

function resultFor(variant, order) {
  if (order?.status?.toLowerCase() === 'paid') return 'success';
  if (order?.status?.toLowerCase() === 'failed') return 'failed';
  if (variant === 'cancel') return 'cancel';
  return 'pending';
}

function displayOrderStatus(status) {
  switch (status?.toLowerCase()) {
    case 'paid': return 'Paid';
    case 'failed': return 'Failed';
    case 'pending': return 'Awaiting confirmation';
    default: return status || 'Unknown';
  }
}

const copy = {
  success: {
    title: 'Payment confirmed',
    message: 'Your payment has been verified by VeganHelper. Meal-plan access is ready.',
    tone: 'border-[#347A50]/25 bg-[#EFF8F0]',
  },
  failed: {
    title: 'Payment not completed',
    message: 'The server confirmed that this payment did not complete. No new meal-plan access was added.',
    tone: 'border-[#A63446]/25 bg-[#FFF5F5]',
  },
  cancel: {
    title: 'Payment cancelled',
    message: 'You left the PayOS checkout before VeganHelper confirmed payment. You can choose a package and try again.',
    tone: 'border-[#D6B66A]/50 bg-[#FBF7E9]',
  },
  pending: {
    title: 'Payment is being confirmed',
    message: 'The checkout returned, but the server has not confirmed payment yet. Access stays unchanged until confirmation arrives.',
    tone: 'border-[#D6B66A]/50 bg-[#FBF7E9]',
  },
};

export default function MealPlanPaymentResult({ variant = 'success' }) {
  const location = useLocation();
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState({ loading: true, order: null, access: null, error: '', missing: false });

  useEffect(() => {
    let active = true;
    let timeout;
    const context = getMealPlanCheckoutContext(location.search);

    if (!context) {
      setState({ loading: false, order: null, access: null, error: '', missing: true });
      return () => { active = false; };
    }

    async function checkStatus() {
      setState({ loading: true, order: null, access: null, error: '', missing: false });
      try {
        const attempts = variant === 'success' ? 6 : 1;
        let order = null;
        for (let attempt = 0; attempt < attempts; attempt += 1) {
          order = await getMealPlanPaymentOrder(context.orderId);
          if (!active || order.status?.toLowerCase() !== 'pending' || attempt === attempts - 1) break;
          await new Promise(resolve => { timeout = setTimeout(resolve, 1500); });
        }
        if (!active) return;

        let access = null;
        if (order.status?.toLowerCase() === 'paid') {
          try { access = await getMealPlanAccess(); } catch { /* Payment status remains authoritative. */ }
        }
        if (active) setState({ loading: false, order, access, error: '', missing: false });
      } catch (failure) {
        if (active) setState({ loading: false, order: null, access: null, error: failure.message, missing: false });
      }
    }

    checkStatus();
    return () => { active = false; clearTimeout(timeout); };
  }, [location.search, reloadKey, variant]);

  const outcome = resultFor(variant, state.order);
  const content = copy[outcome];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F0]">
      <a href="#main-content" className="sr-only z-[60] rounded-lg bg-white px-4 py-2 text-[#244C38] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#244C38]">Skip to main content</a>
      <HeaderMember />
      <main id="main-content" tabIndex="-1" className="mx-auto flex w-full max-w-4xl flex-1 items-center px-4 py-10 sm:px-6 lg:py-16">
        <section aria-labelledby="payment-result-heading" className="w-full rounded-3xl border border-[#DCE3D5] bg-white p-6 shadow-[0_12px_40px_rgba(36,76,56,0.08)] sm:p-10">
          <p className="text-sm font-semibold text-[#244C38]">Weekly meal plans</p>
          <h1 id="payment-result-heading" className="mt-2 font-dm-serif text-3xl text-[#26342B] sm:text-4xl">Payment status</h1>

          {state.loading ? <div role="status" aria-live="polite" className="mt-8 flex items-center gap-3 rounded-2xl border border-[#DCE3D5] bg-[#FAF8F0] p-5 text-[#59665A]">
            <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-[#A8BDA2] border-t-[#244C38]" />
            <span>Checking your order with VeganHelper…</span>
          </div> : state.missing ? <div role="alert" className="mt-8 rounded-2xl border border-[#D6B66A]/50 bg-[#FBF7E9] p-5 text-sm leading-6 text-[#5F512C]">
            We couldn’t match this return to a recent checkout in this browser tab. Open Weekly Menu to check access or start a new payment.
          </div> : state.error ? <div role="alert" className="mt-8 rounded-2xl border border-[#A63446]/25 bg-[#FFF5F5] p-5 text-sm leading-6 text-[#8B2F3D]">
            <p>We couldn’t confirm this order: {state.error}</p>
            <p className="mt-1">Your access has not been changed by this screen. Check the order again or contact support if you already paid.</p>
          </div> : <div aria-live="polite" className={`mt-8 rounded-2xl border p-5 sm:p-6 ${content.tone}`}>
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
                <ResultIcon kind={outcome} />
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-[#26342B]">{content.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#48554A]">{content.message}</p>
              </div>
            </div>
          </div>}

          {state.order && !state.loading && <dl className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-[#DCE3D5] bg-[#FAF8F0]/60 p-5 sm:grid-cols-3">
            <div><dt className="text-xs font-medium text-[#667568]">Package</dt><dd className="mt-1 break-words text-sm font-semibold text-[#26342B]">{state.order.packageName}</dd></div>
            <div><dt className="text-xs font-medium text-[#667568]">Amount</dt><dd className="mt-1 text-sm font-semibold tabular-nums text-[#26342B]">{money.format(state.order.amountVnd)}</dd></div>
            <div><dt className="text-xs font-medium text-[#667568]">Order status</dt><dd className="mt-1 text-sm font-semibold text-[#26342B]">{displayOrderStatus(state.order.status)}</dd></div>
            {outcome === 'success' && dateLabel(state.access?.expiresAt) && <div className="sm:col-span-3"><dt className="text-xs font-medium text-[#667568]">Access through</dt><dd className="mt-1 text-sm font-semibold text-[#26342B]">{dateLabel(state.access.expiresAt)}</dd></div>}
          </dl>}

          {state.error && <button type="button" onClick={() => setReloadKey(value => value + 1)} className="mt-5 min-h-11 rounded-xl border border-[#244C38] px-4 py-2 text-sm font-semibold text-[#244C38] transition-colors hover:bg-[#DDF2E1]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244C38]">Check order again</button>}
          {outcome === 'pending' && !state.loading && !state.missing && !state.error && <button type="button" onClick={() => setReloadKey(value => value + 1)} className="mt-5 min-h-11 rounded-xl border border-[#244C38] px-4 py-2 text-sm font-semibold text-[#244C38] transition-colors hover:bg-[#DDF2E1]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244C38]">Check payment status again</button>}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/weekly-menu" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#244C38] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D3D2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244C38]">Return to Weekly Menu</Link>
            {outcome !== 'success' && <Link to="/weekly-menu#meal-plan-packages" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#244C38] px-5 py-3 text-sm font-semibold text-[#244C38] transition-colors hover:bg-[#DDF2E1]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244C38]">Choose a package</Link>}
          </div>
        </section>
      </main>
      <AIChatbot />
      <Footer />
    </div>
  );
}
