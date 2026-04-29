import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = "https://ibnux.github.io/data-indonesia";

export const revalidate = 86400; // cache 24 jam di edge

export async function GET(
  _req: NextRequest,
  // FIX 2: params harus di-type sebagai Promise di Next.js 15
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    // FIX 2: Unwrap / await promise params sebelum dipanggil method .join()
    const resolvedParams = await params;
    const path = resolvedParams.path.join("/");

    const res = await fetch(`${UPSTREAM}/${path}`, {
      headers: {
        "User-Agent": "StreetWatch/1.0",
        Accept: "application/json",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream ${res.status}` },
        { status: res.status },
      );
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  } catch (err: unknown) {
    // FIX 3: Ganti 'any' dengan 'unknown', lalu cek instanceof Error
    const errorMessage =
      err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
    return NextResponse.json({ error: errorMessage }, { status: 502 });
  }
}
