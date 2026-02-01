import { ReactNode } from "react";
import { Sidebar } from "./dashboard/Sidebar";
import { Header } from "./dashboard/Header";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-white" dir="rtl">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header title={title || "الإشعارات"} />
        
        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
