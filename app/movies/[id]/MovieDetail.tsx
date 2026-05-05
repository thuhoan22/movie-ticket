"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getMovieById } from "@/lib/movie.api";
import type { Movie } from "@/types/movie";

interface MovieDetailProps {
  id: string;
}

function youtubeEmbedUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const watch = trimmed.match(/youtube\.com\/watch\?v=([^&]+)/i);
  if (watch?.[1]) return `https://www.youtube.com/embed/${watch[1]}`;

  const short = trimmed.match(/youtu\.be\/([^?]+)/i);
  if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`;

  const embed = trimmed.match(/youtube\.com\/embed\/([^?]+)/i);
  if (embed?.[1]) return `https://www.youtube.com/embed/${embed[1]}`;

  return null;
}

export default function MovieDetail({ id }: MovieDetailProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "trailer">("description");

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    getMovieById(id)
      .then((data) => {
        if (cancelled) return;
        setMovie(data as Movie | null);
      })
      .catch(() => {
        if (cancelled) return;
        setFetchError("Không tải được thông tin phim. Vui lòng thử lại.");
        setMovie(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const trailerSource =
    movie?.trailer_url?.trim() || movie?.trailer?.trim() || "";
  const embedSrc = useMemo(
    () => (trailerSource ? youtubeEmbedUrl(trailerSource) : null),
    [trailerSource],
  );

  if (loading) {
    return (
      <main className="container movie-detail-page">
        <div className="inner">
          <p className="detail-status">Đang tải...</p>
        </div>
      </main>
    );
  }

  if (fetchError || !movie) {
    return (
      <main className="container movie-detail-page">
        <div className="inner">
          <Link href="/" className="detail-back">
            ← Về trang chủ
          </Link>
          <p className="detail-error">{fetchError || "Không tìm thấy phim."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container movie-detail-page">
      <div className="inner">
        <Link href="/movies" className="detail-back">
          ← Danh sách phim
        </Link>

        <div className="detail-wrap">
          <div className="detail-thumb">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="card-image"
              width={380}
              height={534}
            />
          </div>
          <div className="detail-info">
            <h1 className="text-title">{movie.title}</h1>
            <div className="detail-meta">
              {/* {movie.director ? (
                <p className="text-desc">
                  <em>Director:</em> {movie.director}
                </p>
              ) : null}
              {movie.cast ? (
                <p className="text-desc">
                  <em>Cast:</em> {movie.cast}
                </p>
              ) : null} */}
              <p className="text-desc">
                <em>Director:</em> {movie.director || "—"}
              </p>
              <p className="text-desc">
                <em>Cast:</em> {movie.cast || "—"}
              </p>
              <p className="text-desc">
                <em>Genre:</em> {movie.genre || "—"}
              </p>
              <p className="text-desc">
                <em>Release date:</em>{" "}
                {movie.release_date
                  ? new Date(movie.release_date).toLocaleDateString("en-GB")
                  : "—"}
              </p>
              <p className="text-desc">
                <em>Running time:</em>{" "}
                {movie.duration != null ? `${movie.duration} minutes` : "—"}
              </p>
              <p className="text-desc">
                <em>Language:</em> {movie.language || "—"}
              </p>
              <p className="text-desc">
                <em>Rated:</em> {movie.rated || "—"}
              </p>
              {movie.rating != null ? (
                <p className="text-desc">
                  <em>Rating:</em> {movie.rating}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="detail-tab">
          <ul className="tab-list" role="tablist">
            <li
              className={`tab-item ${activeTab === "description" ? "is-active" : ""}`}
              role="presentation"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "description"}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
            </li>
            <li
              className={`tab-item ${activeTab === "trailer" ? "is-active" : ""}`}
              role="presentation"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "trailer"}
                onClick={() => setActiveTab("trailer")}
              >
                Trailer
              </button>
            </li>
          </ul>
          <div className="tab-content">
            {activeTab === "description" ? (
              <p className="detail-description">
                {(
                  (movie.desc ?? movie.description ?? "").trim() || "No description"
                )}
              </p>
            ) : (
              <div className="detail-trailer">
                {embedSrc ? (
                  <div className="detail-trailer-frame">
                    <iframe
                      src={embedSrc}
                      title={`Trailer — ${movie.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : trailerSource ? (
                  <p className="detail-trailer-fallback">
                    <a href={trailerSource} target="_blank" rel="noopener noreferrer">
                      Open the trailer in a new tab
                    </a>
                  </p>
                ) : (
                  <p className="detail-description">No trailer.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
