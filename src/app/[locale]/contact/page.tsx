"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { sendContactMessage } from "../../actions/contact";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  tourInterest: z.string().optional(),
});

type ContactValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const t = useTranslations("contact");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      tourInterest: "",
    },
  });

  return (
    <main className="flex-1 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section divider */}
        <div className="mb-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--color-border)]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-emerald)]" />
          <div className="h-px flex-1 bg-[var(--color-border)]" />
        </div>

        {/* Header */}
        <h1
          className="font-heading font-bold tracking-tight text-[var(--color-text)]"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          {t("title")}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
          {t("subtitle")}
        </p>

        {/* Two-column layout */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <form
            onSubmit={handleSubmit((values) =>
              startTransition(async () => {
                await sendContactMessage(values);
              })
            )}
            className="grid gap-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 sm:p-9"
          >
            {/* Name */}
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
                {t("form.name")}
              </label>
              <input
                type="text"
                placeholder="Tu nombre completo"
                {...register("name")}
                className={`mt-0 block w-full rounded-xl border bg-[var(--color-surface-elevated)] px-5 py-3.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] transition focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-[var(--color-border)] focus:border-[var(--color-emerald)] focus:ring-[var(--color-emerald)]/20"
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
                {t("form.email")}
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                {...register("email")}
                className={`mt-0 block w-full rounded-xl border bg-[var(--color-surface-elevated)] px-5 py-3.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] transition focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-[var(--color-border)] focus:border-[var(--color-emerald)] focus:ring-[var(--color-emerald)]/20"
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
                {t("form.phone")}
              </label>
              <input
                type="tel"
                placeholder="+506..."
                {...register("phone")}
                className="mt-0 block w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-5 py-3.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] transition focus:border-[var(--color-emerald)] focus:outline-none focus:ring-2 focus:ring-[var(--color-emerald)]/20"
              />
            </div>

            {/* Tour Interest */}
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
                {t("form.tourInterest")}
              </label>
              <select
                {...register("tourInterest")}
                className="mt-0 block w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-5 py-3.5 text-sm text-[var(--color-text)] transition focus:border-[var(--color-emerald)] focus:outline-none focus:ring-2 focus:ring-[var(--color-emerald)]/20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='rgba(232,228,220,0.55)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                }}
              >
                <option value="">{t("form.none")}</option>
                <option value="day_park">
                  Tour terrestre · Parque Nacional Manuel Antonio
                </option>
                <option value="mangrove">
                  Kayak en manglar · Isla Damas
                </option>
                <option value="night_walk">Caminata nocturna</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
                {t("form.message")}
              </label>
              <textarea
                rows={6}
                placeholder="Contanos sobre tu viaje ideal..."
                {...register("message")}
                className={`mt-0 block w-full resize-none rounded-xl border bg-[var(--color-surface-elevated)] px-5 py-3.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] transition focus:outline-none focus:ring-2 ${
                  errors.message
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-[var(--color-border)] focus:border-[var(--color-emerald)] focus:ring-[var(--color-emerald)]/20"
                }`}
                style={{ minHeight: "160px" }}
              />
              {errors.message && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--color-emerald)] px-8 py-4 text-sm font-semibold text-[#0B1A0F] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {/* Shimmer overlay */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              {isPending ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {t("form.sending")}
                </>
              ) : (
                t("form.submit")
              )}
            </button>
          </form>

          {/* Contact info cards */}
          <div className="flex flex-col gap-5 self-start">
            {/* WhatsApp */}
            <div className="group flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-emerald)]/30 hover:bg-[var(--color-surface-elevated)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-emerald)]/10 transition group-hover:bg-[var(--color-emerald)]/15">
                <svg
                  className="h-5 w-5 text-[var(--color-emerald)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
                  WhatsApp
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                  +506 8888-8888
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="group flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-emerald)]/30 hover:bg-[var(--color-surface-elevated)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-emerald)]/10 transition group-hover:bg-[var(--color-emerald)]/15">
                <svg
                  className="h-5 w-5 text-[var(--color-emerald)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
                  Email
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                  info@junglewildlifetours.com
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="group flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-emerald)]/30 hover:bg-[var(--color-surface-elevated)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-emerald)]/10 transition group-hover:bg-[var(--color-emerald)]/15">
                <svg
                  className="h-5 w-5 text-[var(--color-emerald)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
                  Ubicación
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                  Manuel Antonio, Puntarenas, Costa Rica
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
