import React, { useState, useMemo } from "react";

/**
 * @typedef {Object} FilterSidebarProps
 * @property {boolean} isOpen
 * @property {Function} onClose
 * @property {Object} filters
 * @property {Function} setFilters
 * @property {Array} availableCountries
 */

const FilterSidebar = ({ isOpen, onClose, filters, setFilters, availableCountries }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return availableCountries.filter(
      (item) =>
        item.country.toLowerCase().includes(query) &&
        !filters.preferredCountries.includes(item.country) &&
        !filters.excludedCountries.includes(item.country),
    );
  }, [searchQuery, availableCountries, filters]);

  const addPreferred = (country) => {
    setFilters({
      ...filters,
      preferredCountries: [...filters.preferredCountries, country],
      excludedCountries: filters.excludedCountries.filter((c) => c !== country),
    });
    setSearchQuery("");
  };

  const addExcluded = (country) => {
    setFilters({
      ...filters,
      excludedCountries: [...filters.excludedCountries, country],
      preferredCountries: filters.preferredCountries.filter((c) => c !== country),
    });
    setSearchQuery("");
  };

  const removePreferred = (country) => {
    setFilters({
      ...filters,
      preferredCountries: filters.preferredCountries.filter((c) => c !== country),
    });
  };

  const removeExcluded = (country) => {
    setFilters({
      ...filters,
      excludedCountries: filters.excludedCountries.filter((c) => c !== country),
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-[60] ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-[#0f0f12] border-l border-gray-100 dark:border-white/10 shadow-2xl z-[70] transition-transform duration-500 ease-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Chat Filters
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">
                Target specific regions for your calls
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6 text-slate-400 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
            {/* Search Section */}
            <div className="relative">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-3 flex items-center gap-2">
                Find a Country
              </h3>
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600 shadow-sm"
                />
                <svg
                  className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-gray-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Search Results Dropdown */}
              {filteredResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1a20] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {filteredResults.map((item) => (
                    <div
                      key={item.country}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.flag}</span>
                        <span className="text-sm font-medium text-slate-700 dark:text-gray-200">
                          {item.country}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addPreferred(item.country)}
                          className="px-2 py-1 text-[10px] font-bold uppercase tracking-tighter bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-md transition-all border border-indigo-200 dark:border-indigo-500/20"
                        >
                          Want
                        </button>
                        <button
                          onClick={() => addExcluded(item.country)}
                          className="px-2 py-1 text-[10px] font-bold uppercase tracking-tighter bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-all border border-red-200 dark:border-red-500/20"
                        >
                          Skip
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chips for Preferred */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                  Interested In
                </span>
                <span className="text-[10px] text-slate-400 dark:text-gray-600 font-medium lowercase tracking-normal">
                  {filters.preferredCountries.length} active
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {filters.preferredCountries.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-gray-600 italic py-2">
                    Global (all countries)
                  </p>
                ) : (
                  filters.preferredCountries.map((country) => {
                    const countryData = availableCountries.find((c) => c.country === country);
                    return (
                      <div
                        key={`chip-pref-${country}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 rounded-full text-indigo-700 dark:text-indigo-100 text-xs font-medium animate-in zoom-in-95 duration-200 shadow-sm"
                      >
                        <span>
                          {countryData?.flag} {country}
                        </span>
                        <button
                          onClick={() => removePreferred(country)}
                          className="p-0.5 hover:bg-indigo-200 dark:hover:bg-white/20 rounded-full transition-colors"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chips for Excluded */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  Not Interested In
                </span>
                <span className="text-[10px] text-slate-400 dark:text-gray-600 font-medium lowercase tracking-normal">
                  {filters.excludedCountries.length} active
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {filters.excludedCountries.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-gray-600 italic py-2">
                    No exclusions
                  </p>
                ) : (
                  filters.excludedCountries.map((country) => {
                    const countryData = availableCountries.find((c) => c.country === country);
                    return (
                      <div
                        key={`chip-excl-${country}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-full text-red-700 dark:text-red-100 text-xs font-medium animate-in zoom-in-95 duration-200 shadow-sm"
                      >
                        <span>
                          {countryData?.flag} {country}
                        </span>
                        <button
                          onClick={() => removeExcluded(country)}
                          className="p-0.5 hover:bg-red-200 dark:hover:bg-white/20 rounded-full transition-colors"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/40">
            <button
              onClick={onClose}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-4 rounded-2xl hover:bg-slate-800 dark:hover:bg-gray-200 active:scale-[0.98] transition-all shadow-xl"
            >
              Done Filtering
            </button>
            <p className="text-[10px] text-center text-slate-400 dark:text-gray-600 mt-4 uppercase tracking-[0.2em] font-bold">
              Powered by VoxStrangers AI
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
