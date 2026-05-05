"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getMoviesByFilter,
  type MoviesListFilter,
} from "@/lib/movie.api";
import type { Movie } from "@/types/movie";
import MovieCard from "@/components/MovieCard";

function parseFilterParam(raw: string | null): MoviesListFilter {
  if (raw === "now") return "now_showing";
  if (raw === "coming") return "coming_soon";
  return "all";
}

function filterToQuery(f: MoviesListFilter): string | null {
  if (f === "now_showing") return "now";
  if (f === "coming_soon") return "coming";
  return null;
}

export default function MovieList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filter = useMemo(
    () => parseFilterParam(searchParams.get("filter")),
    [searchParams],
  );

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getMoviesByFilter(filter).then((data) => {
      if (!cancelled) setMovies(data);
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [filter]);

  const applyFilter = useCallback(
    (next: MoviesListFilter) => {
      const q = filterToQuery(next);
      if (q == null) router.push("/movies");
      else router.push(`/movies?filter=${q}`);
    },
    [router],
  );

  const isComingSoonCard = (movie: Movie): boolean => {
    if (!movie.release_date) return false;
    return new Date(movie.release_date).getTime() > Date.now();
  };

  return (
    <main className="container movies-page">
      <div className="inner">
        <header className="page-head">
          <h1 className="page-title">Movies</h1>
          <div className="filter-bar" role="group" aria-label="Filter list movie">
            <button
              type="button"
              className={`filter-btn ${filter === "all" ? "is-active" : ""}`}
              onClick={() => applyFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              className={`filter-btn ${filter === "now_showing" ? "is-active" : ""}`}
              onClick={() => applyFilter("now_showing")}
            >
              Now showing
            </button>
            <button
              type="button"
              className={`filter-btn ${filter === "coming_soon" ? "is-active" : ""}`}
              onClick={() => applyFilter("coming_soon")}
            >
              Coming soon
            </button>
          </div>
        </header>

        {loading ? (
          <p className="movies-status">Loading...</p>
        ) : movies.length === 0 ? (
          <p className="movies-empty">There are no movies.</p>
        ) : (
          <div className="movie-list">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isComingSoon={isComingSoonCard(movie)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
