"use client";

import { useCallback, useEffect, useState } from "react";
import { BellRing, CalendarCheck, Check, MessageCircle, Phone, Save } from "lucide-react";

type Preferences = {
  pushEnabled: boolean;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  reminderDaysBefore: number[];
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
};

type Appointment = {
  id: string;
  scheduledFor: string;
  status: string;
  child: { name: string };
  vaccine: { name: string } | null;
  facility: { name: string; phone: string | null } | null;
};

type Candidate = {
  childId: string;
  childName: string;
  vaccineId: string;
  vaccineName: string;
  scheduledFor: string;
};

const defaultPreferences: Preferences = {
  pushEnabled: true,
  smsEnabled: false,
  whatsappEnabled: false,
  reminderDaysBefore: [7, 2, 0],
  quietHoursStart: "21:00",
  quietHoursEnd: "07:00",
};

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}

export default function ReminderSettings() {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [preferenceResponse, appointmentResponse, childrenResponse] = await Promise.all([
      fetch("/api/reminders/preferences"),
      fetch("/api/appointments"),
      fetch("/api/children"),
    ]);
    if (preferenceResponse.ok) setPreferences(await preferenceResponse.json());
    if (appointmentResponse.ok) setAppointments(await appointmentResponse.json());
    if (childrenResponse.ok) {
      const children = await childrenResponse.json();
      setCandidates(children.flatMap((child: { id: string; name: string; vaccinations?: Array<{ vaccineId: string; status: string; date: string; vaccine?: { name: string } }> }) =>
        (child.vaccinations || [])
          .filter((record) => record.status !== "DONE" && new Date(record.date) >= new Date())
          .map((record) => ({
            childId: child.id,
            childName: child.name,
            vaccineId: record.vaccineId,
            vaccineName: record.vaccine?.name || "Vaccination",
            scheduledFor: record.date,
          })),
      ).sort((a: Candidate, b: Candidate) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()).slice(0, 5));
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => load().catch(() => undefined));
  }, [load]);

  const enablePush = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setMessage("Les notifications Push ne sont pas prises en charge par ce navigateur.");
      return;
    }
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      setMessage("Les clés Push doivent être configurées par l’administrateur.");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setMessage("Autorisation de notification refusée.");
      return;
    }
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });
    if (response.ok) {
      setPreferences((current) => ({ ...current, pushEnabled: true }));
      setMessage("Notifications Push activées sur cet appareil.");
    }
  };

  const save = async () => {
    setSaving(true);
    const response = await fetch("/api/reminders/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preferences),
    });
    setMessage(response.ok ? "Préférences enregistrées." : "Impossible d’enregistrer les préférences.");
    setSaving(false);
  };

  const confirm = async (id: string) => {
    const response = await fetch(`/api/appointments/${id}/confirm`, { method: "POST" });
    if (response.ok) {
      setAppointments((current) => current.map((item) => item.id === id ? { ...item, status: "CONFIRMED" } : item));
      setMessage("Rendez-vous confirmé et rappels programmés.");
    }
  };

  const propose = async (candidate: Candidate) => {
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(candidate),
    });
    if (response.ok) {
      await load();
      setMessage("Date recommandée ajoutée. Confirmez quand le rendez-vous est pris.");
    }
  };

  const channels = [
    { key: "pushEnabled" as const, label: "Push", icon: BellRing, action: enablePush },
    { key: "smsEnabled" as const, label: "SMS", icon: Phone },
    { key: "whatsappEnabled" as const, label: "WhatsApp", icon: MessageCircle },
  ];

  return (
    <section className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-[10px] font-black uppercase tracking-[.2em] text-sky-600">Canaux de rappel</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">Comment souhaitez-vous être prévenu ?</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {channels.map(({ key, label, icon: Icon, action }) => (
            <button
              key={key}
              type="button"
              aria-pressed={preferences[key]}
              onClick={() => action && !preferences[key]
                ? action()
                : setPreferences((current) => ({ ...current, [key]: !current[key] }))}
              className={`rounded-2xl border p-4 text-left transition ${preferences[key] ? "border-sky-400 bg-sky-50 text-sky-900" : "border-slate-200 text-slate-500"}`}
            >
              <Icon size={20} />
              <span className="mt-3 flex items-center justify-between text-xs font-black">{label}{preferences[key] && <Check size={15} />}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-end gap-4">
          <label className="text-xs font-bold text-slate-600">Silence de <input type="time" value={preferences.quietHoursStart || ""} onChange={(event) => setPreferences({ ...preferences, quietHoursStart: event.target.value })} className="ml-2 rounded-xl border border-slate-200 p-2" /></label>
          <label className="text-xs font-bold text-slate-600">à <input type="time" value={preferences.quietHoursEnd || ""} onChange={(event) => setPreferences({ ...preferences, quietHoursEnd: event.target.value })} className="ml-2 rounded-xl border border-slate-200 p-2" /></label>
        </div>
        <button onClick={save} disabled={saving} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 p-4 text-xs font-black text-white">
          <Save size={16} />{saving ? "Enregistrement…" : "Enregistrer mes préférences"}
        </button>
        {message && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-600">{message}</p>}
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-[10px] font-black uppercase tracking-[.2em] text-violet-600">Rendez-vous</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">Confirmer les prochains passages</h2>
        <div className="mt-6 space-y-3">
          {!appointments.length && !candidates.length && <p className="rounded-2xl bg-slate-50 p-5 text-sm font-medium text-slate-500">Aucun rendez-vous proposé pour le moment.</p>}
          {appointments.map((appointment) => (
            <article key={appointment.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4">
              <div>
                <p className="font-black text-slate-800">{appointment.child.name} · {appointment.vaccine?.name || "Vaccination"}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{new Date(appointment.scheduledFor).toLocaleString("fr-FR")}{appointment.facility ? ` · ${appointment.facility.name}` : ""}</p>
              </div>
              {appointment.status === "CONFIRMED" ? (
                <span className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-800"><CalendarCheck size={15} />Rendez-vous pris</span>
              ) : (
                <button onClick={() => confirm(appointment.id)} className="rounded-xl bg-violet-500 px-4 py-3 text-xs font-black text-white">J’ai pris rendez-vous</button>
              )}
            </article>
          ))}
          {!appointments.length && candidates.map((candidate) => (
            <article key={`${candidate.childId}-${candidate.vaccineId}`} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-sky-200 bg-sky-50/50 p-4">
              <div>
                <p className="font-black text-slate-800">{candidate.childName} · {candidate.vaccineName}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">Date recommandée : {new Date(candidate.scheduledFor).toLocaleDateString("fr-FR")}</p>
              </div>
              <button type="button" onClick={() => propose(candidate)} className="rounded-xl bg-sky-600 px-4 py-3 text-xs font-black text-white">Planifier</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
