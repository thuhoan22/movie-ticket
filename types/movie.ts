/** Row in `public.movie_details` (FK `movie_id` → `movies.id`) */
export type MovieDetailsRow = {
  id?: string;
  movie_id?: string | null;
  director?: string | null;
  cast?: string | null;
  language?: string | null;
  rated?: string | null;
  /** YouTube watch URL, youtu.be short link, or /embed/ URL */
  trailer?: string | null;
};

export type Movie = {
  id: string;
  title: string;
  poster_url: string;
  genre?: string;
  duration?: number;
  release_date: string;
  desc?: string | null;
  description?: string | null;
  /** Full URL or embed-friendly YouTube link (optional duplicate of `trailer`) */
  trailer_url?: string | null;
  /** From `movie_details.trailer` or legacy column on `movies` */
  trailer?: string | null;
  director?: string | null;
  cast?: string | null;
  language?: string | null;
  rated?: string | null;
  rating?: number | null;
};