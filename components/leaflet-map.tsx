"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { RiskCategory } from "@/lib/data"

interface MapMarker {
  id: string
  name: string
  lat: number
  lng: number
  riskCategory: RiskCategory
  districtName: string
  stateName: string
  floodStatus: string
  turbidity?: number
  ph?: number
  contamination?: number
  riskScore: number
}

interface LeafletMapProps {
  markers: MapMarker[]
  center: { lat: number; lng: number }
}

const riskColors: Record<RiskCategory, string> = {
  Red: "#F44336",
  Orange: "#FF9800",
  Yellow: "#FFC107",
  Green: "#4CAF50",
}

function createCircleIcon(color: string, isFloodProne: boolean): L.DivIcon {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid #fff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        ${isFloodProne ? `<div style="
          position: absolute;
          top: -4px;
          right: -4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #4FC3F7;
          border: 1px solid #fff;
          font-size: 7px;
          font-weight: bold;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        ">F</div>` : ""}
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  })
}

export default function LeafletMap({ markers, center }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Destroy previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const map = L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom: 6,
      zoomControl: true,
    })

    // ESRI World Imagery satellite tiles (free, no API key)
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
        maxZoom: 18,
      }
    ).addTo(map)

    // Add labels overlay on top of satellite
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 18,
      }
    ).addTo(map)

    // Add markers
    markers.forEach(m => {
      const color = riskColors[m.riskCategory]
      const icon = createCircleIcon(color, m.floodStatus === "Flood-prone")

      const popup = `
        <div style="font-family: sans-serif; min-width: 180px;">
          <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #1B5E20;">${m.name}</h3>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #666;">${m.districtName}, ${m.stateName}</p>
          <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 6px;">
            <span style="
              padding: 2px 8px;
              border-radius: 10px;
              font-size: 11px;
              font-weight: 600;
              color: #fff;
              background: ${color};
            ">${m.riskCategory} Risk</span>
            <span style="font-size: 11px; color: #888;">Score: ${m.riskScore}</span>
          </div>
          ${m.floodStatus === "Flood-prone" ? '<p style="margin: 0 0 4px 0; font-size: 11px; color: #0288D1; font-weight: 600;">Flood-prone area</p>' : ""}
          ${m.turbidity !== undefined ? `
            <div style="font-size: 11px; color: #555; border-top: 1px solid #eee; padding-top: 4px; margin-top: 4px;">
              <p style="margin: 2px 0;">Turbidity: <strong>${m.turbidity} NTU</strong></p>
              <p style="margin: 2px 0;">pH: <strong>${m.ph}</strong></p>
              <p style="margin: 2px 0;">Contamination: <strong>${m.contamination}%</strong></p>
            </div>
          ` : ""}
        </div>
      `

      L.marker([m.lat, m.lng], { icon })
        .addTo(map)
        .bindPopup(popup, { maxWidth: 240 })
    })

    // Fit bounds if markers exist
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng] as [number, number]))
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 })
    }

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [markers, center])

  return (
    <div
      ref={mapRef}
      className="min-h-[500px] w-full rounded-lg"
      style={{ height: "500px" }}
    />
  )
}
