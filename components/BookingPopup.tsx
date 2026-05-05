"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Showtime = {
  id: string;
  start_time: string;
  room_name?: string;
  theaters?: {
    id: string;
    name: string;
    city: string;
    country?: string;
  } | {
    id: string;
    name: string;
    city: string;
    country?: string;
  }[];
  theater?: {
    id: string;
    name: string;
    city: string;
    country?: string;
  } | {
    id: string;
    name: string;
    city: string;
    country?: string;
  }[];
};

type BookingPopupProps = {
  movie: {
    id?: string;
    title?: string;
    showtimes?: Showtime[];
  };
  onClose: () => void;
};

export default function BookingPopup({ movie, onClose }: BookingPopupProps) {
  const router = useRouter();
  const [showtimes, setShowtimes] = useState<Showtime[]>(movie?.showtimes || []);
  const [debugError, setDebugError] = useState<string>("");
  const [debugAccessibleShowtimes, setDebugAccessibleShowtimes] = useState<number | null>(null);

  const getTheater = (showtime: Showtime) => {
    const source = showtime.theaters ?? showtime.theater;
    if (!source) return undefined;
    return Array.isArray(source) ? source[0] : source;
  };

  // STATE
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);

  useEffect(() => {
    setShowtimes(movie?.showtimes || []);
  }, [movie]);

  useEffect(() => {
    const hasInitial = (movie?.showtimes || []).length > 0;
    if (hasInitial || !movie?.id) return;

    let cancelled = false;

    const fetchShowtimes = async () => {
      const { count } = await supabase
        .from("showtimes")
        .select("id", { count: "exact", head: true });
      setDebugAccessibleShowtimes(count ?? null);

      const { data, error } = await supabase
        .from("showtimes")
        .select(
          `
            id,
            start_time,
            room_name,
            theater_id,
            theaters!showtimes_theater_id_fkey (
              id,
              name,
              city
            )
          `,
        )
        .eq("movie_id", movie.id)
        .order("start_time", { ascending: true });

      if (cancelled) return;

      if (error) {
        setDebugError(error.message || "Failed to fetch showtimes");
        setShowtimes([]);
        return;
      }

      setDebugError("");
      setShowtimes((data || []) as Showtime[]);
    };

    fetchShowtimes();

    return () => {
      cancelled = true;
    };
  }, [movie?.id, movie?.showtimes]);

  // generate 30 ngày
  const dates = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  // list city
  const cities = useMemo(() => {
    return [
      ...new Set(
        showtimes
          .map((s) => {
            const theater = getTheater(s);
            return theater?.city || theater?.country || "";
          })
          .filter((city): city is string => Boolean(city)),
      ),
    ];
  }, [showtimes]);

  // filter theo date + city
  const filteredTheaters = useMemo(() => {
    return showtimes.filter((s) => {
      const dateMatch = selectedDate
        ? new Date(s.start_time).toDateString() === selectedDate
        : true;

      const cityMatch = selectedCity
        ? (() => {
            const theater = getTheater(s);
            const location = theater?.city || theater?.country;
            return location === selectedCity;
          })()
        : true;

      return dateMatch && cityMatch;
    });
  }, [showtimes, selectedDate, selectedCity]);

  // group theo theater
  const grouped = useMemo(() => {
    return filteredTheaters.reduce<Record<string, Showtime[]>>((acc, s) => {
      const key = getTheater(s)?.name ?? "Unknown theater";

      if (!acc[key]) acc[key] = [];
      acc[key].push(s);

      return acc;
    }, {});
  }, [filteredTheaters]);

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-header">
          <h2>{movie.title}</h2>
          <button onClick={onClose} className="btn-close">
            <span className="icon">
              <img src="/images/svg/icon-close.svg" alt="" />
            </span>
          </button>
        </div>
        <div className="popup-content">
          {/* <p className="text-debug">
            Debug: movieId = {movie.id || "N/A"} | showtimes = {showtimes.length}
          </p>
          <p className="text-debug">
            Debug: accessible showtimes rows = {debugAccessibleShowtimes ?? "N/A"}
          </p>
          {debugError ? <p className="text-debug">Debug error: {debugError}</p> : null} */}
          {/* Date */}
          <div className="select-area select-date">
            <div className="date-wrap">
              {dates.map((d) => {
                const key = d.toDateString();

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDate(key)}
                    className={selectedDate === key ? "is-active" : ""}
                  >
                    {d.getDate()}/{d.getMonth() + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Country */}
          <div className="select-area select-country">
            <div className="country-wrap">
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCity(c)}
                  className={selectedCity === c ? "is-active" : ""}
                >
                  {c}
                </button>
              ))}
              {cities.length === 0 ? <p>No country/city available.</p> : null}
            </div>
          </div>

          {/* Theaters + time */}
          <div className="select-area select-theater">
            {Object.keys(grouped).map((theater) => (
              <div key={theater} className="theater-block">
                <h5 className="theater-title">{theater}</h5>

                <div className="theater-time">
                  {grouped[theater].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedShowtime(s)}
                      className={`btn-time ${
                        selectedShowtime?.id === s.id ? "is-active" : ""
                      }`}
                    >
                      {new Date(s.start_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(grouped).length === 0 ? (
              <p>No theaters/showtimes available for selected filters.</p>
            ) : null}
          </div>
        </div>
        <div className="popup-footer">
          <button
            disabled={!selectedShowtime}
            onClick={() => {
              if (!selectedShowtime) return;
              router.push(`/booking?showtimeId=${selectedShowtime.id}`);
              onClose();
            }}
            className="btn-continue"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}