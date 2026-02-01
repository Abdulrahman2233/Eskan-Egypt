import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { fetchRegions, fetchPropertyTypes, fetchAccountTypes } from "@/api";

interface TransactionData {
  property_name: string;
  region: string;
  account_type: string;
  property_type: string;
  rent_price: number;
  commission: number;
  profit: number;
}

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (transaction: TransactionData) => void;
  isSaving?: boolean;
}

export function TransactionModal({ open, onOpenChange, onSubmit, isSaving = false }: TransactionModalProps) {
  const [formData, setFormData] = useState({
    property_name: "",
    region: "",
    account_type: "",
    property_type: "",
    rent_price: "",
    profit: "",
  });

  const [regions, setRegions] = useState<string[]>([]);
  const [accountTypes, setAccountTypes] = useState<Array<{ key: string; label: string }>>([]);
  const [propertyTypes, setPropertyTypes] = useState<Array<{ key: string; label: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // جلب البيانات المرجعية عند فتح النموذج
  useEffect(() => {
    if (open) {
      loadFormOptions();
    }
  }, [open]);

  const loadFormOptions = async () => {
    setIsLoading(true);
    try {
      const [regionsData, accountTypesData, propertyTypesData] = await Promise.all([
        fetchRegions(),
        fetchAccountTypes(),
        fetchPropertyTypes(),
      ]);

      setRegions(regionsData);
      setAccountTypes(accountTypesData);
      setPropertyTypes(propertyTypesData);
    } catch (error) {
      console.error("Error loading form options:", error);
      toast.error("خطأ في تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const getProfit = () => {
    return parseFloat(formData.profit) || 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.property_name || !formData.region || !formData.account_type || 
        !formData.property_type || !formData.rent_price || !formData.profit) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    const transaction: TransactionData = {
      property_name: formData.property_name,
      region: formData.region,
      account_type: formData.account_type,
      property_type: formData.property_type,
      rent_price: parseFloat(formData.rent_price),
      commission: 0,
      profit: getProfit(),
    };

    onSubmit(transaction);
    
    // Reset form
    setFormData({
      property_name: "",
      region: "",
      account_type: "",
      property_type: "",
      rent_price: "",
      profit: "",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span>🧾</span>
            إتمام صفقة جديدة
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="property_name">اسم العقار</Label>
            <Input
              id="property_name"
              placeholder="أدخل اسم العقار"
              value={formData.property_name}
              onChange={(e) => setFormData({ ...formData, property_name: e.target.value })}
              disabled={isLoading || isSaving}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>المنطقة</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData({ ...formData, region: value })}
              >
                <SelectTrigger disabled={isLoading || isSaving || regions.length === 0}>
                  <SelectValue placeholder={isLoading ? "جاري التحميل..." : "اختر المنطقة"} />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>نوع الحساب</Label>
              <Select
                value={formData.account_type}
                onValueChange={(value) => setFormData({ ...formData, account_type: value })}
              >
                <SelectTrigger disabled={isLoading || isSaving || accountTypes.length === 0}>
                  <SelectValue placeholder={isLoading ? "جاري التحميل..." : "اختر النوع"} />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type.key} value={type.key}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>نوع العقار</Label>
            <Select
              value={formData.property_type}
              onValueChange={(value) => setFormData({ ...formData, property_type: value })}
            >
              <SelectTrigger disabled={isLoading || isSaving || propertyTypes.length === 0}>
                <SelectValue placeholder={isLoading ? "جاري التحميل..." : "اختر نوع العقار"} />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.key} value={type.key}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rent_price">سعر الإيجار (ج.م)</Label>
              <Input
                id="rent_price"
                type="number"
                placeholder="0"
                value={formData.rent_price}
                onChange={(e) => setFormData({ ...formData, rent_price: e.target.value })}
                disabled={isLoading || isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profit">أرباحك (ج.م)</Label>
              <Input
                id="profit"
                type="number"
                placeholder="0"
                value={formData.profit}
                onChange={(e) => setFormData({ ...formData, profit: e.target.value })}
                disabled={isLoading || isSaving}
              />
            </div>
          </div>

          {/* Profit Preview */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">ربحك النهائي:</span>
              <span className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat("ar-EG").format(getProfit())} ج.م
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading || isSaving}>
              إلغاء
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading || isSaving}>
              {isSaving ? "جاري الحفظ..." : "تأكيد الصفقة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

