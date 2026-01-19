import Link from "next/link";
import MpesaSection from "./components/MpesaSection";
import { Button } from "@/components/ui/button";
import { LeafyGreen } from "lucide-react";

type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
};


async function getBooks(): Promise<Book[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${API_URL}/books`, { cache: "no-store" });
    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const books = await getBooks();

  return (
    <main className="min-h-screen bg-shop-light-pink">
      <h1 className="main-title">Blossom Books</h1>

      <Button variant="default"><LeafyGreen className="mr-2 h-4 w-4" />Browse Categories</Button>
      
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

      {/* Client-side payment section */}
      <MpesaSection />
    </main>
  );
}
