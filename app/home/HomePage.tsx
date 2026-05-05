"use client";

import { useEffect, useState } from "react";
import { getHomeMovies } from "@/lib/movie.api";
import { Movie } from "@/types/movie";
import MovieCard from '@/components/MovieCard';
import Link from 'next/link';

export default function HomePage() {
  const [nowShowing, setNowShowing] = useState<Movie[]>([]);
  const [comingSoon, setComingSoon] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHomeMovies();
      setNowShowing(data.nowShowing);
      setComingSoon(data.comingSoon);
    };

    fetchData();
  }, []);

  return (
    <main className="container home-page">
      <div className="inner">
        <section className="now-showing">
          <div className="box-head">
            <h2 className="text-title">Now showing</h2>
            <Link href="/movies?filter=now" className="btn-view">
              View all →
            </Link>
          </div>
          <div className="box-content">
            <div className="movie-list">
              {nowShowing.map((movie) => (
                <MovieCard key={movie.id} movie={movie} isComingSoon={false} />
              ))}
            </div>
          </div>
        </section>
        <section className="coming-soon">
          <div className="box-head">
            <h2 className="text-title">Coming Soon</h2>
            <Link href="/movies?filter=coming" className="btn-view">
              View all →
            </Link>
          </div>
          <div className="box-content">
            <div className="movie-list">
              {comingSoon.map((movie) => (
                <MovieCard key={movie.id} movie={movie} isComingSoon={true} />
              ))}
            </div>
          </div>
        </section>
        <section className="promotion">
          <div className="box-head">
            <h2 className="text-title">Promotions</h2>
          </div>
          <div className="box-content">
            <ul className="promotion-list">
              <li className="promotion-item">
                <span className="thumb">
                  <img src="/images/img-promotion-01.png" alt="promotion 01" />
                </span>
              </li>
              <li className="promotion-item">
                <span className="thumb">
                  <img src="/images/img-promotion-02.png" alt="promotion 02" />
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}
