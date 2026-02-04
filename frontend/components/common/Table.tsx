
import React from 'react';

interface Column<T> {
  header: string;
  headerEn: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
}

export function Table<T>({ columns, data, onRowClick }: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-[2rem] border border-slate-100 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50">
            {columns.map((col, idx) => (
              <th key={idx} className="px-8 py-6 border-b border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">{col.header}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{col.headerEn}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.length > 0 ? data.map((item, rowIdx) => (
            <tr 
              key={rowIdx} 
              onClick={() => onRowClick?.(item)}
              className={`group transition-colors ${onRowClick ? 'cursor-pointer hover:bg-blue-50/30' : ''}`}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-8 py-6 text-sm text-slate-600 font-medium">
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} className="px-8 py-20 text-center text-slate-400 italic">
                Không tìm thấy dữ liệu phù hợp / No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
