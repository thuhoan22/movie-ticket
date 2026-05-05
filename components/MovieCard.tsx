"use client";

import { useState } from "react";
import Link from "next/link";
import type { Movie } from "@/types/movie";
import BookingPopup from "./BookingPopup";

type Showtime = {
  id: string;
  start_time: string;
};

type Props = {
  movie: Movie & { showtimes?: Showtime[] };
  isComingSoon?: boolean;
};

export default function MovieCard({ movie, isComingSoon }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <div className="thumb">
        <Link 
          href={`/movies/${movie.id}`}
          // onClick={() => router.push(`/movie/${movie.id}`)}
        >
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="card-image"
          />
        </Link>
      </div>
      <div className="card-info">
        <h3 className="text-title">{movie.title}</h3>
        <p className="text-desc">
          <em>Genre:</em> {movie.genre || "—"}
        </p>
        <p className="text-desc">
          <em>Running Time:</em>{" "}
          {movie.duration != null ? `${movie.duration} minutes` : "—"}
        </p>
        <p className="text-desc">
          <em>Release date:</em>{" "}
          {movie.release_date
            ? new Date(movie.release_date).toLocaleDateString("en-GB")
            : ""}
        </p>
      </div>
      <div className="btn-wrap">
        <button
          disabled={isComingSoon}
          onClick={() => setOpen(true)}
          className={`btn-booking ${isComingSoon ? "is-coming" : ""}`}
        >
          BOOKING
        </button>
      </div>

      {open && (
        <BookingPopup
          movie={movie}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
