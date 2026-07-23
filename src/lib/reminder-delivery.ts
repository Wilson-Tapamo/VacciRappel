import webpush from "web-push";
import { prisma } from "@/lib/prisma";

type DeliveryWithContext = Awaited<ReturnType<typeof loadDelivery>>;

async function loadDelivery(id: string) {
  return prisma.reminderDelivery.findUnique({
    where: { id },
    include: {
      appointment: {
        include: {
          child: true,
          vaccine: true,
          facility: true,
        },
      },
      user: { include: { pushSubscriptions: true } },
    },
  });
}

function messageFor(delivery: NonNullable<DeliveryWithContext>) {
  const appointment = delivery.appointment;
  return {
    title: `Rappel vaccin — ${appointment.child.name}`,
    body: `${appointment.vaccine?.name || "Vaccination"} le ${appointment.scheduledFor.toLocaleDateString("fr-FR")}${appointment.facility ? ` à ${appointment.facility.name}` : ""}.`,
    url: "/alerts",
  };
}

async function sendWebhook(url: string, delivery: NonNullable<DeliveryWithContext>) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: delivery.user.phone,
      channel: delivery.channel,
      ...messageFor(delivery),
    }),
  });
  if (!response.ok) throw new Error(`Webhook ${response.status}`);
}

export async function deliverReminder(id: string) {
  const delivery = await loadDelivery(id);
  if (!delivery) throw new Error("Rappel introuvable");
  if (delivery.channel === "PUSH") {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    if (!publicKey || !privateKey) throw new Error("Clés VAPID non configurées");
    if (!delivery.user.pushSubscriptions.length) throw new Error("Aucun appareil abonné aux notifications Push");
    webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:admin@vacci-rappel.app", publicKey, privateKey);
    const payload = JSON.stringify(messageFor(delivery));
    await Promise.all(
      delivery.user.pushSubscriptions.map((subscription) =>
        webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: { p256dh: subscription.p256dh, auth: subscription.auth },
          },
          payload,
        ),
      ),
    );
    return;
  }
  const url = delivery.channel === "SMS"
    ? process.env.REMINDER_SMS_WEBHOOK_URL
    : process.env.REMINDER_WHATSAPP_WEBHOOK_URL;
  if (!url) throw new Error(`Webhook ${delivery.channel} non configuré`);
  await sendWebhook(url, delivery);
}
