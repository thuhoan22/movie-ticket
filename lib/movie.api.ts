import { supabase } from "./supabase";
import type { Movie, MovieDetailsRow } from "@/types/movie";

const movieListSelect = `
  id,
  title,
  poster_url,
  genre,
  duration,
  release_date,
  showtimes!showtimes_movie_id_fkey (
    id,
    start_time,
    room_name,
    theater_id,
    theaters (
      id,
      name,
      city
    )
  )
`;

function firstDetail(
  row: MovieDetailsRow | MovieDetailsRow[] | null | undefined,
): MovieDetailsRow | undefined {
  if (!row) return undefined;
  return Array.isArray(row) ? row[0] : row;
}

/** Merge `movies` row + nested `movie_details` from Supabase into one `Movie`. */
function mergeMovieDetails(
  data: Movie & { movie_details?: MovieDetailsRow | MovieDetailsRow[] | null },
): Movie {
  const md = firstDetail(data.movie_details);
  const { movie_details: _, ...base } = data;

  return {
    ...base,
    director: md?.director ?? base.director ?? null,
    cast: md?.cast ?? base.cast ?? null,
    language: md?.language ?? base.language ?? null,
    rated: md?.rated ?? base.rated ?? null,
    trailer: md?.trailer ?? base.trailer ?? base.trailer_url ?? null,
  };
}

export const getHomeMovies = async () => {
  const today = new Date().toISOString().slice(0, 10);

  const [nowRes, comingRes] = await Promise.all([
    supabase
      .from("movies")
      .select(movieListSelect)
      .lte("release_date", today)
      .order("release_date", { ascending: false })
      .limit(4),

    supabase
      .from("movies")
      .select(movieListSelect)
      .gt("release_date", today)
      .order("release_date", { ascending: true })
      .limit(4),
  ]);

  return {
    nowShowing: nowRes.data || [],
    comingSoon: comingRes.data || [],
  };
};

/** Danh sách đầy đủ trên `/movies`: tất cả / đang chiếu / sắp ra mắt */
export type MoviesListFilter = "all" | "now_showing" | "coming_soon";

export async function getMoviesByFilter(filter: MoviesListFilter): Promise<Movie[]> {
  const today = new Date().toISOString().slice(0, 10);

  let q = supabase.from("movies").select(movieListSelect);

  if (filter === "now_showing") {
    q = q.lte("release_date", today).order("release_date", { ascending: false });
  } else if (filter === "coming_soon") {
    q = q.gt("release_date", today).order("release_date", { ascending: true });
  } else {
    q = q.order("release_date", { ascending: false });
  }

  const { data, error } = await q;

  if (error) {
    console.error("getMoviesByFilter", error);
    return [];
  }

  return (data || []) as Movie[];
}

export const getMovieById = async (id: string | number): Promise<Movie | null> => {
  const { data, error } = await supabase
    .from("movies")
    .select("*, movie_details (*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getMovieById", error);
    return null;
  }

  if (!data) return null;

  return mergeMovieDetails(data as Movie & { movie_details?: MovieDetailsRow | MovieDetailsRow[] });
};