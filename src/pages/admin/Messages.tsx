import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  Search, 
  Filter, 
  Star, 
  StarOff, 
  Trash2, 
  MailOpen, 
  Mail, 
  Clock, 
  User,
  Building2,
  MoreVertical,
  ArrowLeft,
  Phone,
  Mail as MailIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchContactMessages,
  markMessageAsRead,
  deleteContactMessage,
  updateContactMessage,
} from "@/api";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  sender?: string;
  name?: string;
  email: string;
  phone?: string;
  subject: string;
  preview?: string;
  content?: string;
  message?: string;
  time?: string;
  date?: string;
  isRead?: boolean;
  is_read?: boolean;
  isStarred?: boolean;
  property?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
  is_archived?: boolean;
}

export default function Messages() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // جلب الرسائل من API
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchContactMessages();
      // تحويل البيانات من API إلى صيغة المكون
      const formattedMessages = Array.isArray(data)
        ? data.map((msg: Record<string, unknown>) => ({
            id: msg.id as number,
            sender: msg.name as string,
            name: msg.name as string,
            email: msg.email as string,
            phone: msg.phone as string,
            subject: msg.subject as string,
            preview: (msg.message as string)?.substring(0, 100) || "",
            content: msg.message as string,
            message: msg.message as string,
            time: new Date(msg.created_at as string).toLocaleString("ar-SA"),
            date: new Date(msg.created_at as string).toLocaleDateString("ar-SA"),
            isRead: msg.is_read as boolean,
            is_read: msg.is_read as boolean,
            isStarred: false,
            created_at: msg.created_at as string,
            updated_at: msg.updated_at as string,
            is_archived: msg.is_archived as boolean,
          }))
        : [];
      setMessageList(formattedMessages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "حدث خطأ في جلب الرسائل";
      setError(errorMessage);
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messageList.filter((msg) => {
    const isRead = msg.isRead !== undefined ? msg.isRead : msg.is_read;
    const isStarred = msg.isStarred || false;
    const sender = msg.sender || msg.name || "";
    
    const matchesFilter = 
      filter === "all" ? true :
      filter === "unread" ? !isRead :
      filter === "starred" ? isStarred : true;
    
    const matchesSearch = 
      sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.preview || msg.message || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const toggleStar = async (id: number) => {
    try {
      const message = messageList.find(m => m.id === id);
      if (!message) return;
      
      const newStarredState = !message.isStarred;
      await updateContactMessage(id, {
        is_starred: newStarredState,
      });
      
      setMessageList(prev => 
        prev.map(msg => msg.id === id ? { ...msg, isStarred: newStarredState } : msg)
      );
      
      toast({
        title: "تم بنجاح",
        description: newStarredState ? "تم إضافة النجمة" : "تم إزالة النجمة",
      });
    } catch (err) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث الرسالة",
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const message = messageList.find(m => m.id === id);
      if (!message || message.isRead || message.is_read) return;
      
      await markMessageAsRead(id);
      
      setMessageList(prev => 
        prev.map(msg => msg.id === id ? { ...msg, isRead: true, is_read: true } : msg)
      );
    } catch (err) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث الرسالة",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      await deleteContactMessage(id);
      
      setMessageList(prev => prev.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      
      toast({
        title: "تم بنجاح",
        description: "تم حذف الرسالة",
      });
    } catch (err) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف الرسالة",
        variant: "destructive",
      });
    }
  };

  const unreadCount = messageList.filter(m => {
    const isRead = m.isRead !== undefined ? m.isRead : m.is_read;
    return !isRead;
  }).length;

  return (
    <DashboardLayout title="الرسائل">
      <div className="flex gap-3 sm:gap-6 h-auto sm:h-[calc(100vh-180px)] flex-col sm:flex-row">
        {/* Messages List */}
        <div className={cn(
          "flex flex-col rounded-lg sm:rounded-2xl bg-card border border-border shadow-lg overflow-hidden transition-all duration-300 w-full sm:flex-1",
          selectedMessage ? "hidden sm:flex" : "flex"
        )}>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border p-3 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-foreground truncate">صندوق الوارد</h2>
                  {unreadCount > 0 && (
                    <p className="text-xs text-muted-foreground">{unreadCount} جديدة</p>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm flex-shrink-0">
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">تصفية</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card">
                  <DropdownMenuItem onClick={() => setFilter("all")}>
                    جميع الرسائل
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("unread")}>
                    غير مقروءة
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("starred")}>
                    المميزة بنجمة
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="relative">
              <Search className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="بحث..."
                className="pr-8 sm:pr-10 bg-background/50 border-border text-xs sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[300px] sm:min-h-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                <p className="mt-3 text-sm">جاري التحميل...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                <Mail className="h-10 w-10 mb-2 opacity-50 text-destructive" />
                <p className="text-sm text-center px-4">{error}</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                <Mail className="h-10 w-10 mb-2 opacity-50" />
                <p className="text-sm">لا توجد رسائل</p>
              </div>
            ) : (
              filteredMessages.map((message) => {
                const isRead = message.isRead !== undefined ? message.isRead : message.is_read;
                const sender = message.sender || message.name || "بدون اسم";
                const preview = message.preview || (message.message as string)?.substring(0, 60) || "";
                
                return (
                  <div
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      markAsRead(message.id);
                    }}
                    className={cn(
                      "px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border cursor-pointer transition-all duration-200 hover:bg-muted/50 hover:border-r-4 hover:border-r-primary",
                      !isRead && "bg-primary/8 border-r-4 border-r-primary",
                      selectedMessage?.id === message.id && "bg-primary/10 border-r-4 border-r-primary"
                    )}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className={cn(
                        "h-10 w-10 sm:h-11 sm:w-11 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold text-white text-sm",
                        !isRead ? "bg-gradient-to-br from-primary to-primary/60" : "bg-muted text-muted-foreground"
                      )}>
                        {(sender || "?").charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className={cn(
                            "text-xs sm:text-sm truncate",
                            !isRead ? "font-bold text-foreground" : "font-medium text-foreground"
                          )}>
                            {sender}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(message.id);
                            }}
                            className="hover:scale-110 transition-transform flex-shrink-0"
                          >
                            {message.isStarred ? (
                              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <StarOff className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground hover:text-yellow-400" />
                            )}
                          </button>
                        </div>
                        <p className={cn(
                          "text-xs sm:text-sm truncate",
                          !isRead ? "font-semibold text-foreground" : "text-muted-foreground"
                        )}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {preview}
                        </p>
                        {message.property && (
                          <div className="flex items-center gap-0.5 mt-1">
                            <Building2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
                            <span className="text-xs text-primary font-medium truncate">{message.property}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        {/* Message Detail */}
        {selectedMessage ? (
          <div className="flex-1 flex flex-col rounded-lg sm:rounded-2xl bg-card border border-border shadow-lg overflow-hidden w-full">
            {/* Detail Header */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border p-3 sm:p-6">
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="sm:hidden mt-1 flex-shrink-0"
                    onClick={() => setSelectedMessage(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-xl font-bold text-foreground truncate">{selectedMessage.sender || selectedMessage.name}</h3>
                    <div className="space-y-1 mt-1 sm:mt-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground min-w-0">
                        <MailIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                        <span className="truncate">{selectedMessage.email}</span>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                          <span dir="ltr" className="font-medium">{selectedMessage.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleStar(selectedMessage.id)}
                    className="hover:bg-primary/20 h-9 w-9 sm:h-10 sm:w-10"
                  >
                    {selectedMessage.isStarred ? (
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                        <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card">
                      <DropdownMenuItem>تحديد كغير مقروءة</DropdownMenuItem>
                      <DropdownMenuItem>نقل إلى الأرشيف</DropdownMenuItem>
                      <DropdownMenuItem>الإبلاغ عن بريد مزعج</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            {/* Message Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-8 custom-scrollbar">
              <div className="space-y-4 sm:space-y-6 max-w-4xl">
                {/* Subject and Metadata */}
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      <span>{selectedMessage.date || new Date(selectedMessage.created_at as string).toLocaleDateString("ar-SA")}</span>
                    </div>
                    <span className="text-muted-foreground/50">•</span>
                    <span>{selectedMessage.time}</span>
                  </div>
                </div>

                {/* Property Badge */}
                {selectedMessage.property && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-primary/10 text-primary text-xs sm:text-sm font-medium border border-primary/20">
                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{selectedMessage.property}</span>
                  </div>
                )}
                
                {/* Message Body */}
                <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium mb-3 sm:mb-4">محتوى الرسالة</p>
                  <div className="bg-muted/40 border border-border rounded-lg p-3 sm:p-6 whitespace-pre-wrap text-foreground leading-relaxed text-xs sm:text-sm">
                    {selectedMessage.content || selectedMessage.message}
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="hidden sm:flex flex-1 items-center justify-center rounded-2xl bg-card border border-border shadow-lg">
            <div className="text-center text-muted-foreground">
              <MailOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">اختر رسالة لعرضها</p>
              <p className="text-sm">انقر على أي رسالة من القائمة</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
