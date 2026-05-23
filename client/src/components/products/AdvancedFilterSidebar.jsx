import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineFilter, 
  HiOutlineSearch, 
  HiOutlineChevronDown,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineCurrencyDollar,
  HiOutlineBeaker,
  HiOutlineChip,
  HiOutlineArchive
} from 'react-icons/hi';

const FilterSection = ({ title, icon: Icon, children, isOpen, onToggle, count }) => (
  <div className="border-b border-gray-100 last:border-0 py-4">
    <button 
      onClick={onToggle}
      className="flex items-center justify-between w-full text-left group"
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className={`w-5 h-5 ${isOpen ? 'text-primary' : 'text-gray-400'}`} />}
        <span className={`text-sm font-black uppercase tracking-widest ${isOpen ? 'text-gray-900' : 'text-gray-500'} group-hover:text-primary transition-colors`}>
          {title}
          {count > 0 && <span className="ml-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{count}</span>}
        </span>
      </div>
      <HiOutlineChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="pt-4 pb-2 space-y-2">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const AdvancedFilterSidebar = ({ 
  products, 
  categories,
  filters, 
  setFilters,
  onReset
}) => {
  const [openSections, setOpenSections] = useState({
    search: true,
    category: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleToggle = (field, value) => {
    setFilters(prev => {
      // For category, if it's already selected, unselect it to show all.
      // If another is selected, select it and unselect others to act like a radio but with "all" state.
      const current = prev[field] || [];
      const isSelected = current.includes(value);
      
      if (field === 'selectedCategories') {
        // If already selected, clear it (show all)
        if (isSelected) {
          return { ...prev, [field]: [] };
        } else {
          // Select only this one
          return { ...prev, [field]: [value] };
        }
      }

      const updated = isSelected
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.selectedCategories.length > 0) count++;
    return count;
  }, [filters]);

  return (
    <aside className="w-full space-y-6">
      <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-xl text-white">
              <HiOutlineFilter size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">Filters</h3>
              {activeFilterCount > 0 && (
                <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                  {activeFilterCount} Active Filters
                </p>
              )}
            </div>
          </div>
          {activeFilterCount > 0 && (
            <button 
              onClick={onReset}
              className="text-xs font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
            >
              <HiOutlineX size={14} />
              Reset
            </button>
          )}
        </div>

        <div className="p-6 space-y-2">
          {/* Search */}
          <FilterSection 
            title="Search" 
            icon={HiOutlineSearch} 
            isOpen={openSections.search} 
            onToggle={() => toggleSection('search')}
          >
            <div className="relative">
              <input 
                type="text"
                value={filters.searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters(prev => {
                    const newFilters = { ...prev, searchTerm: value };
                    
                    // Auto-select category if search term matches a category name
                    if (value.trim().length >= 2) {
                      const matchedCategory = categories.find(cat => 
                        cat.name.toLowerCase().includes(value.toLowerCase())
                      );
                      if (matchedCategory) {
                        newFilters.selectedCategories = [matchedCategory.name];
                      }
                    } else if (value.trim().length === 0) {
                      // Clear categories when search is cleared to return to "All Products"
                      newFilters.selectedCategories = [];
                    }
                    
                    return newFilters;
                  });
                }}
                placeholder="Product name, model..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
              />
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </FilterSection>

          {/* Categories */}
          <FilterSection 
            title="Category" 
            icon={HiOutlineArchive} 
            isOpen={openSections.category} 
            onToggle={() => toggleSection('category')}
            count={filters.selectedCategories.length}
          >
            <div className="grid grid-cols-1 gap-1">
              <button
                onClick={() => setFilters(prev => ({ ...prev, selectedCategories: [] }))}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${filters.selectedCategories.length === 0 ? 'bg-primary/5 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <span>All Products</span>
                {filters.selectedCategories.length === 0 && <HiOutlineCheck size={16} />}
              </button>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => handleToggle('selectedCategories', cat.name)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${filters.selectedCategories.includes(cat.name) ? 'bg-primary/5 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <span>{cat.name}</span>
                  {filters.selectedCategories.includes(cat.name) && <HiOutlineCheck size={16} />}
                </button>
              ))}
            </div>
          </FilterSection>
        </div>
      </div>
    </aside>
  );
};

export default AdvancedFilterSidebar;
