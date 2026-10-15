# Notifications — inbox and browser push

The member header uses the existing .NET/JWT notification APIs through the shared Axios client. The API base URL already ends in `/api`, so service paths start with `/notifications`, avoiding the previous `/api/api/notifications` requests.

## Inbox

- GET list: `GET /api/notifications?pageIndex=1&pageSize=20&unreadOnly=false`.
- Badge: `GET /api/notifications/unread-count`, refreshed on mount, window focus, every 60 seconds while visible, and a browser-push message.
- Read one: `PATCH /api/notifications/{id}/read`, then navigate to its internal post/profile/weekly-menu destination.
- Read all: `PATCH /api/notifications/read-all`. Both mutations use the response's `unreadCount`; a new notification may leave a nonzero badge after read-all.
- Load more appends pages and removes duplicate IDs. Failures preserve loaded items, with a retry action. Stale poll/list results cannot replace a successful read mutation. Changing accounts remounts the inbox and cancels old requests.
- Escape closes the dropdown and restores focus. Notification rows are keyboard-accessible buttons. The popup fits mobile viewports.

The same UI handles `comment`, `comment_reply`, `post_like`, `new_follower`, `followed_post`, `post_review`, and `meal_reminder` from BE, rendering the returned title/message. This does not add new event producers or a meal-reminder scheduler. In particular, FN26's `completed` plans do not automatically trigger the existing legacy reminder hook. Per-follow new-post preferences remain a separate follow UI integration.

## Browser push

1. Open the notification bell. FE checks `GET /api/notifications/push/config`; it does not automatically request permission.
2. Click **Enable browser notifications**. FE requests browser permission, registers `/notification-sw.js`, subscribes with the public VAPID key, then sends `PushSubscription.toJSON()` to `POST /api/notifications/push/subscriptions`.
3. Store only the browser registration ID, owner ID and endpoint locally; JWTs keep using the existing auth storage. Never put the VAPID private key in FE.
4. The worker handles BE payload `{ notificationId, title, body, url, tag }`, displays it with a stable tag and informs open pages to refresh. Notification clicks open/focus a permitted internal destination.
5. **Disable browser notifications** deletes `/api/notifications/push/subscriptions/{id}` and unsubscribes at the browser provider. Logout performs cleanup before clearing/revoking auth and closes displayed site notifications. If server cleanup fails, the browser unsubscribe is still attempted. Already-dispatched provider notifications cannot be recalled.

Account changes never reuse a known other-account endpoint. A pending permission prompt is canceled logically on logout; an already-started registration POST is awaited and its returned ID cleaned up before logout. Same-account JWT refresh is allowed during subscription. The worker does not cache pages or APIs and stores no JWT.

Push requires HTTPS (localhost is allowed for development), a browser with Push API/service-worker support, permission granted, BE `WebPush__Enabled=true` and a valid VAPID key pair. When BE push is disabled or the browser denies permission, inbox notifications remain available. Delivery still depends on the provider and the BE worker; an Azure F1 app sleeping can delay queued delivery.

## Verification and limits

Run `npm test` and `npm run build`. Tests cover route/auth/payload contracts, authoritative counts, deduplication, stale requests, account isolation, permission denial, subscription rollback, token refresh, logout races, and the actual worker source's push/click handlers and URL restrictions.

Edge verification used real FE + BE + an isolated localhost PostgreSQL database: 27 seeded notifications, pagination, read-one/read-all/badge, actual service-worker installation and real POST/DELETE subscription APIs. Popup layout was checked at 320, 390, 768 and 1440 px. The external browser push provider was emulated with a valid test subscription; live FCM/Mozilla/Apple delivery has **not** been verified. No shared Supabase data was written or migrated.
