import { supabase } from "./supabase";

export const createOrder = async ({
  showtimeId,
  seats,
  userId,
}: any) => {
  // 1. tạo order
  const { data: order } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      showtime_id: showtimeId,
      total_price: seats.length * 100,
    })
    .select()
    .single();

  // 2. tạo order_items
  const items = seats.map((seat: any) => ({
    order_id: order.id,
    seat_id: seat.id,
    price: 100,
  }));

  await supabase.from("order_items").insert(items);

  // 3. update ghế
  const seatIds = seats.map((s: any) => s.id);

  await supabase
    .from("seats")
    .update({ is_booked: true })
    .in("id", seatIds);

  return order;
};