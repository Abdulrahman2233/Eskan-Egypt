import { useEffect, useState } from "react";
import { Bell, Building2, MessageSquare, UserPlus, Eye, CheckCircle, XCircle, Trash2, MoreVertical } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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
  notification_type: "property" | "message" | "user" | "view" | "approval" | "rejection";
  title: string;
  description: string;
  time: string;
  is_read: boolean;
  created_at: string;
}

const iconMap = {
  property: Building2,
  message: MessageSquare,
  user: UserPlus,
  view: Eye,
  approval: CheckCircle,
  rejection: XCircle,
};

const colorMap = {
  property: "bg-blue-100 text-blue-600",
  message: "bg-purple-100 text-purple-600",
  user: "bg-green-100 text-green-600",
  view: "bg-amber-100 text-amber-600",
  approval: "bg-emerald-100 text-emerald-600",
  rejection: "bg-red-100 text-red-600",
};

const typeLabels = {
  property: "عقار جديد",
  message: "رسالة",
  user: "مستخدم جديد",
  view: "مشاهدات",
  approval: "موافقة",
  rejection: "رفض",
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
      loadNotifications();
      // تحديث جميع الإشعارات كمقروءة تلقائياً عند فتح البوبوفر
      if (unreadCount > 0) {
        handleMarkAllAsRead();
      }
    }
  }, [isOpen]);

  // تحميل العدد الأولي للإشعارات غير المقروءة
  useEffect(() => {
    loadUnreadCount();
    // تحديث العداد كل 30 ثانية
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await fetchNotifications(1, 20);
      setNotifications(data.results || []);
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
      setUnreadCount(0);
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
        <button className="relative p-2 rounded-lg hover:bg-accent/50 transition-all duration-200">
          <Bell className="h-5 w-5 text-foreground/70 hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold shadow-lg"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full sm:w-96 p-0 shadow-2xl border-0 max-h-[90vh] sm:max-h-full" align="end">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 border-b border-border sticky top-0 z-10">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Bell className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <h4 className="font-bold text-foreground text-base sm:text-lg truncate">الإشعارات</h4>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs sm:text-sm text-blue-600 font-semibold hover:bg-blue-100 px-2 sm:px-3 py-1 rounded-md transition-colors whitespace-nowrap"
              >
                تحديد
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-96 sm:h-96">
          <AnimatePresence>
            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 sm:p-6 text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">جاري التحميل...</p>
              </motion.div>
            ) : notifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 sm:p-8 text-center"
              >
                <Bell className="h-10 sm:h-12 w-10 sm:w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">لا توجد إشعارات</p>
              </motion.div>
            ) : (
              <div className="divide-y divide-border/50">
                {notifications.map((notification, index) => {
                  const Icon = iconMap[notification.notification_type];
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "p-3 sm:p-4 transition-all duration-200 hover:bg-accent/40 group",
                        !notification.is_read && "bg-blue-50/50"
                      )}
                    >
                      <div className="flex gap-2 sm:gap-3">
                        <div
                          className={cn(
                            "p-2 sm:p-2.5 rounded-lg flex-shrink-0 flex items-center justify-center min-w-fit",
                            colorMap[notification.notification_type]
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1">{notification.title}</p>
                                {!notification.is_read && (
                                  <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                                )}
                              </div>
                              <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-1 font-medium truncate">
                                {typeLabels[notification.notification_type]}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-foreground/70 mt-2 line-clamp-2 sm:line-clamp-3">
                            {notification.description}
                          </p>
                          
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-1 opacity-0 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 flex-col">
                          {!notification.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1.5 hover:bg-green-100 text-green-600 rounded transition-colors"
                              title="تحديد كمقروء"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>

        {/* Footer */}
        <div className="bg-gray-50/50 p-2 sm:p-3 border-t border-border sticky bottom-0">
          <button 
            onClick={() => {
              setIsOpen(false);
              navigate("/admin/notifications");
            }}
            className="w-full text-center text-xs sm:text-sm text-blue-600 font-semibold hover:bg-blue-50 py-2 rounded-md transition-colors"
          >
            عرض الكل
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
