import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Clock, Eye, Edit, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getHistory, HistoryItem } from "@/lib/history-storage";

const History = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      console.log("Fetching history...");
      const items = await getHistory();
      console.log("Fetched history items:", items);
      setHistoryItems(items);
    };
    fetchHistory();
  }, []);

  const getIcon = (type: HistoryItem['type']) => {
    switch (type) {
      case 'create': return FileText;
      case 'edit': return Edit;
      case 'view': return Eye;
      case 'profile': return User;
      default: return Clock;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Activity History</h1>
          <p className="text-muted-foreground">
            Track all your portfolio activities and changes
          </p>
        </div>

        <div className="space-y-4">
          {historyItems.map((item) => {
            const Icon = getIcon(item.type);
            return (
              <Card
                key={item.id}
                className="p-6 hover:shadow-lg transition-all border-l-4 border-l-primary/20 hover:border-l-primary"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-1">{item.action}</p>
                    {item.portfolio && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.portfolio}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {historyItems.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No activity yet</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default History;
