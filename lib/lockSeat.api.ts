import { supabase } from "@/lib/supabase";

export const lockSeat = async ({
  seatId,
  showtimeId,
  userId,
}: {
  seatId: number;
  showtimeId: string | number;
  userId?: string;
}) => {
  const expires = new Date(Date.now() + 5 * 60 * 1000);

  const { error } = await supabase
    .from("seat_locks")
    .insert({
      seat_id: seatId,
      showtime_id: showtimeId,
      user_id: userId ?? null,
      expires_at: expires.toISOString(),
    });

  if (error) throw error;
};