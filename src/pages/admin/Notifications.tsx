import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Building2,
  MessageSquare,
  UserPlus,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Filter,
  Loader2,
  AlertCircle,
  Search,
  Download,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/AdminLayout";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/api";

interface Notification {
  id: string;
  notification_type: "property" | "message" | "user" | "view" | "rejection";
  title: string;
  description: string;
  time: string;
  is_read: boolean;
  created_at: string;
  notification_type_display: string;
}

const iconMap = {
  property: Building2,
  message: MessageSquare,
  user: UserPlus,
  view: Eye,
  rejection: XCircle,
};

const colorMap = {
  property: "bg-blue-500",
  message: "bg-purple-500",
  user: "bg-green-500",
  view: "bg-amber-500",
  rejection: "bg-red-500",
};

const badgeColorMap = {
  property: "bg-blue-100 text-blue-800",
  message: "bg-purple-100 text-purple-800",
  user: "bg-green-100 text-green-800",
  view: "bg-amber-100 text-amber-800",
  rejection: "bg-red-100 text-red-800",
};

type FilterType = "all" | "unread" | "property" | "rejection" | "message" | "user" | "view";

const AdminNotifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [page, filter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const filters: Record<string, unknown> = {};
      
      if (filter === "unread") {
        filters.is_read = false;
      } else if (filter !== "all") {
        // ربط الفلاتر بـ notification_type
        filters.notification_type = filter;
      }

      const data = await fetchNotifications(page, pageSize, filters);
      setNotifications(data.results || []);
      setTotal(data.count || 0);
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل الإشعارات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
    toast({
      title: "تم",
      description: "تم تحديث الإشعارات",
    });
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(
        notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
      toast({
        title: "خطأ",
        description: "فشل تحديث الإشعار",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      toast({
        title: "تم",
        description: "تم تحديد جميع الإشعارات كمقروءة",
      });
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast({
        title: "خطأ",
        description: "فشل التحديث",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
      setTotal(total - 1);
      toast({
        title: "تم",
        description: "تم حذف الإشعار",
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "خطأ",
        description: "فشل حذف الإشعار",
        variant: "destructive",
      });
    }
  };

  // Filter notifications by search query
  const filteredNotifications = notifications.filter((n) =>
    searchQuery === "" ||
    n.title.includes(searchQuery) ||
    n.description.includes(searchQuery)
  );

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const totalPages = Math.ceil(total / pageSize);

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "الكل" },
    { value: "unread", label: "غير مقروء" },
    { value: "rejection", label: "الرفضات" },
    { value: "property", label: "العقارات الجديدة" },
    { value: "message", label: "الرسائل" },
  ];

  return (
    <AdminLayout title="الإشعارات">
      <div className="space-y-4 md:space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">إجمالي الإشعارات</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">غير مقروء</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">مقروء</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{total - unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن إشعار..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleMarkAllAsRead}
                >
                  تحديد الكل
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFilter(f.value);
                  setPage(1);
                }}
                className="whitespace-nowrap text-xs md:text-sm"
              >
                <Filter className="h-3 w-3 ml-1" />
                {f.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex justify-center items-center py-12 md:py-16">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-muted-foreground">جاري تحميل الإشعارات...</p>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 md:py-16 text-center">
              <Bell className="h-12 md:h-16 w-12 md:w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-base md:text-lg font-medium text-foreground mb-2">
                لا توجد إشعارات
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "لم نجد إشعارات تطابق بحثك" : "لم تصل إليك أي إشعارات حتى الآن"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredNotifications.map((notification, index) => {
                const Icon = iconMap[notification.notification_type] || Bell;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -200 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`transition-all hover:shadow-md cursor-pointer ${
                        !notification.is_read ? "border-blue-300 bg-blue-50/30" : ""
                      }`}
                    >
                      <CardContent className="p-3 md:p-4">
                        <div className="flex gap-3 md:gap-4">
                          {/* Icon */}
                          <div
                            className={`h-10 w-10 md:h-12 md:w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[notification.notification_type] || "bg-gray-500"}`}
                          >
                            <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-sm md:text-base text-foreground line-clamp-1">
                                    {notification.title}
                                  </h3>
                                  {!notification.is_read && (
                                    <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {notification.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span
                                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColorMap[notification.notification_type] || "bg-gray-100 text-gray-800"}`}
                                  >
                                    {notification.notification_type_display}
                                  </span>
                                  <span className="text-xs text-muted-foreground px-2 py-0.5 bg-gray-100 rounded-full">
                                    {notification.time}
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2 flex-shrink-0">
                                {!notification.is_read && (
                                  <button
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="p-2 hover:bg-green-100 rounded transition-colors text-green-600"
                                    title="تحديد كمقروء"
                                  >
                                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(notification.id)}
                                  className="p-2 hover:bg-red-100 rounded transition-colors text-red-600"
                                  title="حذف"
                                >
                                  <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center gap-2 mt-6"
          >
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="text-xs md:text-sm"
            >
              السابق
            </Button>
            <div className="flex gap-1 overflow-x-auto max-w-xs md:max-w-none">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                  className="h-8 w-8 p-0 text-xs"
                >
                  {p}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="text-xs md:text-sm"
            >
              التالي
            </Button>
          </motion.div>
        )}

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 rounded-lg p-4 text-center text-xs md:text-sm text-muted-foreground"
        >
          عرض {filteredNotifications.length} من {total} إشعار | الصفحة {page} من {totalPages}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
