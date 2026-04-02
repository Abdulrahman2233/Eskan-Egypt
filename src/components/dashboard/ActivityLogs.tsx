import { Building2, Trash2, User, MessageSquare, Eye, Clock, Mail, MailOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import API from "@/api";

interface ActivityLogItem {
  id: number;
  user_name: string;
  action: string;
  action_display: string;
  content_type: string;
  object_name: string;
  description: string;
  timestamp: string;
}

interface UserItem {
  id: number;
  user: { username: string; first_name: string; last_name: string; email: string };
  user_type: string;
  created_at: string;
}

interface MessageItem {
  id: number;
  name: string;
  subject: string;
  is_read: boolean;
  created_at: string;
}

interface TopPropertyItem {
  id: string;
  name: string;
  area: string;
  price: number;
  rooms: number;
}

const userTypeColors: Record<string, string> = {
  "owner": "bg-blue-100 text-blue-700",
  "مالك": "bg-blue-100 text-blue-700",
  "broker": "bg-purple-100 text-purple-700",
  "وسيط": "bg-purple-100 text-purple-700",
  "office": "bg-cyan-100 text-cyan-700",
  "مكتب": "bg-cyan-100 text-cyan-700",
  "admin": "bg-amber-100 text-amber-700",
  "مشرف": "bg-amber-100 text-amber-700",
};

const userTypeLabels: Record<string, string> = {
  owner: "مالك",
  broker: "وسيط",
  office: "مكتب",
  admin: "مشرف",
};

function formatDate(timestamp: string): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString("ar-EG") + " - " + d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}

export function ActivityLogs() {
  const [propertyLogs, setPropertyLogs] = useState<{ new: ActivityLogItem[]; deleted: ActivityLogItem[] }>({ new: [], deleted: [] });
  const [userLogs, setUserLogs] = useState<UserItem[]>([]);
  const [messageLogs, setMessageLogs] = useState<MessageItem[]>([]);
  const [viewLogs, setViewLogs] = useState<TopPropertyItem[]>([]);
  const [loadingTab, setLoadingTab] = useState<string | null>("properties");

  const fetchPropertyLogs = async () => {
    setLoadingTab("properties");
    try {
      const [newRes, deletedRes] = await Promise.all([
        API.get("/activity-logs/", { params: { action: "create_property", ordering: "-timestamp" } }),
        API.get("/activity-logs/", { params: { action: "delete_property", ordering: "-timestamp" } }),
      ]);
      const newLogs = newRes.data?.results || newRes.data || [];
      const delLogs = deletedRes.data?.results || deletedRes.data || [];
      setPropertyLogs({ new: newLogs.slice(0, 5), deleted: delLogs.slice(0, 5) });
    } catch (error) {
      console.error("Error fetching property logs:", error);
    } finally {
      setLoadingTab(null);
    }
  };

  const fetchUserLogs = async () => {
    setLoadingTab("users");
    try {
      const response = await API.get("/users/list/");
      const data = response.data?.results || response.data || [];
      setUserLogs(data.slice(0, 10));
    } catch (error) {
      console.error("Error fetching user logs:", error);
    } finally {
      setLoadingTab(null);
    }
  };

  const fetchMessageLogs = async () => {
    setLoadingTab("messages");
    try {
      const response = await API.get("/contact-messages/");
      const data = response.data?.results || response.data || [];
      setMessageLogs(data.slice(0, 10));
    } catch (error) {
      console.error("Error fetching message logs:", error);
    } finally {
      setLoadingTab(null);
    }
  };

  const fetchViewLogs = async () => {
    setLoadingTab("views");
    try {
      const response = await API.get("/analytics/top_properties/", { params: { limit: 5 } });
      setViewLogs(response.data || []);
    } catch (error) {
      console.error("Error fetching view logs:", error);
    } finally {
      setLoadingTab(null);
    }
  };

  useEffect(() => {
    fetchPropertyLogs();
  }, []);

  const handleTabChange = (value: string) => {
    switch (value) {
      case "properties":
        if (propertyLogs.new.length === 0 && propertyLogs.deleted.length === 0) fetchPropertyLogs();
        break;
      case "users":
        if (userLogs.length === 0) fetchUserLogs();
        break;
      case "messages":
        if (messageLogs.length === 0) fetchMessageLogs();
        break;
      case "views":
        if (viewLogs.length === 0) fetchViewLogs();
        break;
    }
  };

  const LoadingState = () => (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="card-glow rounded-xl bg-card p-4 lg:p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">🧾 سجل النشاط التفصيلي</h3>
      
      <Tabs defaultValue="properties" className="w-full" onValueChange={handleTabChange}>
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
            <span className="hidden sm:inline">أبرز العقارات</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-4">
          {loadingTab === "properties" ? <LoadingState /> : (
            <>
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> العقارات الجديدة
                </h4>
                <div className="space-y-2">
                  {propertyLogs.new.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">لا توجد سجلات</p>
                  ) : propertyLogs.new.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{item.object_name || item.description}</p>
                        <p className="text-xs text-muted-foreground">بواسطة: {item.user_name}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <Trash2 className="h-4 w-4" /> العقارات المحذوفة
                </h4>
                <div className="space-y-2">
                  {propertyLogs.deleted.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">لا توجد سجلات</p>
                  ) : propertyLogs.deleted.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{item.object_name || item.description}</p>
                        <p className="text-xs text-muted-foreground">بواسطة: {item.user_name}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          {loadingTab === "users" ? <LoadingState /> : (
            <div className="overflow-x-auto">
              {userLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">لا توجد بيانات</p>
              ) : (
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
                    {userLogs.map((u) => {
                      const displayName = u.user?.first_name && u.user?.last_name
                        ? `${u.user.first_name} ${u.user.last_name}`
                        : u.user?.username || "—";
                      const typeLabel = userTypeLabels[u.user_type] || u.user_type;
                      return (
                        <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-3 px-4 font-medium text-sm">{displayName}</td>
                          <td className="py-3 px-4">
                            <span className={cn("text-xs px-2 py-1 rounded-full", userTypeColors[u.user_type] || "bg-gray-100 text-gray-700")}>
                              {typeLabel}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{u.user?.email || "—"}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString("ar-EG") : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Messages Tab */}
        <TabsContent value="messages">
          {loadingTab === "messages" ? <LoadingState /> : (
            <div className="space-y-3">
              {messageLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">لا توجد رسائل</p>
              ) : messageLogs.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-colors",
                  !msg.is_read ? "bg-blue-50 border-blue-200" : "bg-secondary/30 border-border/50"
                )}>
                  <div className="flex items-center gap-3">
                    {!msg.is_read ? (
                      <Mail className="h-5 w-5 text-blue-600" />
                    ) : (
                      <MailOpen className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{msg.name}</p>
                      <p className="text-xs text-muted-foreground">{msg.subject}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      !msg.is_read ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                    )}>
                      {!msg.is_read ? "غير مقروءة" : "مقروءة"}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(msg.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Views Tab */}
        <TabsContent value="views">
          {loadingTab === "views" ? <LoadingState /> : (
            <div className="space-y-3">
              {viewLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">لا توجد بيانات</p>
              ) : viewLogs.map((item, index) => (
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
                      <p className="font-medium text-sm">{item.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{item.area}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">{item.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">ج.م</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
