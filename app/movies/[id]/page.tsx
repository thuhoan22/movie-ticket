import MovieDetail from "./MovieDetail";

// Next.js 15 thay đổi cơ chế dynamic params nên phải dùng Promise/await
interface PageProps {
  params: Promise<{ id: string }>; // always string from Next.js
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <MovieDetail id={id} />;
}
