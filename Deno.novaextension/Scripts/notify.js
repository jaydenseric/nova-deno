/**
 * Creates a Nova notification.
 * @param {string} identifier Notification identifier.
 * @param {string} title Notification title text.
 * @param {string} body Notification body text.
 * @param {Array<string>} Notification action button labels.
 * @returns {Promise<NotificationResponse>} Resolves the notification response from the user.
 */
// deno-lint-ignore require-await
async function notify(identifier, title, body, actions) {
  if (typeof identifier !== "string") {
    throw new TypeError("Argument 1 `identifier` must be a string.");
  }

  if (typeof title !== "string") {
    throw new TypeError("Argument 2 `title` must be a string.");
  }

  if (typeof body !== "string") {
    throw new TypeError("Argument 3 `body` must be a string.");
  }

  const notificationRequest = new NotificationRequest(identifier);

  notificationRequest.title = title;
  notificationRequest.body = body;

  if (actions) notificationRequest.actions = actions;

  return nova.notifications.add(notificationRequest);
}

module.exports = notify;
