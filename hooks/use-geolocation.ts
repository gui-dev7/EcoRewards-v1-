"use client";

import { useCallback, useState } from "react";
import { DEFAULT_MAP_CENTER } from "@/mocks/collection-points";

export type GeoStatus = "inativo" | "carregando" | "concedida" | "negada";

export interface GeoPosition {
  lat: number;
  lng: number;
  /** Verdadeiro quando a posição veio do navegador, falso quando é o fallback. */
  real: boolean;
}

/**
 * Geolocalização opcional. Se o usuário negar ou o navegador não
 * suportar, cai para o centro demonstrativo em São Paulo.
 */
export function useGeolocation() {
  const [status, setStatus] = useState<GeoStatus>("inativo");
  const [position, setPosition] = useState<GeoPosition>({
    ...DEFAULT_MAP_CENTER,
    real: false,
  });

  const solicitar = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("negada");
      return;
    }

    setStatus("carregando");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude, real: true });
        setStatus("concedida");
      },
      () => {
        setPosition({ ...DEFAULT_MAP_CENTER, real: false });
        setStatus("negada");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }, []);

  return { status, position, solicitar };
}

/** Distância aproximada em km (fórmula de Haversine). */
export function distanciaKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return Number((2 * R * Math.asin(Math.sqrt(h))).toFixed(1));
}
