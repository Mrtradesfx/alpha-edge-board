import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bell, 
  Plus, 
  Trash2, 
  Power, 
  PowerOff,
  X,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useSmartAlerts } from "@/hooks/useSmartAlerts";

const CURRENCY_PAIRS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 
  'EURGBP', 'EURJPY', 'GBPJPY'
];

const SmartAlerts = () => {
  const {
    alerts,
    triggeredAlerts,
    isMonitoring,
    setIsMonitoring,
    addAlert,
    removeAlert,
    toggleAlert,
    dismissTriggeredAlert,
    clearAllTriggeredAlerts
  } = useSmartAlerts();

  const [newAlert, setNewAlert] = useState({
    symbol: '',
    alertPrice: '',
    direction: 'above' as 'above' | 'below',
    label: ''
  });

  const handleAddAlert = () => {
    if (!newAlert.symbol || !newAlert.alertPrice || !newAlert.label) return;

    addAlert({
      symbol: newAlert.symbol,
      alertPrice: parseFloat(newAlert.alertPrice),
      direction: newAlert.direction,
      label: newAlert.label,
      isActive: true
    });

    setNewAlert({
      symbol: '',
      alertPrice: '',
      direction: 'above',
      label: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Triggered Alerts */}
      {triggeredAlerts.length > 0 && (
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertTriangle className="w-5 h-5" />
                Alert Notifications ({triggeredAlerts.length})
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllTriggeredAlerts}
                className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {triggeredAlerts.map((alert) => (
              <Alert key={alert.id} className="bg-white dark:bg-gray-900">
                <div className="flex justify-between items-start">
                  <AlertDescription className="flex-1 whitespace-pre-line text-sm">
                    {alert.message}
                  </AlertDescription>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissTriggeredAlert(alert.id)}
                    className="ml-2 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Smart Alerts Panel */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Bell className="w-5 h-5" />
              Smart Alerts
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isMonitoring ? "default" : "secondary"}>
                {isMonitoring ? "Active" : "Paused"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={isMonitoring ? "text-green-600" : "text-gray-600"}
              >
                {isMonitoring ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Alert Form */}
          <Card className="bg-gray-50 dark:bg-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create New Alert
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="symbol">Currency Pair</Label>
                  <Select
                    value={newAlert.symbol}
                    onValueChange={(value) => setNewAlert(prev => ({ ...prev, symbol: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pair" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCY_PAIRS.map(pair => (
                        <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="direction">Direction</Label>
                  <Select
                    value={newAlert.direction}
                    onValueChange={(value: 'above' | 'below') => 
                      setNewAlert(prev => ({ ...prev, direction: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Above (Break Higher)</SelectItem>
                      <SelectItem value="below">Below (Break Lower)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Alert Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.0001"
                    placeholder="1.2500"
                    value={newAlert.alertPrice}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, alertPrice: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="label">Label</Label>
                  <Input
                    id="label"
                    placeholder="Support/Resistance/Key Level"
                    value={newAlert.label}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, label: e.target.value }))}
                  />
                </div>
              </div>

              <Button 
                onClick={handleAddAlert}
                className="w-full"
                disabled={!newAlert.symbol || !newAlert.alertPrice || !newAlert.label}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Smart Alert
              </Button>
            </CardContent>
          </Card>

          {/* Existing Alerts List */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active Alerts ({alerts.filter(a => a.isActive).length}/{alerts.length})
            </h3>
            
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No alerts configured. Create your first smart alert above.
              </p>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <Card key={alert.id} className={`p-3 ${alert.isActive ? 'bg-green-50 dark:bg-green-950/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {alert.direction === 'above' ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className="font-mono text-sm font-medium">
                            {alert.symbol}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {alert.direction} {alert.alertPrice} ({alert.label})
                        </span>
                        <Badge variant={alert.isActive ? "default" : "secondary"} className="text-xs">
                          {alert.isActive ? "Active" : "Paused"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAlert(alert.id)}
                          className="h-8 w-8 p-0"
                        >
                          {alert.isActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAlert(alert.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartAlerts;
