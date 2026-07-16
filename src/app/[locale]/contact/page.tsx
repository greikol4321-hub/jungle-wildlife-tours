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
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight font-heading text-canopy-950 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-canopy-950/70 max-w-2xl">{t("subtitle")}</p>

        <form
          onSubmit={handleSubmit((values) =>
            startTransition(async () => {
              await sendContactMessage(values);
            })
          )}
          className="mt-10 grid gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-canopy-950/5 sm:p-8"
        >
          <div>
            <label className="block text-sm font-medium text-canopy-950">
              {t("form.name")}
            </label>
            <input
              type="text"
              {...register("name")}
              className="mt-1 block w-full rounded-2xl border border-canopy-950/15 bg-bone-50 px-4 py-3 text-sm text-canopy-950 shadow-sm focus:border-canopy-600 focus:outline-none focus:ring-2 focus:ring-canopy-600/30"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-canopy-950">
              {t("form.email")}
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 block w-full rounded-2xl border border-canopy-950/15 bg-bone-50 px-4 py-3 text-sm text-canopy-950 shadow-sm focus:border-canopy-600 focus:outline-none focus:ring-2 focus:ring-canopy-600/30"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-canopy-950">
              {t("form.phone")}
            </label>
            <input
              type="tel"
              {...register("phone")}
              className="mt-1 block w-full rounded-2xl border border-canopy-950/15 bg-bone-50 px-4 py-3 text-sm text-canopy-950 shadow-sm focus:border-canopy-600 focus:outline-none focus:ring-2 focus:ring-canopy-600/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-canopy-950">
              {t("form.tourInterest")}
            </label>
            <select
              {...register("tourInterest")}
              className="mt-1 block w-full rounded-2xl border border-canopy-950/15 bg-bone-50 px-4 py-3 text-sm text-canopy-950 shadow-sm focus:border-canopy-600 focus:outline-none focus:ring-2 focus:ring-canopy-600/30"
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
            <label className="block text-sm font-medium text-canopy-950">
              {t("form.message")}
            </label>
            <textarea
              rows={5}
              {...register("message")}
              className="mt-1 block w-full rounded-2xl border border-canopy-950/15 bg-bone-50 px-4 py-3 text-sm text-canopy-950 shadow-sm focus:border-canopy-600 focus:outline-none focus:ring-2 focus:ring-canopy-600/30"
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-600">
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-full bg-canopy-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-canopy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canopy-600 disabled:opacity-70"
          >
            {isPending ? t("form.sending") : t("form.submit")}
          </button>
        </form>
      </div>
    </main>
  );
}
