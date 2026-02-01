import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Download, MoreHorizontal, Pencil, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  propertyName: string;
  region: string;
  accountType: string;
  propertyType: string;
  rentPrice: number;
  commission: number;
  profit: number;
  date: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

const regions = ["الكل", "سيدي جابر", "المنشية", "محطة الرمل", "سموحة", "كليوباترا", "العصافرة"];
const propertyTypes = ["الكل", "طلاب", "عائلات", "مصيف", "حجز يومي", "استوديو"];

export function TransactionsTable({ transactions, onDelete, onEdit }: TransactionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("الكل");
  const [typeFilter, setTypeFilter] = useState("الكل");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.propertyName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRegion =
      regionFilter === "الكل" || transaction.region === regionFilter;
    const matchesType =
      typeFilter === "الكل" || transaction.propertyType === typeFilter;
    return matchesSearch && matchesRegion && matchesType;
  });

  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      toast.error("لا توجد بيانات للتصدير");
      return;
    }

    const headers = ["التاريخ", "العقار", "المنطقة", "النوع", "الحساب", "السعر", "ربحك"];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((t) =>
        [
          new Date(t.date).toLocaleDateString("ar-EG"),
          t.propertyName,
          t.region,
          t.propertyType,
          t.accountType,
          t.rentPrice,
          t.profit,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    
    toast.success("تم تصدير البيانات بنجاح");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ar-EG").format(value);
  };

  return (
    <div className="card-glow rounded-2xl bg-card p-5 lg:p-6 border border-border shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-foreground flex items-center gap-2">
            <span>📋</span>
            سجل الصفقات
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredTransactions.length} صفقة
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 w-full sm:w-48"
            />
          </div>

          {/* Region Filter */}
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <Filter className="h-4 w-4 ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Export Button */}
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            تصدير Excel
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">العقار</TableHead>
              <TableHead className="text-right">المنطقة</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">الحساب</TableHead>
              <TableHead className="text-right">السعر</TableHead>
              <TableHead className="text-right">ربحك</TableHead>
              <TableHead className="text-right w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  لا توجد صفقات مسجلة
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="group">
                  <TableCell className="text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString("ar-EG")}
                  </TableCell>
                  <TableCell className="font-medium">{transaction.propertyName}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                      {transaction.region}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs">
                      {transaction.propertyType}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {transaction.accountType}
                  </TableCell>
                  <TableCell>{formatCurrency(transaction.rentPrice)} ج.م</TableCell>
                  <TableCell className="font-bold text-green-600">
                    {formatCurrency(transaction.profit)} ج.م
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem onClick={() => onEdit(transaction)}>
                          <Pencil className="h-4 w-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(transaction.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
