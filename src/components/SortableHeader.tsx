import type { SortColumn, SortDirection } from '../types';

interface SortableHeaderProps {
  column: SortColumn;
  currentColumn: SortColumn | undefined;
  currentDirection: SortDirection | undefined;
  onSort: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SortableHeader({
  column,
  currentColumn,
  currentDirection,
  onSort,
  children,
  className = '',
}: SortableHeaderProps) {
  const isActive = currentColumn === column;

  const getSortIndicator = () => {
    if (!isActive) return ' ↕';
    return currentDirection === 'asc' ? ' ↑' : ' ↓';
  };

  const getAriaSort = (): 'ascending' | 'descending' | 'none' => {
    if (!isActive) return 'none';
    return currentDirection === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <th
      className={`sortable-header ${className} ${isActive ? 'active-sort' : ''}`.trim()}
      onClick={onSort}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSort();
        }
      }}
      role="button"
      tabIndex={0}
      aria-sort={getAriaSort()}
      aria-label={`Sort by ${children}${isActive ? `, currently ${currentDirection}ending` : ''}`}
    >
      {children}
      <span className="sort-indicator" aria-hidden="true">
        {getSortIndicator()}
      </span>
    </th>
  );
}
