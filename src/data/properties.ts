export interface Property {
  id: string;
  name: string;
  nameEn: string;
  area?: string;
  address: string;
  price: number;
  rooms: number;
  bathrooms: number;
  size: number;
  floor: number;
  furnished: boolean;
  type: string;
  typeEn: string;
  images: { image_url: string }[];
  description: string;
  descriptionEn: string;
  contact: string;
  featured?: boolean;
}

export const alexandriaAreas = [
  "المنتزه", "ميامي", "سيدي بشر", "العصافرة", "خالد ابن الوليد", "المندرة", 
  "طوسون", "أبو قير", "رأس التين", "شرق الإسكندرية", "سموحة", "رشدي", 
  "كليوباترا", "جليم", "زيزينيا", "سان ستيفانو", "جناكليس", "الإبراهيمية", 
  "وسط الإسكندرية", "محطة الرمل", "الأزاريطة", "كامب شيزار", "الشاطبي", 
  "لوران", "غرب الإسكندرية", "العجمي", "الهانوفيل", "البيطاش", "الكيلو 21", 
  "الكيلو 26", "الكيلو 34", "برج العرب", "برج العرب الجديدة", "المنطقة الصناعية", 
  "الحي الرابع", "الحي الثالث", "العامرية", "العامرية 1", "العامرية 2", 
  "النهضة", "عبد القادر"
];

// ❌ REMOVED: All mock data - now using real data from Django API
