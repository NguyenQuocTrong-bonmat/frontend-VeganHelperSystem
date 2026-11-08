import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
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
    return `Your meal-plan access is active${expiry ? ` until ${expiry}` : ''}. Choosing a package extends access after your current expiration date.`;
  }
  if (access.status === 'grace_period') {
    const graceEnd = dateLabel(access.graceEndsAt);
    return `Your previous plan has ended. You can view saved plans${graceEnd ? ` until ${graceEnd}` : ''}; renewing restores full weekly meal planning access.`;
  }
  if (access.status === 'scheduled') {
    return 'Your purchased access is scheduled to begin after your current access period ends.';
  }
  if (access.status === 'expired') {
    return 'Your paid access has expired. Choose a package below to renew full access to meal generation and personalized nutrition.';
  }
  return 'Start with 3 free weekly-menu generations, then choose a package whenever you need more.';
}

function isMealPlanAccess(value) {
  return value && typeof value.canGenerate === 'boolean'
    && typeof value.canViewExistingPlans === 'boolean'
    && typeof value.canViewTrialPlans === 'boolean';
}

export default function MealPlanPayment() {
  const [packages, setPackages] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState('');
  const [packagesError, setPackagesError] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const loadData = useCallback(async signal => {
    setLoading(true);
    setAccessError('');
    setPackagesError('');

    const [accessResult, packagesResult] = await Promise.allSettled([
      getMealPlanAccess(signal),
      getMealPlanPackages(),
    ]);

    if (signal?.aborted) return;

    if (accessResult.status === 'fulfilled' && isMealPlanAccess(accessResult.value)) {
      setAccess(accessResult.value);
    } else {
      setAccess(null);
      setAccessError(accessResult.status === 'rejected'
        ? accessResult.reason.message
        : 'The server returned an unexpected membership response.');
    }

    if (packagesResult.status === 'fulfilled' && Array.isArray(packagesResult.value)) {
      setPackages(packagesResult.value);
      setSelectedCode(current => {
        if (current && packagesResult.value.some(item => item.code === current)) return current;
        return packagesResult.value[0]?.code || '';
      });
    } else {
      setPackages([]);
      setPackagesError(packagesResult.status === 'rejected'
        ? packagesResult.reason.message
        : 'The server returned an unexpected package list.');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);
    return () => controller.abort();
  }, [loadData, reloadKey]);

  async function beginCheckout() {
    if (!selectedCode || checkoutBusy) return;
    setCheckoutBusy(true);
    setCheckoutError('');
    try {
      const checkout = await createMealPlanCheckout(selectedCode);
      if (!checkout?.checkoutUrl) {
        throw new Error('PayOS did not return a checkout link. Please try again.');
      }
      const destination = new URL(checkout.checkoutUrl);
      if (destination.protocol !== 'https:') {
        throw new Error('The payment link is not secure. Please contact support.');
      }

      saveMealPlanCheckoutContext(checkout);
      window.location.assign(destination.href);
    } catch (failure) {
      setCheckoutError(failure.message || 'Could not start checkout. Please try again.');
      setCheckoutBusy(false);
    }
  }

  const selectedPackage = packages.find(pkg => pkg.code === selectedCode);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F0]">
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-lg bg-white px-4 py-2 text-[#244C38] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#244C38]"
      >
        Skip to main content
      </a>

      <HeaderMember />

      <main id="main-content" tabIndex="-1" className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 lg:py-12">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mb-6">
          <Link
            to="/weekly-menu"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#244C38] transition-colors hover:text-[#1D3D2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244C38] rounded-md px-1 py-0.5"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
            </svg>
            Back to Weekly Menu
          </Link>
        </div>

        {/* Page Header */}
        <section aria-labelledby="payment-page-title" className="mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DDF2E1] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#244C38]">
            Membership & Access
          </span>
          <h1 id="payment-page-title" className="mt-3 font-dm-serif text-3xl font-normal text-[#26342B] sm:text-4xl">
            Choose Your Meal Plan Package
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#59665A]">
            Enjoy personalized plant-based meal plans, automatic nutrient balancing, and portion adjustments tailored to your health goals.
          </p>
        </section>

        {/* Current Access Card */}
        <section aria-labelledby="current-access-heading" className="mb-8 rounded-2xl border border-[#DCE3D5] bg-white p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2.5">
                <h2 id="current-access-heading" className="font-fraunces text-xl font-semibold text-[#26342B]">
                  Your current membership
                </h2>
                {access && (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      access.status === 'active'
                        ? 'bg-[#DDF2E1] text-[#244C38]'
                        : access.status === 'grace_period'
                          ? 'bg-[#FDF3D8] text-[#8C6D1F]'
                          : access.status === 'expired'
                            ? 'bg-[#FEECEE] text-[#A63446]'
                            : 'bg-[#F0F4EC] text-[#59665A]'
                    }`}
                  >
                    {access.status === 'active'
                      ? 'Active'
                      : access.status === 'grace_period'
                        ? 'Grace Period'
                        : access.status === 'expired'
                          ? 'Expired'
                          : access.status}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-6 text-[#59665A]" aria-live="polite">
                {loading ? 'Checking your access details…' : describeAccess(access)}
              </p>
              {access && access.status !== 'active' && (
                <p className="mt-2 text-sm font-semibold text-[#244C38]">
                  {access.canGenerate
                    ? `${access.trialGenerationsRemaining} free generation${access.trialGenerationsRemaining === 1 ? '' : 's'} remaining`
                    : 'Your free trial generations have been used'}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setReloadKey(val => val + 1)}
              disabled={loading || checkoutBusy}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-[#244C38] px-4 py-2 text-sm font-semibold text-[#244C38] transition-colors hover:bg-[#DDF2E1]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244C38] disabled:cursor-wait disabled:opacity-50"
            >
              Refresh access
            </button>
          </div>

          {accessError && (
            <p role="alert" className="mt-4 rounded-xl border border-[#A63446]/30 bg-[#FFF5F5] p-3 text-sm text-[#8B2F3D]">
              {accessError} Refresh access to try again.
            </p>
          )}
        </section>

        {/* Package Selection Section */}
        <section aria-labelledby="packages-heading" className="rounded-2xl border border-[#DCE3D5] bg-white p-5 sm:p-7 shadow-sm">
          <div className="mb-6">
            <h2 id="packages-heading" className="font-fraunces text-xl font-semibold text-[#26342B]">
              Available packages
            </h2>
            <p className="mt-1 text-sm text-[#59665A]">
              Choose the duration that fits your routine. Payment is processed securely through PayOS.
            </p>
          </div>

          {loading ? (
            <div role="status" className="flex items-center gap-3 rounded-xl border border-[#DCE3D5] bg-[#FAF8F0] p-6 text-sm text-[#59665A]">
              <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-[#A8BDA2] border-t-[#244C38]" />
              <span>Loading available meal-plan packages…</span>
            </div>
          ) : packagesError ? (
            <div role="alert" className="rounded-xl border border-[#A63446]/30 bg-[#FFF5F5] p-5 text-sm text-[#8B2F3D]">
              <p className="font-medium">{packagesError}</p>
              <button
                type="button"
                onClick={() => setReloadKey(val => val + 1)}
                className="mt-3 font-semibold underline underline-offset-2 hover:text-[#5F1D27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#244C38]"
              >
                Try loading packages again
              </button>
            </div>
          ) : packages.length === 0 ? (
            <p className="rounded-xl bg-[#F3F6EE] p-5 text-sm text-[#59665A]">
              No meal-plan packages are currently available. Please check back later or contact support.
            </p>
          ) : (
            <fieldset disabled={loading || checkoutBusy} className="space-y-4">
              <legend className="sr-only">Select a meal plan package</legend>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {packages.map(item => {
                  const isSelected = selectedCode === item.code;
                  return (
                    <label
                      key={item.code}
                      className={`relative flex min-h-32 cursor-pointer flex-col justify-between rounded-2xl border p-5 transition-all focus-within:ring-2 focus-within:ring-[#244C38] ${
                        isSelected
                          ? 'border-[#244C38] bg-[#DDF2E1]/45 shadow-sm ring-1 ring-[#244C38]'
                          : 'border-[#DCE3D5] bg-[#FAF8F0]/40 hover:border-[#244C38]/60 hover:bg-[#FAF8F0]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="block font-fraunces text-lg font-semibold text-[#26342B]">
                            {item.name}
                          </span>
                          <span className="mt-1 inline-block text-xs font-medium text-[#59665A]">
                            {item.durationMonths} month{item.durationMonths === 1 ? '' : 's'} access
                          </span>
                        </div>
                        <input
                          type="radio"
                          name="selected-meal-plan-package"
                          value={item.code}
                          checked={isSelected}
                          onChange={() => {
                            setSelectedCode(item.code);
                            setCheckoutError('');
                          }}
                          className="mt-1 h-4 w-4 shrink-0 accent-[#244C38]"
                        />
                      </div>
                      <div className="mt-4 border-t border-[#DCE3D5]/60 pt-3">
                        <span className="block text-xl font-bold tabular-nums text-[#244C38]">
                          {money.format(item.amountVnd)}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {checkoutError && (
            <p role="alert" className="mt-5 rounded-xl border border-[#A63446]/30 bg-[#FFF5F5] p-4 text-sm font-medium text-[#8B2F3D]">
              {checkoutError}
            </p>
          )}

          {/* Checkout CTA Bar */}
          <div className="mt-8 border-t border-[#DCE3D5] pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-[#59665A]">
                Secure payment powered by <strong>PayOS</strong>. Your subscription activates immediately upon payment confirmation.
              </p>
              {selectedPackage && (
                <p className="mt-1 text-xs font-semibold text-[#244C38]">
                  Selected: {selectedPackage.name} ({money.format(selectedPackage.amountVnd)})
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={beginCheckout}
              disabled={!selectedCode || loading || checkoutBusy || packages.length === 0}
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-[#244C38] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D3D2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244C38] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {checkoutBusy ? (
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Opening secure checkout…
                </span>
              ) : (
                'Proceed to PayOS Checkout'
              )}
            </button>
          </div>
        </section>
      </main>

      <AIChatbot />
      <Footer />
    </div>
  );
}
