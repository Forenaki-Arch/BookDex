import { NextResponse } from "next/server";

const OPEN_LIBRARY = "https://openlibrary.org/search.json";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const isbn = searchParams.get("isbn");

  if (!q && !isbn) {
    return NextResponse.json({ error: "Missing q or isbn parameter" }, { status: 400 });
  }

  const query = isbn
    ? `isbn=${encodeURIComponent(isbn)}`
    : `q=${encodeURIComponent(q!)}`;

  const fields = "key,title,author_name,isbn,cover_i,first_publish_year,number_of_pages_median,publisher,subject,language";
  const url = `${OPEN_LIBRARY}?${query}&limit=20&fields=${fields}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "BookDex/1.1 (https://github.com/Forenaki-Arch/BookDex)" },
    });
    if (!res.ok) throw new Error(`Open Library responded ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("Books API error:", err);
    return NextResponse.json({ error: "Book service error" }, { status: 502 });
  }
}
