"use client";

import { Suspense } from "react";
import MovieList from "./MovieList";

export default function MoviePage() {
  return (
    <Suspense
      fallback={
        <main className="container movies-page">
          <div className="inner">
            <p className="movies-status">Loading...</p>
          </div>
        </main>
      }
    >
      <MovieList />
    </Suspense>
  );
}