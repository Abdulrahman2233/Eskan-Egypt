import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder: string;
  onSubmit?: () => void;
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  theme?: "light" | "dark";
  dropdownTheme?: "light" | "dark";
  showClearButton?: boolean;
  maxSuggestions?: number;
  submitOnSelect?: boolean;
  minQueryLength?: number;
}

export const SearchAutocompleteInput: React.FC<SearchAutocompleteInputProps> = ({
  value,
  onChange,
  suggestions,
  placeholder,
  onSubmit,
  className,
  inputClassName,
  dropdownClassName,
  theme = "light",
  dropdownTheme,
  showClearButton = true,
  maxSuggestions = 8,
  submitOnSelect = false,
  minQueryLength = 1,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const suggestionTheme = dropdownTheme || theme;

  const normalizedValue = value.trim().toLowerCase();

  const filteredSuggestions = React.useMemo(() => {
    const uniqueSuggestions = Array.from(
      new Set(
        suggestions
          .map((item) => item.trim())
          .filter(Boolean)
      )
    );

    if (normalizedValue.length < minQueryLength) {
      return [];
    }

    if (!normalizedValue) {
      return uniqueSuggestions.slice(0, maxSuggestions);
    }

    const startsWith: string[] = [];
    const includes: string[] = [];

    uniqueSuggestions.forEach((item) => {
      const normalizedItem = item.toLowerCase();
      if (normalizedItem.startsWith(normalizedValue)) {
        startsWith.push(item);
      } else if (normalizedItem.includes(normalizedValue)) {
        includes.push(item);
      }
    });

    return [...startsWith, ...includes].slice(0, maxSuggestions);
  }, [suggestions, normalizedValue, maxSuggestions, minQueryLength]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!containerRef.current?.contains(target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    setActiveIndex(-1);
  }, [value]);

  const highlightMatch = React.useCallback(
    (text: string) => {
      if (!normalizedValue) return text;

      const lowerText = text.toLowerCase();
      const matchIndex = lowerText.indexOf(normalizedValue);

      if (matchIndex === -1) return text;

      const before = text.slice(0, matchIndex);
      const match = text.slice(matchIndex, matchIndex + normalizedValue.length);
      const after = text.slice(matchIndex + normalizedValue.length);

      return (
        <>
          {before}
          <span
            className={cn(
              "font-bold",
              suggestionTheme === "dark" ? "text-amber-200" : "text-primary"
            )}
          >
            {match}
          </span>
          {after}
        </>
      );
    },
    [normalizedValue, suggestionTheme]
  );

  const handleSelect = React.useCallback(
    (item: string) => {
      onChange(item);
      setIsOpen(false);
      setActiveIndex(-1);

      if (submitOnSelect) {
        onSubmit?.();
      }
    },
    [onChange, submitOnSelect, onSubmit]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && filteredSuggestions.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
      return;
    }

    if (event.key === "ArrowUp" && filteredSuggestions.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
      return;
    }

    if (event.key === "Enter") {
      if (isOpen && activeIndex >= 0 && filteredSuggestions[activeIndex]) {
        event.preventDefault();
        handleSelect(filteredSuggestions[activeIndex]);
        return;
      }

      if (onSubmit) {
        event.preventDefault();
        onSubmit();
      }
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Search
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2",
          theme === "dark" ? "text-slate-300" : "text-slate-400"
        )}
      />

      <Input
        value={value}
        onChange={(event) => {
          const nextValue = event.target.value;
          onChange(nextValue);
          setIsOpen(nextValue.trim().length >= minQueryLength);
        }}
        onFocus={() => setIsOpen(filteredSuggestions.length > 0)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className={cn("pr-10", showClearButton ? "pl-10" : "pl-3", inputClassName)}
      />

      {showClearButton && value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            setIsOpen(false);
            setActiveIndex(-1);
          }}
          className={cn(
            "absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full p-1 transition-colors",
            theme === "dark"
              ? "text-slate-300 hover:bg-white/20 hover:text-white"
              : "text-slate-500 hover:bg-slate-200 hover:text-slate-700"
          )}
          aria-label="مسح البحث"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {isOpen && filteredSuggestions.length > 0 && (
        <div
          className={cn(
            "absolute left-0 right-0 top-full z-[90] mt-2 max-h-72 overflow-y-auto rounded-xl border shadow-2xl",
            suggestionTheme === "dark"
              ? "border-white/20 bg-slate-900/95 backdrop-blur-md"
              : "border-slate-200 bg-white",
            dropdownClassName
          )}
        >
          {filteredSuggestions.map((item, index) => (
            <button
              key={`${item}-${index}`}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                handleSelect(item);
              }}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "block w-full truncate px-4 py-2.5 text-right text-sm transition-colors",
                suggestionTheme === "dark"
                  ? "text-slate-100 hover:bg-white/10"
                  : "text-slate-700 hover:bg-slate-100",
                activeIndex === index &&
                  (suggestionTheme === "dark" ? "bg-white/15" : "bg-slate-100")
              )}
            >
              {highlightMatch(item)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchAutocompleteInput);
