import { Building2, User, Percent, MessageSquare, Eye } from "lucide-react";

interface Activity {
  id: string;
  type: "property" | "user" | "offer" | "message" | "view";
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  { id: "1", type: "property", title: "عقار جديد", description: "تم إضافة فيلا جديدة في حي النرجس", time: "منذ ساعة" },
  { id: "2", type: "user", title: "مستخدم جديد", description: "تم تسجيل مستخدم جديد", time: "منذ ساعتين" },
  { id: "3", type: "offer", title: "عرض جديد", description: "عرض خصم بنسبة 15%", time: "منذ 3 ساعات" },
  { id: "4", type: "message", title: "رسالة جديدة", description: "استفسار عن عقار في الرياض", time: "منذ ساعتين" },
  { id: "5", type: "view", title: "مشاهدة عالية", description: "شقة حي الملقا وصلت 500 مشاهدة", time: "منذ 3 ساعات" },
];

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

export function ActivityFeed() {
  return (
    <div className="rounded-lg p-6 lg:p-8 bg-white border border-gray-200">
      <div className="mb-6 lg:mb-8">
        <h3 className="text-lg lg:text-xl font-semibold text-gray-900">🔔 الأنشطة الحديثة</h3>
      </div>
      
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
    </div>
  );
}
