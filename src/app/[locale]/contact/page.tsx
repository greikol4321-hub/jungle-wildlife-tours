"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { sendContactMessage } from "../../actions/contact";
import { ContactHero } from "@/components/contact/ContactHero";
import { Reveal } from "@/components/ui/Reveal";
import { Send, CheckCircle } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
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
    formState: { errors, isSubmitSuccessful },
    reset,
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

  const onSubmit = (values: ContactValues) =>
    startTransition(async () => {
      try {
        await sendContactMessage(values);
        reset();
      } catch {
        /* errors handled below */
      }
    });

  const infoCards = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 9h8" />
          <path d="M8 13h6" />
          <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
        </svg>
      ),
      label: "WhatsApp",
      value: "+506 8423-0485",
      href: "https://wa.me/50684230485",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
          <path d="M3 7l9 6l9 -6" />
        </svg>
      ),
      label: t("emailLabel"),
      value: "junglewildlifetours.cr@gmail.com",
      href: "mailto:junglewildlifetours.cr@gmail.com",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
          <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
        </svg>
      ),
      label: t("locationLabel"),
      value: "Manuel Antonio, Puntarenas, Costa Rica",
    },
  ];

  return (
    <>
      <ContactHero />

      <main className="flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-12" aria-hidden="true">
            <div className="h-px w-12 bg-gradient-to-r from-emerald/30 to-transparent" />
            <div className="h-1.5 w-1.5 rounded-full bg-emerald/40" />
            <div className="h-px flex-1 bg-gradient-to-r from-emerald/20 to-transparent" />
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <Reveal>
              <div>
                <h2
                  className="font-heading font-bold tracking-tight text-text"
                  style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}
                >
                  {t("title")}
                </h2>
                <p className="mt-3 text-text-secondary text-[15px] leading-relaxed max-w-lg">
                  {t("subtitle")}
                </p>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-8 grid gap-5"
                >
                  <div>
                    <label htmlFor="name" className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-text-secondary">
                      {t("form.name")}
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder={t("form.namePlaceholder")}
                      {...register("name")}
                      className={`block w-full rounded-xl border bg-surface-elevated px-5 py-3.5 text-sm text-text placeholder:text-text-secondary transition focus:outline-none focus:ring-2 ${
                        errors.name
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-border focus:border-emerald focus:ring-emerald/20"
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-text-secondary">
                      {t("form.email")}
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder={t("form.emailPlaceholder")}
                      {...register("email")}
                      className={`block w-full rounded-xl border bg-surface-elevated px-5 py-3.5 text-sm text-text placeholder:text-text-secondary transition focus:outline-none focus:ring-2 ${
                        errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-border focus:border-emerald focus:ring-emerald/20"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-text-secondary">
                      {t("form.phone")}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+506..."
                      {...register("phone")}
                      className="block w-full rounded-xl border border-border bg-surface-elevated px-5 py-3.5 text-sm text-text placeholder:text-text-secondary transition focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="tourInterest" className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-text-secondary">
                      {t("form.tourInterest")}
                    </label>
                    <select
                      id="tourInterest"
                      {...register("tourInterest")}
                      className="block w-full appearance-none rounded-xl border border-border bg-surface-elevated px-5 py-3.5 text-sm text-text transition focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='rgba(232,228,220,0.55)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                      }}
                    >
                      <option value="">{t("form.none")}</option>
                      <option value="day_park">{t("form.tourDayPark")}</option>
                      <option value="mangrove">{t("form.tourMangrove")}</option>
                      <option value="barco-manglar-damas">{t("form.tourBoatMangrove")}</option>
                      <option value="night_walk">{t("form.tourNight")}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-text-secondary">
                      {t("form.message")}
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      placeholder={t("form.messagePlaceholder")}
                      {...register("message")}
                      className={`block w-full resize-none rounded-xl border bg-surface-elevated px-5 py-3.5 text-sm text-text placeholder:text-text-secondary transition focus:outline-none focus:ring-2 ${
                        errors.message
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-border focus:border-emerald focus:ring-emerald/20"
                      }`}
                      style={{ minHeight: "160px" }}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-red-400">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-emerald px-8 py-4 text-sm font-semibold text-bg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    {isPending ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t("form.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" strokeWidth={2} />
                        {t("form.submit")}
                      </>
                    )}
                  </button>

                  {isSubmitSuccessful && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald/20 bg-emerald/5 px-4 py-3 text-sm text-emerald">
                      <CheckCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
                      {t("form.success")}
                    </div>
                  )}
                </form>
              </div>
            </Reveal>

            <div className="flex flex-col gap-4 self-start lg:pt-[4.5rem]">
              {infoCards.map((card) => (
                <Reveal key={card.label}>
                  {card.href ? (
                    <a
                      href={card.href}
                      target={card.href.startsWith("http") ? "_blank" : undefined}
                      rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-start gap-4 border-l border-border pl-5 py-3 transition hover:border-emerald group"
                    >
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center text-text-muted transition group-hover:text-emerald">
                        {card.icon}
                      </span>
                      <div>
                        <p className="font-mono text-[11px] tracking-[0.12em] text-text">{card.label}</p>
                        <p className="mt-1 text-[13px] text-text-secondary">{card.value}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-start gap-4 border-l border-border pl-5 py-3 transition hover:border-emerald group">
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center text-text-muted transition group-hover:text-emerald">
                        {card.icon}
                      </span>
                      <div>
                        <p className="font-mono text-[11px] tracking-[0.12em] text-text">{card.label}</p>
                        <p className="mt-1 text-[13px] text-text-secondary">{card.value}</p>
                      </div>
                    </div>
                  )}
                </Reveal>
              ))}

              <Reveal delay={200}>
                <p className="text-xs text-text-secondary/60 leading-relaxed px-1">
                  {t("directInfo")}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
