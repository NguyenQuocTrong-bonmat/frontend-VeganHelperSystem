import React, { useCallback, useEffect, useState } from 'react';
import {
  createMealPlanCheckout,
  getMealPlanAccess,
  getMealPlanPackages,
} from '../../services/mealPlanPaymentService';
import { saveMealPlanCheckoutContext } from '../../utils/mealPlanPaymentContext';
import { formatDate } from '../../utils/dateUtils';

const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

function dateLabel(value) {
  if (!value) return null;
  return formatDate(value) || null;
}

function describeAccess(access) {
  if (!access) return 'Membership details are temporarily unavailable. You can still choose a package below.';
  if (access.status === 'active') {
    const expiry = dateLabel(access.expiresAt);
    return `Your meal-plan access is active${expiry ? ` until ${expiry}` : ''}. A new package extends access after your current expiry.`;
  }
  if (access.status === 'grace_period') {
    const graceEnd = dateLabel(access.graceEndsAt);
    return `Your plan has ended. You can view saved plans${graceEnd ? ` until ${graceEnd}` : ''}; renewing restores full access.`;
  }
  if (access.status === 'scheduled') return 'Your purchased access is scheduled to begin after your current access period.';
  if (access.status === 'expired') return 'Your paid access has ended. You may still view eligible trial plans or choose a package to continue.';
  return 'Start with 3 free weekly-menu generations, then choose a package whenever you need more.';
}

function isMealPlanAccess(value) {
  return value && typeof value.canGenerate === 'boolean'
    && typeof value.canViewExistingPlans === 'boolean'
    && typeof value.canViewTrialPlans === 'boolean';
}

export default function MealPlanBillingPanel({ access, onAccessChange }) {
  const [packages, setPackages] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState('');
  const [packagesError, setPackagesError] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async signal => {
    setLoading(true);
    setAccessError('');
    setPackagesError('');
    const [accessResult, packagesResult] = await Promise.allSettled([
      getMealPlanAccess(signal),
      getMealPlanPackages(),
    ]);

    if (signal?.aborted) return;

    if (accessResult.status === 'fulfilled' && isMealPlanAccess(accessResult.value)) {
      onAccessChange?.(accessResult.value);
    } else {
      onAccessChange?.(null);
      setAccessError(accessResult.status === 'rejected'
        ? accessResult.reason.message
        : 'The server returned an unexpected membership response.');
    }

    if (packagesResult.status === 'fulfilled' && Array.isArray(packagesResult.value)) {
      setPackages(packagesResult.value);
      setSelectedCode(current => packagesResult.value.some(item => item.code === current) ? current : '');
    } else {
      setPackages([]);
      setPackagesError(packagesResult.status === 'rejected'
        ? packagesResult.reason.message
        : 'The server returned an unexpected package list.');
    }

    setLoading(false);
  }, [onAccessChange]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load, reloadKey]);

  async function beginCheckout() {
    if (!selectedCode || checkoutBusy) return;
    setCheckoutBusy(true);
    setCheckoutError('');
    try {
      const checkout = await createMealPlanCheckout(selectedCode);
      if (!checkout?.checkoutUrl) throw new Error('PayOS did not return a checkout link. Please try again.');
      const destination = new URL(checkout.checkoutUrl);
      if (destination.protocol !== 'https:') throw new Error('The payment link is not secure. Please contact support.');

      saveMealPlanCheckoutContext(checkout);
      window.location.assign(destination.href);
    } catch (failure) {
      setCheckoutError(failure.message || 'Could not start checkout. Please try again.');
      setCheckoutBusy(false);
    }
  }

  return (
    <section id="meal-plan-packages" aria-labelledby="meal-plan-access-heading" className="scroll-mt-24 rounded-2xl border border-[#DCE3D5] bg-white p-5 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h2 id="meal-plan-access-heading" className="font-fraunces text-2xl font-semibold text-[#2B2A25]">Meal plan access</h2>
          <p className="mt-2 text-sm leading-6 text-[#59665A]" aria-live="polite">
            {loading ? 'Loading your access and available packages…' : describeAccess(access)}
          </p>
          {access && access.status !== 'active' && <p className="mt-2 text-sm font-medium text-[#244C38]">
            {access.canGenerate
              ? `${access.trialGenerationsRemaining} free generation${access.trialGenerationsRemaining === 1 ? '' : 's'} remaining`
              : 'Your free generations have been used'}
          </p>}
        </div>
        <button type="button" onClick={() => setReloadKey(value => value + 1)} disabled={loading || checkoutBusy}
          className="min-h-11 shrink-0 rounded-xl border border-[#244C38] px-4 py-2 text-sm font-semibold text-[#244C38] transition-colors hover:bg-[#DDF2E1]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244C38] disabled:cursor-wait disabled:opacity-50">
          Refresh access
        </button>
      </div>

      {accessError && <p role="alert" className="rounded-xl border border-[#A63446]/30 bg-[#FFF5F5] p-3 text-sm text-[#8B2F3D]">
        {accessError} Refresh access to try again.
      </p>}

      <div className="border-t border-[#DCE3D5] pt-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#26342B]">Choose a package</h3>
          <p className="mt-1 text-sm text-[#59665A]">Payment is confirmed by VeganHelper after PayOS notifies the server.</p>
        </div>

        {loading ? <p role="status" className="rounded-xl border border-[#DCE3D5] bg-[#FAF8F0] p-4 text-sm text-[#59665A]">Loading available packages…</p>
          : packagesError ? <div role="alert" className="rounded-xl border border-[#A63446]/30 bg-[#FFF5F5] p-4 text-sm text-[#8B2F3D]">
          <p>{packagesError}</p>
          <button type="button" onClick={() => setReloadKey(value => value + 1)} className="mt-2 font-semibold underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#244C38]">Try again</button>
        </div> : packages.length === 0 ? <p className="rounded-xl bg-[#F3F6EE] p-4 text-sm text-[#59665A]">No meal-plan packages are available right now. Please check again later.</p> : (
          <fieldset disabled={loading || checkoutBusy}>
            <legend className="sr-only">Meal-plan package</legend>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {packages.map(item => (
                <label key={item.code} className={`flex min-h-28 cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors hover:border-[#244C38] focus-within:ring-2 focus-within:ring-[#244C38] ${selectedCode === item.code ? 'border-[#244C38] bg-[#DDF2E1]/45' : 'border-[#DCE3D5] bg-[#FAF8F0]/40'}`}>
                  <input type="radio" name="meal-plan-package" value={item.code} checked={selectedCode === item.code}
                    onChange={() => { setSelectedCode(item.code); setCheckoutError(''); }}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#244C38]" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-[#26342B]">{item.name}</span>
                    <span className="mt-1 block text-sm text-[#59665A]">{item.durationMonths} month{item.durationMonths === 1 ? '' : 's'}</span>
                    <span className="mt-3 block text-lg font-semibold tabular-nums text-[#244C38]">{money.format(item.amountVnd)}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {checkoutError && <p role="alert" className="mt-4 rounded-xl border border-[#A63446]/30 bg-[#FFF5F5] p-3 text-sm text-[#8B2F3D]">{checkoutError}</p>}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="button" onClick={beginCheckout} disabled={!selectedCode || loading || checkoutBusy || packages.length === 0}
            className="min-h-12 rounded-xl bg-[#244C38] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D3D2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244C38] disabled:cursor-not-allowed disabled:opacity-50">
            {checkoutBusy ? 'Opening secure checkout…' : 'Continue to payment'}
          </button>
          <p className="text-xs leading-5 text-[#59665A]">You’ll complete payment on PayOS. We’ll verify the result before enabling access.</p>
        </div>
      </div>
    </section>
  );
}
