import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface PropertyMapProps {
  latitude?: number | string;
  longitude?: number | string;
  propertyName?: string;
  address?: string;
  height?: string;
}

// تصحيح أيقونات Leaflet الافتراضية
delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export const PropertyMap = ({
  latitude,
  longitude,
  propertyName = "الموقع",
  address = "",
  height = "400px",
}: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (!latitude || !longitude) return;

    // تحويل القيم إلى أرقام
    const lat = parseFloat(String(latitude));
    const lng = parseFloat(String(longitude));

    // التحقق من صحة الإحداثيات
    if (isNaN(lat) || isNaN(lng)) return;

    // إنشاء الخريطة
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([lat, lng], 16);

      // إضافة طبقة الخريطة
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map.current);
    } else {
      // تحديث موقع الخريطة
      map.current.setView([lat, lng], 16);
    }

    // إضافة المؤشر
    L.marker([lat, lng], {
      title: propertyName,
    })
      .bindPopup(`
        <div style="direction: rtl; text-align: right;">
          <p style="margin: 0; font-weight: bold; color: #1f2937;">${propertyName}</p>
          ${address ? `<p style="margin: 4px 0; font-size: 12px; color: #6b7280;">${address}</p>` : ""}
          <p style="margin: 4px 0; font-size: 11px; color: #9ca3af;">
            ${lat.toFixed(6)}, ${lng.toFixed(6)}
          </p>
        </div>
      `)
      .addTo(map.current);

    return () => {
      // تنظيف
    };
  }, [latitude, longitude, propertyName, address]);

  return (
    <div
      ref={mapContainer}
      style={{
        height,
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        marginTop: "1rem",
        position: "relative",
        zIndex: 1,
      }}
    />
  );
};

export default PropertyMap;
