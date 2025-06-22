
import { Card, CardContent } from "@/components/ui/card";

const COTSummaryCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gray-700/50 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400">Commercial Net</div>
          <div className="text-2xl font-bold text-green-400">+52,000</div>
          <div className="text-xs text-gray-500">contracts</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-700/50 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400">Non-Commercial Net</div>
          <div className="text-2xl font-bold text-red-400">-49,000</div>
          <div className="text-xs text-gray-500">contracts</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-700/50 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400">Net Change</div>
          <div className="text-2xl font-bold text-yellow-400">+3,000</div>
          <div className="text-xs text-gray-500">from last week</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default COTSummaryCards;
