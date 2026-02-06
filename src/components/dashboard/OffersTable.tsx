import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Offer {
  id: string;
  name: string;
  discount: number;
  usage: number;
  status: "active" | "expired" | "scheduled";
  revenue: number;
}

const offers: Offer[] = [
  { id: "1", name: "عرض الصيف", discount: 15, usage: 245, status: "active", revenue: 125000 },
  { id: "2", name: "خصم العملاء الجدد", discount: 10, usage: 189, status: "active", revenue: 89000 },
  { id: "3", name: "عرض نهاية السنة", discount: 20, usage: 156, status: "expired", revenue: 156000 },
  { id: "4", name: "خصم VIP", discount: 25, usage: 78, status: "active", revenue: 234000 },
];

const statusMap = {
  active: { label: "نشط", className: "bg-green-100 text-green-700 border-green-200" },
  expired: { label: "منتهي", className: "bg-red-100 text-red-700 border-red-200" },
  scheduled: { label: "مجدول", className: "bg-amber-100 text-amber-700 border-amber-200" },
};

export function OffersTable() {
  return (
    <div className="card-glow rounded-xl bg-card border border-border overflow-hidden">
      <div className="p-4 lg:p-6 border-b border-border">
        <h3 className="text-base lg:text-lg font-semibold">💳 الخصومات والعروض</h3>
      </div>
      
      {/* Mobile cards */}
      <div className="lg:hidden p-4 space-y-3">
        {offers.map((offer) => (
          <div key={offer.id} className="p-4 rounded-lg bg-secondary/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{offer.name}</span>
              <Badge variant="outline" className={cn("border text-xs", statusMap[offer.status].className)}>
                {statusMap[offer.status].label}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">الخصم</span>
              <span className="font-medium text-primary">{offer.discount}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">الاستخدام</span>
              <span>{offer.usage} مرة</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">الإيرادات</span>
              <span className="font-medium">{offer.revenue.toLocaleString()} ج.م</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الاسم</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الخصم</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الاستخدام</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الحالة</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الإيرادات</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 font-medium">{offer.name}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {offer.discount}%
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{offer.usage} مرة</td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className={cn("border", statusMap[offer.status].className)}>
                    {statusMap[offer.status].label}
                  </Badge>
                </td>
                <td className="px-6 py-4 font-medium">{offer.revenue.toLocaleString()} ج.م</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
