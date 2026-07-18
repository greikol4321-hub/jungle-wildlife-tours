"use client";

import { useEffect, useState } from "react";
import { submitReview, getApprovedReviews } from "@/app/actions/reviews";
import { Star } from "lucide-react";

type Review = {
  id: string;
  author_name: string;
  author_country: string | null;
  rating: number;
  comment_es: string | null;
  created_at: string | null;
};

export function ReviewsSection({ tourId, locale }: { tourId: string; locale: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    getApprovedReviews(tourId).then((data) => {
      setReviews(data as Review[]);
      setLoading(false);
    });
  }, [tourId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setSending(true);
    try {
      await submitReview({ author_name: name, author_country: country, rating, comment, tour_id: tourId });
      setSent(true);
      setName("");
      setCountry("");
      setRating(5);
      setComment("");
    } catch {
      alert("Error al enviar reseña");
    }
    setSending(false);
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

      {sent ? (
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={locale === "es" ? "Tu nombre" : "Your name"}
              required
              className="admin-input"
            />
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
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
                <button key={i} type="button" onClick={() => setRating(i + 1)}>
                  <Star
                    className={`h-5 w-5 transition-colors ${i < rating ? "text-emerald fill-emerald" : "text-border-strong hover:text-emerald/50"}`}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            <span className="text-[10px] text-text-muted font-mono ml-1">{starLabels[rating - 1]}</span>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={locale === "es" ? "Escribe tu reseña..." : "Write your review..."}
            required
            rows={3}
            className="admin-input admin-textarea"
          />

          <button type="submit" disabled={sending || !name.trim() || !comment.trim()}
            className="btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending
              ? (locale === "es" ? "Enviando..." : "Sending...")
              : (locale === "es" ? "Enviar reseña" : "Submit review")}
          </button>
        </form>
      )}
    </section>
  );
}
