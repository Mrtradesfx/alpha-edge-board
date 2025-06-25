
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

interface TradingCalendarHeaderProps {
  onFiltersClick?: () => void;
  onDateClick?: () => void;
}

const TradingCalendarHeader = ({ onFiltersClick, onDateClick }: TradingCalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Good morning!</p>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onFiltersClick}>
          <CalendarIcon className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline" size="sm" onClick={onDateClick}>
          Date
        </Button>
      </div>
    </div>
  );
};

export default TradingCalendarHeader;
