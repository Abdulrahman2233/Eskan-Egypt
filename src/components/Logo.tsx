import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/logo1.webp";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  linkTo?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = "md", 
  showText = true, 
  linkTo = "/",
  className = ""
}) => {
  const sizeClasses = {
    sm: {
      container: "gap-2",
      logo: "h-8 w-6",
      title: "text-[15px]",
      subtitle: "text-[10px]",
    },
    md: {
      container: "gap-2.5",
      logo: "h-10 w-8",
      title: "text-[17px]",
      subtitle: "text-[11px]",
    },
    lg: {
      container: "gap-3",
      logo: "h-12 w-10",
      title: "text-[19px]",
      subtitle: "text-xs",
    },
  };

  const sizes = sizeClasses[size];

  const LogoContent = () => (
    <div className={`flex items-center ${sizes.container} ${className}`}>
      {/* Logo Icon */}
      <img
        src={logoImg}
        alt="إقامتك EQAMTAK"
        className={`${sizes.logo} object-contain`}
      />

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          {/* Desktop / md+: inline: English | Arabic */}
          <div className="hidden sm:flex items-center gap-1" dir="auto">
            <span dir="ltr" className={`font-bold ${sizes.title} bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent tracking-tight`}>
              EQAMTAK
            </span>
            <span className={`font-bold ${sizes.title} text-foreground tracking-tight`}>|</span>
            <span dir="rtl" className={`font-bold ${sizes.title} text-foreground tracking-tight`}>إقامتك</span>
          </div>

          {/* Mobile: Arabic next to '|' above, English below */}
          <div className="flex flex-col sm:hidden items-stretch gap-0" dir="auto">
            <div className="flex items-center justify-end gap-1">
              <span className={`font-bold text-[14px] text-foreground tracking-tight`}></span>
              <span dir="rtl" className={`font-bold text-[14px] text-foreground tracking-tight text-right`}>
                إقامتك
              </span>
            </div>
            <div className="flex items-center justify-start">
              <span dir="ltr" className={`font-bold text-[14px] bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent tracking-tight`}>
                EQAMTAK
              </span>
            </div>
          </div>
          {/* <span className={`${sizes.subtitle} text-muted-foreground font-medium tracking-wide`}>
            إقامتك 
          </span> */}
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className="hover:opacity-90 transition-all duration-200 hover:scale-[1.02]"
      >
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
};

export default React.memo(Logo);
