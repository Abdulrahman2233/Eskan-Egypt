import { Building2, User, Percent, MessageSquare, Eye, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import API from "@/api";

interface Activity {
  id: string | number;
  type: "property" | "user" | "offer" | "message" | "view";
  title: string;
  description: string;
  time: string;
}

const iconMap = {
  property: Building2,
  user: User,
  offer: Percent,
  message: MessageSquare,
  view: Eye,
};

const colorMap = {
  property: "bg-blue-100 text-blue-600",
  user: "bg-green-100 text-green-600",
  offer: "bg-amber-100 text-amber-600",
  message: "bg-purple-100 text-purple-600",
  view: "bg-cyan-100 text-cyan-600",
};

const actionTypeMap: Record<string, "property" | "user" | "offer" | "message" | "view"> = {
  "create_property": "property",
  "إضافة عقار جديد": "property",
  "delete_property": "property",
  "حذف عقار": "property",
  "update_property": "property",
  "تعديل عقار": "property",
  "create_user": "user",
  "إنشاء حساب جديد": "user",
  "approve_property": "property",
  "الموافقة على عقار": "property",
  "reject_property": "property",
  "رفض عقار": "property",
};

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "الآن";
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  return date.toLocaleDateString("ar-EG");
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await API.get("/analytics/recent_activities/", { params: { limit: 10 } });
        const data = response.data || [];
        const mapped: Activity[] = data.map((item: any) => ({
          id: item.id,
          type: actionTypeMap[item.action] || "property",
          title: item.action || "نشاط",
          description: item.description || item.object_name || "",
          time: getRelativeTime(item.timestamp),
        }));
        setActivities(mapped);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="rounded-lg p-6 lg:p-8 bg-white border border-gray-200">
      <div className="mb-6 lg:mb-8">
        <h3 className="text-lg lg:text-xl font-semibold text-gray-900">🔔 الأنشطة الحديثة</h3>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : activities.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">لا توجد أنشطة حديثة</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = iconMap[activity.type];
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors border border-border/30"
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[activity.type]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
