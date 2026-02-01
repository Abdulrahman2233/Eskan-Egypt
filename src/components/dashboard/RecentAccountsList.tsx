import { User, Mail, Phone, Calendar, Shield, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchRecentAccounts } from "@/api";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Account {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  accountType: "owner" | "agent" | "office" | "admin" | "landlord" | "tenant";
  registrationDate: string;
  avatar: string;
}

const accountTypeLabels = {
  owner: { label: "مالك", class: "bg-blue-100 text-blue-700" },
  landlord: { label: "مالك", class: "bg-blue-100 text-blue-700" },
  agent: { label: "وسيط", class: "bg-purple-100 text-purple-700" },
  office: { label: "مكتب", class: "bg-cyan-100 text-cyan-700" },
  admin: { label: "مشرف", class: "bg-red-100 text-red-700" },
  tenant: { label: "مستأجر", class: "bg-green-100 text-green-700" },
};

export function RecentAccountsList() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(10);
useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoading(true);
        const data = await fetchRecentAccounts(1000);
        setAccounts(data.accounts || []);
      } catch (err) {
        console.error("Failed to load accounts:", err);
        setError("فشل تحميل الحسابات");
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredAccounts = accounts.filter((account) => {
    const matchesType = typeFilter === "all" || account.accountType === typeFilter;
    if (!normalizedQuery) return matchesType;
    const searchable = [
      account.name,
      account.email,
      account.username,
      account.phone,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return matchesType && searchable.includes(normalizedQuery);
  });

  const visibleAccounts = filteredAccounts.slice(0, visibleCount);
  const canShowMore = visibleCount < filteredAccounts.length;

  return (
    <div className="card-glow rounded-xl bg-card p-4 lg:p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base lg:text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          آخر الحسابات المضافة
        </h3>
        <span className="text-xs text-muted-foreground">{filteredAccounts.length} حساب</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(10);
            }}
            placeholder="ابحث بالاسم، البريد أو الهاتف"
            className="pr-9"
          />
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setVisibleCount(10);
            }}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="نوع الحساب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأنواع</SelectItem>
              <SelectItem value="landlord">ملاك عقار</SelectItem>
              <SelectItem value="agent">وسطاء</SelectItem>
              <SelectItem value="office">مكاتب</SelectItem>
              <SelectItem value="admin">مشرفين</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            className="shrink-0"
            onClick={() => {
              setQuery("");
              setTypeFilter("all");
              setVisibleCount(10);
            }}
          >
            <Filter className="h-4 w-4 ml-2" />
            إعادة
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">جاري تحميل البيانات...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : filteredAccounts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">لا توجد حسابات مضافة حالياً</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">المستخدم</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">البريد الإلكتروني</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">اسم المستخدم</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground hidden sm:table-cell">الهاتف</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">النوع</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody>
              {visibleAccounts.map((account) => {
                const typeInfo = accountTypeLabels[account.accountType as keyof typeof accountTypeLabels] || { label: account.accountType, class: "bg-gray-100 text-gray-700" };
                return (
                  <tr key={account.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          {account.avatar}
                        </div>
                        <span className="font-medium text-sm">{account.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span dir="ltr">{account.email || "-"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground" dir="ltr">@{account.username}</span>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span dir="ltr">{account.phone || "-"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn("text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1", typeInfo.class)}>
                        {account.accountType === "admin" && <Shield className="h-3 w-3" />}
                        {typeInfo.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span dir="ltr">{account.registrationDate}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && filteredAccounts.length > 0 && (
        <div className="mt-4 flex items-center justify-center">
          {canShowMore ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setVisibleCount((prev) => prev + 10)}
            >
              عرض المزيد
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
