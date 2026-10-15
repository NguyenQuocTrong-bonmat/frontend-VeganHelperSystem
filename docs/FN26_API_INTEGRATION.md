# FN26 — Weekly Menu API integration

Route: `/weekly-menu`, authenticated members only. The existing Wellness Dashboard, Health & Wellness tab, colors and typography are preserved.

## Flow

1. Save health measurements, birth date, sex for the energy calculation, activity level and diet in **Health & Wellness → Save Health Profile**. Save the allergy list separately with **Save Allergies**. The generator supports ages 20–120; BE validates eligibility.
2. Open **Weekly Menu**, choose a start date (today through next year, using UTC) and select **Create weekly menu**.
3. FE sends `POST /api/MealPlans/generate` with only `{ "startDate": "YYYY-MM-DD" }`. The BE reads the saved profile and allergies, estimates maintenance calories, generates and saves a full plan atomically. There is no second save request and no Gemini call for FN26.
4. The persisted response supplies seven actual calendar dates, three meals per day, calories, portion multipliers, scaled ingredients, and the profile/allergy snapshot. Changing the saved profile does not rewrite an existing plan.
5. `GET /api/MealPlans?pageIndex=1&pageSize=10` loads the member's saved plans. Previous/Next paginate the list; selecting another plan calls `GET /api/MealPlans/{id}`. Reloading the page initially shows the newest plan. **Reload saved plans** refreshes the list while preserving the menu currently selected.

All requests use the shared Axios instance and token storage, for both Remember Me choices. Do not send a user ID, calorie override, allergy override or diet override in the generation payload.

## Failure behavior

- **400:** Show the profile/date validation reason. Review the saved health profile and allergies before retrying.
- **409:** Show the reason that the catalog cannot satisfy the constraints or an allergy is unresolved. Never silently remove allergies to generate a plan.
- **404 on selected saved plan:** Keep this screen and its previous menu, showing the error.
- **Timeout/network error during creation:** Creation may already have been saved. Reload saved plans before submitting another creation; the API has no idempotency key.
- **Legacy plan with `menu: null`:** Explain the missing saved snapshot without making up meals.
- Disable duplicate submissions during a request. Switching to the health tab preserves an in-flight generation and its result.

## Verification

`npm test` covers the real Axios payload and auth header, both token storage choices, response rendering, calendar days, pagination/detail loading, validation formats, error recovery, duplicate submission, tab switching and legacy plans. `npm run build` checks the production bundle.

Browser verification used Edge and the actual BE against an isolated localhost PostgreSQL database, with synthetic dishes and a test-only account. Creation/reload/detail, profile/allergy persistence and a constraint conflict were exercised; widths 320, 390, 768, 1024 and 1440 had no horizontal page overflow. The unrelated header notification requests were stubbed for that scoped browser run; their existing `/api/api/notifications` prefix issue was not changed. No shared Supabase records were written.

Calorie estimates and the existing sample catalog are not a dietitian-reviewed prescription. The page displays the BE's limitations and allergen-checking notes. Dish swapping, deletion, reminders and recipe cooking instructions are not part of the current FN26 API.
