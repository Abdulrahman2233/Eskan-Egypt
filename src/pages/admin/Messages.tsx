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
  Send,
  Paperclip,
  ArrowLeft
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
  const [replyText, setReplyText] = useState("");
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
      <div className="flex gap-6 h-[calc(100vh-180px)]">
        {/* Messages List */}
        <div className={cn(
          "flex flex-col rounded-2xl bg-card border border-border shadow-lg overflow-hidden transition-all duration-300",
          selectedMessage ? "w-2/5 hidden lg:flex" : "flex-1"
        )}>
          {/* Header */}
          <div className="p-4 border-b border-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">صندوق الوارد</h2>
                {unreadCount > 0 && (
                  <Badge variant="default" className="rounded-full">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    تصفية
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
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث في الرسائل..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4">جاري تحميل الرسائل...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Mail className="h-12 w-12 mb-3 opacity-50 text-destructive" />
                <p>{error}</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Mail className="h-12 w-12 mb-3 opacity-50" />
                <p>لا توجد رسائل</p>
              </div>
            ) : (
              filteredMessages.map((message) => {
                const isRead = message.isRead !== undefined ? message.isRead : message.is_read;
                const sender = message.sender || message.name || "بدون اسم";
                const preview = message.preview || (message.message as string)?.substring(0, 100) || "";
                
                return (
                  <div
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      markAsRead(message.id);
                    }}
                    className={cn(
                      "p-4 border-b border-border cursor-pointer transition-all duration-200 hover:bg-muted/50",
                      !isRead && "bg-primary/5 border-r-4 border-r-primary",
                      selectedMessage?.id === message.id && "bg-muted"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={cn(
                            "text-sm truncate",
                            !isRead && "font-bold"
                          )}>
                            {sender}
                          </h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-muted-foreground">{message.time}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStar(message.id);
                              }}
                              className="hover:scale-110 transition-transform"
                            >
                              {message.isStarred ? (
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <StarOff className="h-4 w-4 text-muted-foreground hover:text-yellow-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        <p className={cn(
                          "text-sm truncate",
                          !isRead ? "font-semibold text-foreground" : "text-muted-foreground"
                        )}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {preview}
                        </p>
                        {message.property && (
                          <div className="flex items-center gap-1 mt-2">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{message.property}</span>
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
          <div className="flex-1 flex flex-col rounded-2xl bg-card border border-border shadow-lg overflow-hidden">
            {/* Detail Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSelectedMessage(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">{selectedMessage.sender || selectedMessage.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleStar(selectedMessage.id)}
                >
                  {selectedMessage.isStarred ? (
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <StarOff className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
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
            
            {/* Message Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{selectedMessage.date || new Date(selectedMessage.created_at as string).toLocaleDateString("ar-SA")} - {selectedMessage.time}</span>
                  </div>
                </div>
                
                {selectedMessage.property && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                    <Building2 className="h-4 w-4" />
                    <span>{selectedMessage.property}</span>
                  </div>
                )}
                
                <div className="mt-6 p-4 rounded-xl bg-muted/30 whitespace-pre-wrap text-foreground leading-relaxed">
                  {selectedMessage.content || selectedMessage.message}
                </div>
              </div>
            </div>
            
            {/* Reply Section */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-3">
                <Textarea
                  placeholder="اكتب ردك هنا..."
                  className="min-h-[80px] resize-none"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4 ml-2" />
                  إرفاق ملف
                </Button>
                <Button className="gap-2">
                  <Send className="h-4 w-4" />
                  إرسال الرد
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center rounded-2xl bg-card border border-border shadow-lg">
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
