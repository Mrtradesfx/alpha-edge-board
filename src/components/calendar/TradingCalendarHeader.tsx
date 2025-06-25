
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface TradingCalendarHeaderProps {
  onFiltersClick?: () => void;
  onDateClick?: () => void;
}

const TradingCalendarHeader = ({ onFiltersClick, onDateClick }: TradingCalendarHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn("flex items-center justify-between", isMobile ? "flex-col space-y-4" : "")}>
      <div className={cn(isMobile ? "text-center" : "")}>
        <h1 className={cn("font-bold text-gray-900 dark:text-white", 
          isMobile ? "text-2xl" : "text-3xl"
        )}>
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Good morning!</p>
      </div>
      <div className={cn("flex items-center space-x-4", isMobile ? "w-full justify-center" : "")}>
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
