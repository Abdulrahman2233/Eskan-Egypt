import {  Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import logo from "../assets/logo1.png";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
 <img src={logo} alt="Eskan Egypt Logo" className="h-11 w-8 object-contain" />              <div className="flex flex-col">
                <span className="font-bold text-lg text-primary">Eskan Egypt</span>
                <span className="text-xs text-muted-foreground">اسكان مصر</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              منصتك الموثوقة للعثور على أفضل العقارات للإيجار في الإسكندرية
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/Eskan.Egypt/" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  العقارات
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  من نحن
                </Link>
              </li>
              {/* <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  تواصل معنا
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Popular Areas */}
          <div>
            <h3 className="font-bold mb-4">مناطق شهيرة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  سيدي بشر
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  سموحة
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  جليم
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  المنتزه
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>الإسكندرية، مصر</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span dir="ltr">+201012419047</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span>ba2907403@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Eskan Egypt. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
