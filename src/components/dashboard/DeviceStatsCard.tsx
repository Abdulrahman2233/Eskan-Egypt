import { useState, useEffect } from "react";
import { Loader, Smartphone, Monitor, Tablet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDeviceStats } from "@/api";

interface DeviceStat {
  label: string;
  count: number;
  total_visits: number;
  percentage: number;
}

export function DeviceStatsCard() {
  const [deviceStats, setDeviceStats] = useState<Record<string, DeviceStat>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDeviceStats();
  }, []);

  const loadDeviceStats = async () => {
    try {
      setIsLoading(true);
      const data = await getDeviceStats();
      setDeviceStats(data || {});
    } catch (error) {
      console.error("Error loading device stats:", error);
      setDeviceStats({});
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      case 'desktop':
        return <Monitor className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getDeviceColor = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return 'bg-blue-500/10 text-blue-600';
      case 'tablet':
        return 'bg-purple-500/10 text-purple-600';
      case 'desktop':
        return 'bg-green-500/10 text-green-600';
      default:
        return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getProgressColor = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return 'bg-blue-500';
      case 'tablet':
        return 'bg-purple-500';
      case 'desktop':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>أنواع الأجهزة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <Loader className="w-6 h-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const devices = Object.entries(deviceStats).map(([key, stat]) => ({
    type: key,
    ...stat
  }));

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>أنواع الأجهزة المستخدمة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.length > 0 ? (
            devices.map((device) => (
              <div key={device.type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getDeviceColor(device.type)}`}>
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{device.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {device.count} زائر • {device.total_visits} زيارة
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{device.percentage}%</p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(device.type)} transition-all`}
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">لا توجد بيانات متاحة</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
