import Link from "next/link";
import PayWithMpesa from "./components/PayWithMpesa";

type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
};

// Server-side function to fetch books
async function getBooks(): Promise<Book[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${API_URL}/books`, { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("GET /books non-OK:", res.status, text);
      return [];
    }

    const data = await res.json();

    const list = Array.isArray(data)
      ? data
      : Array.isArray((data as any)?.rows)
      ? (data as any).rows
      : Array.isArray((data as any)?.data)
      ? (data as any).data
      : [];

    return list
      .map((item: any) => ({
        id: String(item.id ?? ""),
        title: String(item.title ?? ""),
        author: String(item.author ?? ""),
        price: Number(item.price ?? 0),
      }))
      .filter((b) => b.id && b.title);
  } catch (err) {
    console.error("Failed to fetch /books:", err);
    return [];
  }
}

// Server Component — default export for Next.js page
export default async function HomePage() {
  const books = await getBooks();

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <h1 className="mb-8 text-3xl font-bold">Blossom Books</h1>

      {books.length === 0 && (
        <p className="text-zinc-500">No books available.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <Link key={book.id} href={`/book/${book.id}`}>
            <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md cursor-pointer">
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-sm text-zinc-500">{book.author}</p>
              <p className="mt-4 font-bold">
                KES {book.price.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 max-w-md">
        <PayWithMpesa />
      </div>
    </main>
  );
}
