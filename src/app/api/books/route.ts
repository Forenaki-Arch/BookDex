import { NextResponse } from "next/server";

// Proxy server-side per Google Books: evita problemi CORS, aggiunge cache edge
const GOOGLE_BOOKS = "https://www.googleapis.com/books/v1/volumes";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const isbn = searchParams.get("isbn");

  if (!q && !isbn) {
    return NextResponse.json({ error: "Parametro q o isbn richiesto" }, { status: 400 });
  }

  const query = isbn ? `isbn:${isbn}` : q!;
  const url = `${GOOGLE_BOOKS}?q=${encodeURIComponent(query)}&maxResults=20&printType=books`;

  try {
    const res = await fetch(url, {
      // Cache edge di Vercel: 1h per ricerche ripetute
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Google Books ha risposto ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("Errore API books:", err);
    return NextResponse.json({ error: "Errore servizio libri" }, { status: 502 });
  }
}
