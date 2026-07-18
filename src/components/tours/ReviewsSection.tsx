"use client";

import { useEffect, useState, useReducer } from "react";
import { submitReview, getApprovedReviews } from "@/app/actions/reviews";
import { Star } from "lucide-react";
import { useToast } from "@/components/admin/toast";

type Review = {
  id: string;
  author_name: string;
  author_country: string | null;
  rating: number;
  comment_es: string | null;
  created_at: string | null;
};

export function ReviewsSection({ tourId, locale }: { tourId: string; locale: string }) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  type FormState = {
    name: string;
    country: string;
    rating: number;
    comment: string;
    sending: boolean;
    sent: boolean;
  };

  type FormAction =
    | { type: "SET_FIELD"; field: "name" | "country" | "comment"; value: string }
    | { type: "SET_RATING"; value: number }
    | { type: "SUBMIT_START" }
    | { type: "SUBMIT_DONE" }
    | { type: "SUBMIT_ERROR" }
    | { type: "RESET_FORM" };

  function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
      case "SET_FIELD":
        return { ...state, [action.field]: action.value };
      case "SET_RATING":
        return { ...state, rating: action.value };
      case "SUBMIT_START":
        return { ...state, sending: true };
      case "SUBMIT_DONE":
        return { ...state, sending: false, sent: true, name: "", country: "", rating: 5, comment: "" };
      case "SUBMIT_ERROR":
        return { ...state, sending: false };
      case "RESET_FORM":
        return { name: "", country: "", rating: 5, comment: "", sending: false, sent: false };
      default:
        return state;
    }
  }

  const [form, dispatch] = useReducer(formReducer, { name: "", country: "", rating: 5, comment: "", sending: false, sent: false });

  useEffect(() => {
    getApprovedReviews(tourId).then((data) => {
      setReviews(data as Review[]);
      setLoading(false);
    });
  }, [tourId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;
    dispatch({ type: "SUBMIT_START" });
    try {
      await submitReview({ author_name: form.name, author_country: form.country, rating: form.rating, comment: form.comment, tour_id: tourId });
      toast("success", locale === "es" ? "Reseña enviada para revisión" : "Review submitted for approval");
      dispatch({ type: "SUBMIT_DONE" });
    } catch {
      toast("error", locale === "es" ? "Error al enviar reseña" : "Error submitting review");
      dispatch({ type: "SUBMIT_ERROR" });
    }
  }

  const starLabels = locale === "es"
    ? ["Pésimo", "Malo", "Regular", "Bueno", "Excelente"]
    : ["Terrible", "Poor", "Average", "Good", "Excellent"];

  return (
    <section className="mt-16 md:mt-20">
      <div className="h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" aria-hidden="true" />
      <h2 className="mt-8 font-heading text-xl md:text-2xl font-bold text-text">
        {locale === "es" ? "Reseñas" : "Reviews"}
      </h2>

      {loading ? (
        <p className="mt-6 text-sm text-text-muted">
          {locale === "es" ? "Cargando..." : "Loading..."}
        </p>
      ) : reviews.length === 0 ? (
        <p className="mt-6 text-sm text-text-secondary italic">
          {locale === "es" ? "No hay reseñas aún. ¡Sé el primero!" : "No reviews yet. Be the first!"}
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-lg border border-border bg-surface/50 p-4 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="font-heading font-bold text-text text-sm">{r.author_name}</span>
                  {r.author_country && (
                    <span className="text-text-muted text-xs ml-2">{r.author_country}</span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < r.rating ? "text-emerald fill-emerald" : "text-border-strong"}`}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {r.comment_es}
              </p>
              {r.created_at && (
                <p className="mt-2 text-[10px] text-text-muted font-mono">
                  {new Date(r.created_at).toLocaleDateString(locale === "es" ? "es" : "en", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {form.sent ? (
        <div className="mt-8 rounded-lg border border-emerald/30 bg-emerald-dim p-5 text-center">
          <p className="text-emerald font-heading font-bold">
            {locale === "es" ? "¡Gracias por tu reseña!" : "Thank you for your review!"}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            {locale === "es" ? "La revisaremos y la publicaremos pronto." : "We'll review it and publish it soon."}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 max-w-lg space-y-4">
          <h3 className="font-heading font-bold text-text">
            {locale === "es" ? "Deja tu reseña" : "Leave a review"}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.name}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })}
              placeholder={locale === "es" ? "Tu nombre" : "Your name"}
              required
              className="admin-input"
            />
            <input
              value={form.country}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "country", value: e.target.value })}
              placeholder={locale === "es" ? "País (opcional)" : "Country (optional)"}
              className="admin-input"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted font-mono tracking-wider uppercase">
              {locale === "es" ? "Puntuación:" : "Rating:"}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" onClick={() => dispatch({ type: "SET_RATING", value: i + 1 })}>
                  <Star
                    className={`h-5 w-5 transition-colors ${i < form.rating ? "text-emerald fill-emerald" : "text-border-strong hover:text-emerald/50"}`}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            <span className="text-[10px] text-text-muted font-mono ml-1">{starLabels[form.rating - 1]}</span>
          </div>

          <textarea
            value={form.comment}
            onChange={(e) => dispatch({ type: "SET_FIELD", field: "comment", value: e.target.value })}
            placeholder={locale === "es" ? "Escribe tu reseña..." : "Write your review..."}
            required
            rows={3}
            className="admin-input admin-textarea"
          />

          <button type="submit" disabled={form.sending || !form.name.trim() || !form.comment.trim()}
            className="btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {form.sending
              ? (locale === "es" ? "Enviando..." : "Sending...")
              : (locale === "es" ? "Enviar reseña" : "Submit review")}
          </button>
        </form>
      )}
    </section>
  );
}
