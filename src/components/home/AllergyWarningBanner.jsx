import React, { useEffect, useState } from 'react';
import { getPostAllergyWarnings } from '../../services/healthProfileService';
import { useAuth } from '../../context/AuthContext';

/**
 * AllergyWarningBanner - Displays warnings for recipe ingredients matching user's allergy profile (FN23).
 *
 * Requirements:
 * - Real API call to GET /api/posts/{postId}/allergy-warnings
 * - Only displays when allergens match user's profile
 * - Displays loading and unavailable/error states properly
 * - Never assumes failed request means recipe is safe
 * - Accessible alert markup
 */
export default function AllergyWarningBanner({ postId, isGuest: propIsGuest }) {
  const { isAuthenticated } = useAuth();
  const isGuest = propIsGuest || !isAuthenticated;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allergens, setAllergens] = useState([]);

  useEffect(() => {
    if (!postId || isGuest) {
      setAllergens([]);
      setError(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    getPostAllergyWarnings(postId)
      .then((data) => {
        if (!isMounted) return;
        const matched = Array.isArray(data?.allergens) ? data.allergens : [];
        setAllergens(matched);
      })
      .catch((err) => {
        if (!isMounted) return;
        // Do not interpret a failed request as confirmation that a recipe is safe
        setError(err.message || 'Unable to check allergy warnings for this recipe.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [postId, isGuest]);

  if (isGuest) {
    return null;
  }

  if (loading) {
    return (
      <div
        className="flex items-center gap-2 rounded-xl border border-[#DCE3D5] bg-[#FDFBF6] px-4 py-3 text-xs text-[#6B6F63]"
        aria-live="polite"
      >
        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#2F5233] border-t-transparent" />
        <span>Checking ingredients against your allergy profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50/90 p-4 text-amber-900 shadow-sm"
      >
        <svg
          className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-amber-900">Allergy Verification Unavailable</p>
          <p className="text-xs leading-relaxed text-amber-800">
            Could not verify this recipe with your allergy profile. Please inspect the ingredient list carefully before preparation.
          </p>
        </div>
      </div>
    );
  }

  if (allergens.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-50/95 p-4 text-rose-950 shadow-sm transition-all"
    >
      <svg
        className="mt-0.5 h-5 w-5 shrink-0 text-rose-600"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      <div className="space-y-1">
        <p className="text-sm font-bold text-rose-950 tracking-tight">Allergy Warning</p>
        <p className="text-xs leading-relaxed text-rose-900">
          This recipe contains ingredients matching your declared allergy profile:{' '}
          <span className="font-semibold underline decoration-rose-400">
            {allergens.map((item) => item.name).join(', ')}
          </span>
          . Please substitute or omit these items to ensure your safety.
        </p>
      </div>
    </div>
  );
}
