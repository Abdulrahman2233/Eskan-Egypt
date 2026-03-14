import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProfitStatsCards } from "@/components/profits/ProfitStatsCards";
import { ProfitLineChart } from "@/components/profits/ProfitLineChart";
import { TopAccountsChart } from "@/components/profits/TopAccountsChart";
import { PropertyTypeChart } from "@/components/profits/PropertyTypeChart";
import { TransactionModal } from "@/components/profits/TransactionModal";
import { TransactionsTable } from "@/components/profits/TransactionsTable";
import { Button } from "@/components/ui/button";
import { Plus, Loader } from "lucide-react";
import { toast } from "sonner";
import { fetchTransactions, deleteTransaction, createTransaction } from "@/api";

interface Transaction {
  id: string;
  customer_name: string;
  customer_phone: string;
  property_name: string;
  region: string;
  account_type: string;
  account_type_display?: string;
  property_type: string;
  property_type_display?: string;
  rent_price: number;
  commission: number;
  profit: number;
  created_at: string;
}

export default function Profits() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load transactions from backend when component mounts
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("خطأ في تحميل الصفقات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    try {
      setIsSaving(true);
      
      console.log("📤 Sending transaction to API:", transaction);
      
      const newTransaction = await createTransaction({
        customer_name: transaction.customer_name,
        customer_phone: transaction.customer_phone,
        property_name: transaction.property_name,
        region: transaction.region,
        account_type: transaction.account_type,
        property_type: transaction.property_type,
        rent_price: transaction.rent_price,
        commission: transaction.commission,
        profit: transaction.profit,
      });
      
      console.log("📥 Response from API:", newTransaction);
      
      // التحقق من أن الـ response يحتوي على بيانات صحيحة
      if (!newTransaction || !newTransaction.id) {
        console.error("❌ Invalid response from API:", newTransaction);
        toast.error("خطأ: البيانات المُرجعة من الخادم غير صحيحة");
        return;
      }
      
      // Add the new transaction to the list
      setTransactions((prev) => [newTransaction, ...prev]);
      toast.success("تم حفظ الصفقة بنجاح!");
    } catch (error) {
      console.error("❌ Error saving transaction:", error);
      // عرض تفاصيل الخطأ
      if (error instanceof Error) {
        toast.error(`خطأ في حفظ الصفقة: ${error.message}`);
      } else {
        toast.error("خطأ غير متوقع في حفظ الصفقة");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success("تم حذف الصفقة");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("خطأ في حذف الصفقة");
    }
  };

  const handleEditTransaction = (_transaction: Transaction) => {
    toast.info("سيتم إضافة خاصية التعديل قريباً");
  };

  const propertyTypeMap: Record<string, string> = {
    students: "طلاب",
    families: "عائلات",
    studio: "استوديو",
    vacation: "مصيفين",
    vacationers: "مصيفين",
    daily: "حجز يومي",
  };

  const accountTypeMap: Record<string, string> = {
    owner: "مالك",
    agent: "وسيط",
    office: "مكتب عقارات",
    tenant: "مستأجر",
  };

  // Convert API response to component format
  const displayTransactions = transactions.map(t => ({
    id: t.id,
    customerName: t.customer_name,
    customerPhone: t.customer_phone,
    propertyName: t.property_name,
    region: t.region,
    accountType: t.account_type_display || accountTypeMap[t.account_type] || t.account_type,
    propertyType: t.property_type_display || propertyTypeMap[t.property_type] || t.property_type,
    rentPrice: parseFloat(t.rent_price.toString()),
    commission: parseFloat(t.commission.toString()),
    profit: parseFloat(t.profit.toString()),
    date: t.created_at,
  }));

  return (
    <DashboardLayout title="إدارة الأرباح">
      <div className="space-y-6 lg:space-y-8">
        {/* Header with Add Transaction Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              💰 إدارة الأرباح
            </h1>
            <p className="text-muted-foreground mt-1">
              تتبع جميع الصفقات والأرباح في مكان واحد
            </p>
          </div>
          
          <Button
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
            disabled={isLoading || isSaving}
          >
            <span className="flex items-center gap-2">
              {isLoading || isSaving ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              <span>إتمام صفقة</span>
            </span>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-muted-foreground">جاري تحميل الصفقات...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <>
            {/* Stats Cards */}
            <ProfitStatsCards transactions={displayTransactions} />

            {/* Main Line Chart - Full Width */}
            <ProfitLineChart transactions={displayTransactions} />

            {/* Charts Grid - Account Types and Property Types */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopAccountsChart />
              <PropertyTypeChart />
            </div>

            {/* Quick Summary Card */}
            <div className="card-glow rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-5 lg:p-6 border border-primary/20 shadow-lg">
              <h3 className="text-lg lg:text-xl font-bold text-foreground flex items-center gap-2 mb-6">
                <span>📊</span>
                ملخص سريع
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-card/50">
                  <span className="text-muted-foreground">إجمالي الصفقات</span>
                    <span className="text-2xl font-bold text-primary">{displayTransactions.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-card/50">
                    <span className="text-muted-foreground">أعلى صفقة</span>
                    <span className="text-2xl font-bold text-amber-600">
                      {new Intl.NumberFormat("ar-EG").format(
                        Math.max(...displayTransactions.map((t) => t.profit), 0)
                      )} ج.م
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-card/50">
                    <span className="text-muted-foreground">إجمالي الأرباح</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {new Intl.NumberFormat("ar-EG").format(
                        displayTransactions.reduce((sum, t) => sum + t.profit, 0)
                      )} ج.م
                    </span>
                  </div>
                </div>
            </div>

            {/* Transactions Table */}
            <TransactionsTable
              transactions={displayTransactions}
              onDelete={handleDeleteTransaction}
              onEdit={handleEditTransaction}
            />
          </>
        )}

        {/* Transaction Modal */}
        <TransactionModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSubmit={handleAddTransaction}
          isSaving={isSaving}
        />
      </div>
    </DashboardLayout>
  );
}
