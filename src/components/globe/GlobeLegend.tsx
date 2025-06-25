
const GlobeLegend = () => {
  return (
    <div className="mt-4 flex flex-wrap gap-2 justify-center">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-600 dark:text-gray-400">Bullish</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-600 dark:text-gray-400">Bearish</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-600 dark:text-gray-400">Neutral</span>
      </div>
    </div>
  );
};

export default GlobeLegend;
