import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityItem {
  id: string;
  message: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}

export function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      id: '1',
      message: 'Nouveau professeur ajouté',
      time: 'Il y a 2 heures',
      type: 'success',
    },
    {
      id: '2',
      message: '15 élèves inscrits au groupe A',
      time: 'Il y a 4 heures',
      type: 'info',
    },
    {
      id: '3',
      message: 'Nouveau support de cours uploadé',
      time: 'Il y a 1 jour',
      type: 'info',
    },
    {
      id: '4',
      message: 'Mise à jour des notes effectuée',
      time: 'Il y a 2 jours',
      type: 'warning',
    },
  ];

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'success':
        return 'bg-accent';
      case 'info':
        return 'bg-primary';
      case 'warning':
        return 'bg-warning';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <CardHeader className="border-b border-slate-200 dark:border-slate-700">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Activité Récente
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`} />
              <div>
                <p className="text-sm text-slate-900 dark:text-slate-100">
                  {activity.message}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
