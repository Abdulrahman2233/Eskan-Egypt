import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import API from "@/api";

interface Offer {
  id: number;
  title: string;
  discount_percentage: number;
  target_audience: string;
  is_active: boolean;
  start_date: string;
  end_date: string | null;
}

const audienceLabels: Record<string, string> = {
  students: "طلاب",
  families: "عائلات",
  studio: "استوديو",
  daily: "حجز يومي",
  rooms: "غرف",
  all: "الجميع",
};

function getOfferStatus(offer: Offer): "active" | "expired" | "scheduled" {
  const now = new Date();
  const start = new Date(offer.start_date);
  if (start > now) return "scheduled";
  if (!offer.is_active) return "expired";
  if (offer.end_date && new Date(offer.end_date) < now) return "expired";
  return "active";
}

const statusMap = {
  active: { label: "نشط", className: "bg-green-100 text-green-700 border-green-200" },
  expired: { label: "منتهي", className: "bg-red-100 text-red-700 border-red-200" },
  scheduled: { label: "مجدول", className: "bg-amber-100 text-amber-700 border-amber-200" },
};

export function OffersTable() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await API.get("/offers/");
        const data = response.data?.results || response.data || [];
        setOffers(data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="card-glow rounded-xl bg-card border border-border p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="card-glow rounded-xl bg-card border border-border overflow-hidden">
      <div className="p-4 lg:p-6 border-b border-border">
        <h3 className="text-base lg:text-lg font-semibold">💳 الخصومات والعروض</h3>
      </div>
      
      {offers.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">لا توجد عروض حالياً</p>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="lg:hidden p-4 space-y-3">
            {offers.map((offer) => {
              const offerStatus = getOfferStatus(offer);
              return (
                <div key={offer.id} className="p-4 rounded-lg bg-secondary/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{offer.title}</span>
                    <Badge variant="outline" className={cn("border text-xs", statusMap[offerStatus].className)}>
                      {statusMap[offerStatus].label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الخصم</span>
                    <span className="font-medium text-primary">{offer.discount_percentage}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الفئة</span>
                    <span>{audienceLabels[offer.target_audience] || offer.target_audience}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الاسم</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الخصم</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الفئة المستهدفة</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => {
                  const offerStatus = getOfferStatus(offer);
                  return (
                    <tr key={offer.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 font-medium">{offer.title}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {offer.discount_percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {audienceLabels[offer.target_audience] || offer.target_audience}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={cn("border", statusMap[offerStatus].className)}>
                          {statusMap[offerStatus].label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
