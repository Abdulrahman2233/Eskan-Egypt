import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Copy, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LocationPickerProps {
  onLocationSelect: (latitude: number, longitude: number) => void;
  latitude?: number | string;
  longitude?: number | string;
  height?: string;
}

// تصحيح أيقونات Leaflet
delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export const LocationPicker = ({
  onLocationSelect,
  latitude,
  longitude,
  height = "400px",
}: LocationPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const [copying, setCopying] = useState(false);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  // تحويل الإحداثيات الأولية
  const initialLat = latitude ? parseFloat(String(latitude)) : 31.2054;
  const initialLng = longitude ? parseFloat(String(longitude)) : 29.9187;

  useEffect(() => {
    if (!mapContainer.current) return;

    // إنشاء الخريطة
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([initialLat, initialLng], 13);

      // إضافة طبقة الخريطة
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map.current);

      // إضافة المؤشر الأولي
      if (latitude && longitude) {
        marker.current = L.marker([initialLat, initialLng], {
          title: "موقع العقار",
          draggable: true,
        }).addTo(map.current);

        marker.current.on("dragend", () => {
          if (marker.current) {
            const pos = marker.current.getLatLng();
            setCoords({ lat: pos.lat, lng: pos.lng });
            onLocationSelect(pos.lat, pos.lng);
          }
        });

        setCoords({ lat: initialLat, lng: initialLng });
      }

      // معالج النقر على الخريطة
      map.current.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        // إزالة المؤشر القديم
        if (marker.current) {
          map.current!.removeLayer(marker.current);
        }

        // إضافة مؤشر جديد
        marker.current = L.marker([lat, lng], {
          title: "موقع العقار",
          draggable: true,
        }).addTo(map.current!);

        marker.current.on("dragend", () => {
          if (marker.current) {
            const pos = marker.current.getLatLng();
            setCoords({ lat: pos.lat, lng: pos.lng });
            onLocationSelect(pos.lat, pos.lng);
          }
        });

        // حفظ الإحداثيات
        setCoords({ lat, lng });
        onLocationSelect(lat, lng);

        // عرض popup
        marker.current.bindPopup(`
          <div style="direction: rtl; text-align: right; font-family: Cairo, sans-serif;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">موقع العقار</p>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">
              الخط العرض: ${lat.toFixed(6)}
            </p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">
              خط الطول: ${lng.toFixed(6)}
            </p>
          </div>
        `).openPopup();
      });
    }

    return () => {
      // لا تزيل الخريطة عند إعادة التصيير
    };
  }, []);

  const copyCoordinates = async () => {
    if (!coords) return;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
      setTimeout(() => setCopying(false), 2000);
    } catch {
      setCopying(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // تحديث الخريطة والمؤشر
        if (map.current) {
          map.current.setView([latitude, longitude], 16);

          // إزالة المؤشر القديم
          if (marker.current) {
            map.current.removeLayer(marker.current);
          }

          // إضافة مؤشر جديد
          marker.current = L.marker([latitude, longitude], {
            title: "موقعك الحالي",
            draggable: true,
          }).addTo(map.current);

          marker.current.on("dragend", () => {
            if (marker.current) {
              const pos = marker.current.getLatLng();
              setCoords({ lat: pos.lat, lng: pos.lng });
              onLocationSelect(pos.lat, pos.lng);
            }
          });

          // عرض popup
          marker.current.bindPopup(`
            <div style="direction: rtl; text-align: right; font-family: Cairo, sans-serif;">
              <p style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">موقعك الحالي</p>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                الخط العرض: ${latitude.toFixed(6)}
              </p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">
                خط الطول: ${longitude.toFixed(6)}
              </p>
            </div>
          `).openPopup();

          setCoords({ lat: latitude, lng: longitude });
          onLocationSelect(latitude, longitude);
          toast.success("تم تحديد موقعك الحالي بنجاح");
        }

        setGeoLoading(false);
      },
      (error) => {
        setGeoLoading(false);
        console.error("Geolocation error:", error);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("لم تسمح بالوصول إلى موقعك");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("لم يتمكن النظام من تحديد موقعك");
            break;
          case error.TIMEOUT:
            toast.error("انتهت مهلة تحديد الموقع");
            break;
          default:
            toast.error("خطأ في تحديد الموقع");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div
          ref={mapContainer}
          style={{
            height,
            borderRadius: "8px",
            border: "2px solid #e5e7eb",
            overflow: "hidden",
            cursor: "crosshair",
            position: "relative",
            zIndex: 1,
          }}
        />
        <Button
          onClick={getCurrentLocation}
          disabled={geoLoading}
          size="sm"
          className="absolute top-3 right-3 z-10 bg-white hover:bg-gray-50 text-slate-700 border border-slate-300 shadow-lg"
          variant="outline"
        >
          {geoLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          <span className="mr-2 text-xs">موقعي الآن</span>
        </Button>
        

      </div>
      

    </div>
  );
};

export default LocationPicker;
