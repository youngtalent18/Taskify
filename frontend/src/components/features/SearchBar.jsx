import { Search, X } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  resultCount,
  totalCount,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />

        <input
          type="text"
          placeholder="Search by title or description..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-border rounded-lg py-2 pl-9 pr-9 h-10 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-700 transition"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {value.trim() && (
        <p className="text-xs text-muted-foreground px-1">
          {resultCount === 0 ? (
            <span className="text-destructive">
              No tasks match "{value}"
            </span>
          ) : (
            <>
              <span className="font-semibold text-foreground">
                {resultCount}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {totalCount}
              </span>{" "}
              tasks match "{value}"
            </>
          )}
        </p>
      )}
    </div>
  );
};

export default SearchBar;