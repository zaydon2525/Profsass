import { useState } from 'react';
import { UserPlus, BookOpen, BarChart3, Upload, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateUserModal } from '@/components/modals/CreateUserModal';
import { CreateGroupModal } from '@/components/modals/CreateGroupModal';
import { UploadModal } from '@/components/modals/UploadModal';
import { useAuth } from '@/contexts/AuthContext';

export function QuickActions() {
  const { user } = useAuth();
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const getQuickActions = () => {
    if (user?.role === 'admin') {
      return [
        {
          title: 'Créer un Professeur',
          description: 'Ajouter un nouveau professeur au système',
          icon: UserPlus,
          color: 'bg-primary hover:bg-primary/90',
          action: () => setShowCreateUserModal(true),
        },
        {
          title: 'Nouveau Groupe',
          description: 'Créer un nouveau groupe de classe',
          icon: BookOpen,
          color: 'bg-accent hover:bg-accent/90',
          action: () => setShowCreateGroupModal(true),
        },
        {
          title: 'Voir Rapports',
          description: 'Consulter les statistiques détaillées',
          icon: BarChart3,
          color: 'bg-warning hover:bg-warning/90',
          action: () => console.log('Navigate to reports'),
        },
        {
          title: 'Gérer Utilisateurs',
          description: 'Administrer tous les utilisateurs',
          icon: Users,
          color: 'bg-purple-500 hover:bg-purple-600',
          action: () => console.log('Navigate to users'),
        },
      ];
    } else if (user?.role === 'professor') {
      return [
        {
          title: 'Créer un Élève',
          description: 'Ajouter un nouvel élève à vos classes',
          icon: UserPlus,
          color: 'bg-primary hover:bg-primary/90',
          action: () => setShowCreateUserModal(true),
        },
        {
          title: 'Nouveau Groupe',
          description: 'Créer un nouveau groupe de classe',
          icon: BookOpen,
          color: 'bg-accent hover:bg-accent/90',
          action: () => setShowCreateGroupModal(true),
        },
        {
          title: 'Uploader Fichier',
          description: 'Ajouter des supports de cours',
          icon: Upload,
          color: 'bg-blue-500 hover:bg-blue-600',
          action: () => setShowUploadModal(true),
        },
        {
          title: 'Gérer Notes',
          description: 'Saisir et modifier les notes',
          icon: BarChart3,
          color: 'bg-orange-500 hover:bg-orange-600',
          action: () => console.log('Navigate to grades'),
        },
      ];
    } else {
      return [
        {
          title: 'Mes Notes',
          description: 'Consulter mes résultats',
          icon: BarChart3,
          color: 'bg-primary hover:bg-primary/90',
          action: () => console.log('Navigate to my grades'),
        },
        {
          title: 'Supports de Cours',
          description: 'Accéder aux ressources pédagogiques',
          icon: FileText,
          color: 'bg-accent hover:bg-accent/90',
          action: () => console.log('Navigate to materials'),
        },
      ];
    }
  };

  const quickActions = getQuickActions();

  return (
    <>
      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white p-4 h-auto flex-col items-center justify-center space-y-2 transition-all hover:shadow-lg`}
                >
                  <Icon className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateUserModal 
        isOpen={showCreateUserModal} 
        onClose={() => setShowCreateUserModal(false)} 
      />
      <CreateGroupModal 
        isOpen={showCreateGroupModal} 
        onClose={() => setShowCreateGroupModal(false)} 
      />
      <UploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
    </>
  );
}
