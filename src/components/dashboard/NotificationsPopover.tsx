import { useEffect, useState } from "react";
import { Bell, MessageSquare, UserPlus, Building2, CheckCircle, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  fetchNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/api";

interface Notification {
  id: string;
  notification_type: "message" | "user" | "property";
  title: string;
  description: string;
  time: string;
  is_read: boolean;
  created_at: string;
}

const iconMap = {
  message: MessageSquare,
  user: UserPlus,
  property: Building2,
};

const gradientMap = {
  message: "from-purple-500 to-fuchsia-500",
  user: "from-emerald-500 to-green-500",
  property: "from-sky-500 to-blue-500",
};

export function NotificationsPopover() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // تحميل الإشعارات عند فتح البوبوفر
  useEffect(() => {
    if (isOpen) {
      loadNotificationsAndMarkAsRead();
    }
  }, [isOpen]);

  // تحميل العدد الأولي للإشعارات غير المقروءة
  useEffect(() => {
    // تحديث العداد فوراً عند تحميل الصفحة
    loadUnreadCount();
    // تحديث العداد كل 10 ثوانٍ للحصول على التحديثات الفورية
    const interval = setInterval(loadUnreadCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadNotificationsAndMarkAsRead = async () => {
    try {
      setIsLoading(true);
      const data = await fetchNotifications(1, 20);
      setNotifications(data.results || []);
      // تحديث جميع الإشعارات كمقروءة تلقائياً عند فتح البوبوفر
      await markAllNotificationsAsRead();
      // تحديث الحالة المحلية
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      // تحديث العداد
      setUnreadCount(0);
      await loadUnreadCount();
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadNotificationsCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      // تحديث الإشعارات المحلية
      setNotifications(
        notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
      // تحديث العداد
      loadUnreadCount();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      // تحديث جميع الإشعارات
      setNotifications(
        notifications.map((n) => ({ ...n, is_read: true }))
      );
      // تحديث العداد فوراً
      setUnreadCount(0);
      // تحديث العداد من الخادم أيضاً للتأكد
      loadUnreadCount();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      // إزالة من القائمة
      setNotifications(notifications.filter((n) => n.id !== id));
      // تحديث العداد
      loadUnreadCount();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[320px] sm:w-[380px] p-0 rounded-xl shadow-lg border" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground">الإشعارات</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-primary hover:underline"
            >
              قراءة الكل
            </button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[320px] sm:h-[360px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Bell className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">لا توجد إشعارات</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => {
                const Icon = iconMap[notification.notification_type];
                const gradient = gradientMap[notification.notification_type];
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex gap-3 p-4 border-b last:border-0 transition-colors",
                      !notification.is_read && "bg-primary/5"
                    )}
                  >
                    {/* Icon */}
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br text-white",
                      gradient
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] text-muted-foreground">
                          {notification.time}
                        </span>
                        <div className="flex items-center gap-1">
                          {!notification.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                              title="تحديد كمقروء"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500"
                            title="حذف"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t">
            <button 
              onClick={() => {
                setIsOpen(false);
                navigate("/admin/notifications");
              }}
              className="w-full text-center text-sm text-primary hover:underline py-1"
            >
              عرض جميع الإشعارات
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
