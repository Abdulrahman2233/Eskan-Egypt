import { User } from "lucide-react";
import { NotificationsPopover } from "./NotificationsPopover";
import { useEffect, useState } from "react";

export function Header({ title }: { title: string }) {
  const [userName, setUserName] = useState("حسابي");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed?.full_name || parsed?.name || parsed?.username || "حسابي");
      } catch {
        setUserName("حسابي");
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-lg px-4 lg:px-6">
      <div className="flex items-center gap-4 mr-14 lg:mr-0">
        <h1 className="text-lg lg:text-xl font-bold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Notifications */}
        <NotificationsPopover />
        
        {/* Profile */}
        <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-secondary transition-colors">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">
              {userName?.charAt(0) || "ح"}
            </span>
          </div>
          <div className="hidden lg:block text-right">
            <p className="text-sm font-medium">{userName}</p>
          </div>
        </button>
      </div>
    </header>
  );
}