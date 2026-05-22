// src/lib/api-response.ts

import { NextResponse } from "next/server";

type Meta = Record<string, unknown>;

export const ok = <T>(data: T, meta?: Meta) =>
  NextResponse.json(
    { success: true, data, ...(meta && { meta }) },
    { status: 200 },
  );

export const created = <T>(data: T) =>
  NextResponse.json({ success: true, data }, { status: 201 });

export const badRequest = (message: string, errors?: Record<string, unknown>) =>
  NextResponse.json(
    { success: false, message, ...(errors && { errors }) },
    { status: 400 },
  );

export const unauthorized = (message = "Silakan login terlebih dahulu") =>
  NextResponse.json({ success: false, message }, { status: 401 });

export const forbidden = (message = "Akses tidak diizinkan") =>
  NextResponse.json({ success: false, message }, { status: 403 });

export const notFound = (message = "Data tidak ditemukan") =>
  NextResponse.json({ success: false, message }, { status: 404 });

export const conflict = (message: string) =>
  NextResponse.json({ success: false, message }, { status: 409 });

export const serverError = (message = "Terjadi kesalahan server") =>
  NextResponse.json({ success: false, message }, { status: 500 });

/** 422 Unprocessable Entity — input valid secara sintaks tapi ditolak domain (misal: bukan foto jalan) */
export const unprocessableEntity = (message: string) => {
  return NextResponse.json({ success: false, message }, { status: 422 });
};

/** 503 Service Unavailable — ML service down, timeout, atau error eksternal */
export const serviceUnavailable = (message: string) => {
  return NextResponse.json({ success: false, message }, { status: 503 });
};
