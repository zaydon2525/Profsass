import { Users, GraduationCap, BookOpen, LayersIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardsProps {
  totalUsers: number;
  totalProfessors: number;
  totalStudents: number;
  totalGroups: number;
}

export function StatsCards({ totalUsers, totalProfessors, totalStudents, totalGroups }: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Utilisateurs',
      value: totalUsers,
      icon: Users,
      color: 'bg-primary/10 text-primary',
      trend: '+12%',
      description: 'vs mois dernier',
    },
    {
      title: 'Professeurs',
      value: totalProfessors,
      icon: GraduationCap,
      color: 'bg-accent/10 text-accent',
      trend: '+2',
      description: 'nouveaux',
    },
    {
      title: 'Élèves',
      value: totalStudents,
      icon: Users,
      color: 'bg-warning/10 text-warning',
      trend: '+15',
      description: 'ce mois',
    },
    {
      title: 'Groupes Actifs',
      value: totalGroups,
      icon: LayersIcon,
      color: 'bg-purple-500/10 text-purple-500',
      trend: 'Stable',
      description: '',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-accent text-sm">{stat.trend}</span>
                {stat.description && (
                  <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">
                    {stat.description}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
