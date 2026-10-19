# Meal Plan Payment Pages

This page-specific direction extends `MASTER.md`; it does not change the VeganHelper botanical palette, DM Serif Display / DM Sans typography, or established spacing and focus styles.

## Layout

- Keep membership status and the 3-generation trial summary first on Weekly Menu.
- Present packages as responsive radio cards, with duration and total amount visible before checkout.
- Use one primary action: “Continue to payment”. Explain that PayOS hosts checkout and VeganHelper confirms the result server-side.
- Use one shared payment-result layout for success, pending, failed, and canceled outcomes. Keep the order summary and recovery actions below the status message.

## Interaction and states

- Show loading feedback while packages/access are loading and while a checkout request starts.
- Preserve the selected package and show API errors inline with retry guidance.
- Never infer payment success from browser query parameters; display success only after the authenticated order endpoint returns `paid`.
- Treat a cancel return with a still-pending order as unconfirmed, not as a server-side cancellation.
- On small screens, stack package cards and actions; keep controls at least 44px high and avoid horizontal scrolling.
- Use semantic labels, radio inputs, visible focus, `aria-live` for async status, and icon plus text for payment outcomes.
