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

const inputClass =
  "mt-1 block w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20 transition-colors";

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
      <div className="mx-auto max-w-3xl">
        <div className="section-divider mb-12" />
        <h1
          className="font-heading font-bold text-text"
          style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}
        >
          {t("title")}
        </h1>
        <p className="mt-3 text-text-secondary max-w-2xl">{t("subtitle")}</p>

        <form
          onSubmit={handleSubmit((values) =>
            startTransition(async () => {
              await sendContactMessage(values);
            })
          )}
          className="mt-10 grid gap-5 rounded-2xl bg-surface border border-border p-6 sm:p-8"
        >
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              {t("form.name")}
            </label>
            <input
              type="text"
              {...register("name")}
              className={inputClass}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">
              {t("form.email")}
            </label>
            <input
              type="email"
              {...register("email")}
              className={inputClass}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">
              {t("form.phone")}
            </label>
            <input
              type="tel"
              {...register("phone")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">
              {t("form.tourInterest")}
            </label>
            <select
              {...register("tourInterest")}
              className={inputClass}
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

          <div>
            <label className="block text-sm font-medium text-text-secondary">
              {t("form.message")}
            </label>
            <textarea
              rows={5}
              {...register("message")}
              className={inputClass}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-400">
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition disabled:opacity-50"
          >
            {isPending ? t("form.sending") : t("form.submit")}
          </button>
        </form>
      </div>
    </main>
  );
}
