
import { Badge } from "@/components/ui/badge";
import { NewsLocation } from "./types";

interface NewsLocationsListProps {
  newsLocations: NewsLocation[];
}

const NewsLocationsList = ({ newsLocations }: NewsLocationsListProps) => {
  return (
    <div className="mt-4 space-y-2">
      <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
        Active News Locations
      </div>
      {newsLocations.slice(0, 3).map((location) => (
        <div key={location.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
            {location.headline}
          </span>
          <Badge 
            variant="outline" 
            className={`text-xs ${
              location.sentiment === 'bullish' 
                ? 'border-green-500/30 text-green-600 dark:text-green-400' 
                : location.sentiment === 'bearish'
                ? 'border-red-500/30 text-red-600 dark:text-red-400'
                : 'border-purple-500/30 text-purple-600 dark:text-purple-400'
            }`}
          >
            {location.sentiment}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default NewsLocationsList;
