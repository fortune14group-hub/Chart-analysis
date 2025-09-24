export type WebhookEvent = { id: string; type: string; created?: number; data?: any; raw?: any };

export async function routeEvent(evt: WebhookEvent) {
  switch (evt.type) {
    case "checkout.session.completed":
    case "invoice.paid":
      return { handled: true, note: "Stripe payment event (mock)" };
    case "member.created":
    case "subscription.updated":
      return { handled: true, note: "Memberstack event (mock)" };
    default:
      return { handled: false, note: `Unhandled type: ${evt.type}` };
  }
}
