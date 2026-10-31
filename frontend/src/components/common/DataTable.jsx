import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { Button } from './Button';

export function DataTable({
  columns = [],
  data = [],
  searchKey = '',
  searchPlaceholder = 'Search records...',
  filterOptions = [],
  filterKey = 'status',
  onRowClick,
  actionButton,
  emptyMessage = 'No records found',
}) {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search matching
      let matchesSearch = true;
      if (search.trim()) {
        const query = search.toLowerCase();
        if (searchKey && item[searchKey]) {
          matchesSearch = String(item[searchKey]).toLowerCase().includes(query);
        } else {
          matchesSearch = Object.values(item).some(val => 
            String(val).toLowerCase().includes(query)
          );
        }
      }

      // Filter matching
      let matchesFilter = true;
      if (selectedFilter !== 'All') {
        matchesFilter = String(item[filterKey] || '').toLowerCase() === selectedFilter.toLowerCase();
      }

      return matchesSearch && matchesFilter;
    });
  }, [data, search, searchKey, selectedFilter, filterKey]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Filter Dropdown */}
          {filterOptions.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                {filterOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {actionButton && <div>{actionButton}</div>}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-medium">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-4 py-3 ${col.headerClassName || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-slate-50/80 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-4 py-3.5 ${col.className || ''}`}>
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <Inbox className="w-8 h-8 text-slate-300 mb-2 stroke-1" />
                    <p className="text-xs font-medium text-slate-600">{emptyMessage}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try adjusting your filters or search terms</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/40">
        <div>
          Showing <span className="font-semibold text-slate-700">{filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="font-semibold text-slate-700">
            {Math.min(currentPage * pageSize, filteredData.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-700">{filteredData.length}</span> entries
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-slate-600 font-medium px-1">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
