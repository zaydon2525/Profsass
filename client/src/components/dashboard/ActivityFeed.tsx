import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  UserPlus, 
  Upload, 
  BookOpen, 
  GraduationCap, 
  FileText,
  Trash2,
  Edit,
  LogIn,
  LogOut
} from 'lucide-react';

interface ActivityItem {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string | null;
  details: any;
  createdAt: Date;
  userName?: string;
  userRole?: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching activities
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        userId: 'user-1',
        action: 'create_user',
        entityType: 'user',
        entityId: 'user-2',
        details: { name: 'Jean Dupont', role: 'student' },
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        userName: 'Admin System',
        userRole: 'admin'
      },
      {
        id: '2',
        userId: 'user-3',
        action: 'upload_material',
        entityType: 'material',
        entityId: 'material-1',
        details: { title: 'Cours de Mathématiques - Chapitre 1', fileType: 'application/pdf' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        userName: 'Marie Dubois',
        userRole: 'professor'
      },
      {
        id: '3',
        userId: 'user-4',
        action: 'create_group',
        entityType: 'group',
        entityId: 'group-1',
        details: { name: 'Classe de 5ème A', academicYear: '2024' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        userName: 'Pierre Martin',
        userRole: 'professor'
      },
      {
        id: '4',
        userId: 'user-5',
        action: 'create_grade',
        entityType: 'grade',
        entityId: 'grade-1',
        details: { title: 'Contrôle de Mathématiques', value: '15.5' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        userName: 'Sophie Lefebvre',
        userRole: 'professor'
      },
      {
        id: '5',
        userId: 'user-6',
        action: 'login',
        entityType: 'user',
        entityId: 'user-6',
        details: { loginTime: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        userName: 'Alice Bernard',
        userRole: 'student'
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      setActivities(mockActivities);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'create_user':
        return <UserPlus className="h-4 w-4" />;
      case 'upload_material':
        return <Upload className="h-4 w-4" />;
      case 'create_group':
        return <BookOpen className="h-4 w-4" />;
      case 'create_grade':
        return <GraduationCap className="h-4 w-4" />;
      case 'login':
        return <LogIn className="h-4 w-4" />;
      case 'logout':
        return <LogOut className="h-4 w-4" />;
      case 'delete_user':
      case 'delete_material':
      case 'delete_group':
        return <Trash2 className="h-4 w-4" />;
      case 'update_user':
      case 'update_material':
      case 'update_group':
        return <Edit className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'create_user':
      case 'create_group':
      case 'create_grade':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'upload_material':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'login':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'logout':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'delete_user':
      case 'delete_material':
      case 'delete_group':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'update_user':
      case 'update_material':
      case 'update_group':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200';
    }
  };

  const getActivityMessage = (activity: ActivityItem) => {
    const { action, details } = activity;
    
    switch (action) {
      case 'create_user':
        return `a créé l'utilisateur ${details.name} (${details.role})`;
      case 'upload_material':
        return `a uploadé le fichier "${details.title}"`;
      case 'create_group':
        return `a créé le groupe "${details.name}"`;
      case 'create_grade':
        return `a ajouté une note "${details.title}" (${details.value}/20)`;
      case 'login':
        return 's\'est connecté(e)';
      case 'logout':
        return 's\'est déconnecté(e)';
      case 'delete_user':
        return 'a supprimé un utilisateur';
      case 'delete_material':
        return 'a supprimé un fichier';
      case 'delete_group':
        return 'a supprimé un groupe';
      case 'update_user':
        return 'a modifié un utilisateur';
      case 'update_material':
        return 'a modifié un fichier';
      case 'update_group':
        return 'a modifié un groupe';
      default:
        return 'a effectué une action';
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'Admin', className: 'bg-red-500 text-white' },
      professor: { label: 'Prof', className: 'bg-blue-500 text-white' },
      student: { label: 'Élève', className: 'bg-green-500 text-white' },
      parent: { label: 'Parent', className: 'bg-purple-500 text-white' },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.student;
    return (
      <Badge className={`${config.className} text-xs`}>
        {config.label}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Activité Récente
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <CardHeader className="border-b border-slate-200 dark:border-slate-700">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Activité Récente
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              Aucune activité récente
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(activity.userName || 'U')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`p-1 rounded-full ${getActivityColor(activity.action)}`}>
                      {getActivityIcon(activity.action)}
                    </div>
                    {activity.userRole && getRoleBadge(activity.userRole)}
                  </div>
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    <span className="font-medium">{activity.userName}</span>{' '}
                    {getActivityMessage(activity)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDistanceToNow(activity.createdAt, { addSuffix: true, locale: fr })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
