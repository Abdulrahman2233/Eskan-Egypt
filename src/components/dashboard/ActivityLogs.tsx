import { Building2, Trash2, User, MessageSquare, Eye, Clock, Mail, MailOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Property Logs Data
const propertyLogs = {
  new: [
    { id: "1", name: "فيلا حي النرجس", addedBy: "أحمد محمد", date: "2024-01-16", time: "14:30" },
    { id: "2", name: "شقة حي الملقا", addedBy: "سارة علي", date: "2024-01-16", time: "12:15" },
    { id: "3", name: "مبنى تجاري", addedBy: "مكتب الأمل", date: "2024-01-15", time: "18:00" },
  ],
  deleted: [
    { id: "1", name: "شقة قديمة", deletedBy: "مشرف النظام", date: "2024-01-15", time: "10:00", reason: "مخالفة للشروط" },
    { id: "2", name: "عقار منتهي", deletedBy: "المالك", date: "2024-01-14", time: "16:30", reason: "تم البيع" },
  ],
};

// User Logs Data
const userLogs = [
  { id: "1", name: "أحمد محمد", type: "مالك", email: "ahmed@example.com", joinDate: "2024-01-16" },
  { id: "2", name: "سارة علي", type: "وسيط", email: "sara@example.com", joinDate: "2024-01-15" },
  { id: "3", name: "مكتب الأمل", type: "مكتب", email: "alamal@example.com", joinDate: "2024-01-14" },
  { id: "4", name: "محمد خالد", type: "مشرف", email: "mokhaled@example.com", joinDate: "2024-01-12" },
];

// Message Logs Data
const messageLogs = [
  { id: "1", sender: "عبدالله أحمد", subject: "استفسار عن عقار", status: "unread", date: "2024-01-16", time: "15:00" },
  { id: "2", sender: "فاطمة محمد", subject: "طلب معاينة", status: "read", date: "2024-01-16", time: "12:30" },
  { id: "3", sender: "سعود العمري", subject: "عرض سعر", status: "unread", date: "2024-01-15", time: "20:00" },
  { id: "4", sender: "نورة سالم", subject: "شكوى", status: "read", date: "2024-01-15", time: "14:00" },
];

// View Logs Data
const viewLogs = [
  { id: "1", propertyName: "فيلا حي النرجس", views: 1250, lastView: "2024-01-16 15:30", trend: "up" },
  { id: "2", propertyName: "شقة حي الملقا", views: 890, lastView: "2024-01-16 14:00", trend: "up" },
  { id: "3", propertyName: "مبنى تجاري الرياض", views: 650, lastView: "2024-01-16 12:45", trend: "down" },
  { id: "4", propertyName: "فيلا جدة", views: 520, lastView: "2024-01-15 22:00", trend: "up" },
  { id: "5", propertyName: "شقة الدمام", views: 340, lastView: "2024-01-15 18:30", trend: "down" },
];

const userTypeColors: Record<string, string> = {
  "مالك": "bg-blue-100 text-blue-700",
  "وسيط": "bg-purple-100 text-purple-700",
  "مكتب": "bg-cyan-100 text-cyan-700",
  "مشرف": "bg-amber-100 text-amber-700",
};

export function ActivityLogs() {
  return (
    <div className="card-glow rounded-xl bg-card p-4 lg:p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">🧾 سجل النشاط التفصيلي</h3>
      
      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-4 h-auto">
          <TabsTrigger value="properties" className="flex items-center gap-2 py-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">العقارات</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 py-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">المستخدمون</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2 py-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">الرسائل</span>
          </TabsTrigger>
          <TabsTrigger value="views" className="flex items-center gap-2 py-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">المشاهدات</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-4">
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4" /> العقارات الجديدة
            </h4>
            <div className="space-y-2">
              {propertyLogs.new.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">بواسطة: {item.addedBy}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.date} - {item.time}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> العقارات المحذوفة
            </h4>
            <div className="space-y-2">
              {propertyLogs.deleted.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">بواسطة: {item.deletedBy} | السبب: {item.reason}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.date} - {item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">الاسم</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">النوع</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">البريد</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody>
                {userLogs.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-4 font-medium text-sm">{user.name}</td>
                    <td className="py-3 px-4">
                      <span className={cn("text-xs px-2 py-1 rounded-full", userTypeColors[user.type])}>
                        {user.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{user.email}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{user.joinDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        {/* Messages Tab */}
        <TabsContent value="messages">
          <div className="space-y-3">
            {messageLogs.map((msg) => (
              <div key={msg.id} className={cn(
                "flex items-center justify-between p-4 rounded-lg border transition-colors",
                msg.status === "unread" ? "bg-blue-50 border-blue-200" : "bg-secondary/30 border-border/50"
              )}>
                <div className="flex items-center gap-3">
                  {msg.status === "unread" ? (
                    <Mail className="h-5 w-5 text-blue-600" />
                  ) : (
                    <MailOpen className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{msg.sender}</p>
                    <p className="text-xs text-muted-foreground">{msg.subject}</p>
                  </div>
                </div>
                <div className="text-left">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    msg.status === "unread" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                  )}>
                    {msg.status === "unread" ? "غير مقروءة" : "مقروءة"}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{msg.date} - {msg.time}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Views Tab */}
        <TabsContent value="views">
          <div className="space-y-3">
            {viewLogs.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    index === 0 ? "bg-amber-100 text-amber-700" :
                    index === 1 ? "bg-gray-100 text-gray-700" :
                    index === 2 ? "bg-orange-100 text-orange-700" : "bg-secondary text-muted-foreground"
                  )}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{item.propertyName}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>آخر مشاهدة: {item.lastView}</span>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">{item.views.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">مشاهدة</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
