import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/logo1.png";

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
      title: "text-base",
      subtitle: "text-[10px]",
    },
    md: {
      container: "gap-2.5",
      logo: "h-10 w-8",
      title: "text-lg",
      subtitle: "text-[11px]",
    },
    lg: {
      container: "gap-3",
      logo: "h-12 w-10",
      title: "text-xl",
      subtitle: "text-xs",
    },
  };

  const sizes = sizeClasses[size];

  const LogoContent = () => (
    <div className={`flex items-center ${sizes.container} ${className}`}>
      {/* Logo Icon */}
      <img
        src={logoImg}
        alt="Eskan Egypt"
        className={`${sizes.logo} object-contain`}
      />

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1" dir="ltr">
            <span className={`font-bold ${sizes.title} bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent tracking-tight`}>
              Eskan
            </span>
            <span className={`font-bold ${sizes.title} text-foreground tracking-tight`}>
              Egypt
            </span>
          </div>
          <span className={`${sizes.subtitle} text-muted-foreground font-medium tracking-wide`}>
            إسكان مصر
          </span>
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
