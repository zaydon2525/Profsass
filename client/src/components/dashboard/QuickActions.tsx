import { useState } from 'react';
import { UserPlus, BookOpen, BarChart3, Upload, Users, FileText, GraduationCap, UserCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateUserModal } from '@/components/modals/CreateUserModal';
import { CreateGroupModal } from '@/components/modals/CreateGroupModal';
import { UploadModal } from '@/components/modals/UploadModal';
import { CreateCourseModal } from '@/components/modals/CreateCourseModal';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';

export function QuickActions() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<'professor' | 'student' | 'parent'>('professor');

  const handleCreateUser = (userType: 'professor' | 'student' | 'parent') => {
    setSelectedUserType(userType);
    setShowCreateUserModal(true);
  };

  const getQuickActions = () => {
    if (user?.role === 'admin') {
      return [
        {
          title: 'Ajouter un Professeur',
          description: 'Créer un nouveau professeur',
          icon: GraduationCap,
          color: 'bg-blue-500 hover:bg-blue-600',
          action: () => handleCreateUser('professor'),
        },
        {
          title: 'Ajouter un Élève',
          description: 'Créer un nouvel élève',
          icon: UserPlus,
          color: 'bg-green-500 hover:bg-green-600',
          action: () => handleCreateUser('student'),
        },
        {
          title: 'Ajouter un Parent',
          description: 'Créer un nouveau parent',
          icon: Heart,
          color: 'bg-pink-500 hover:bg-pink-600',
          action: () => handleCreateUser('parent'),
        },
        {
          title: 'Créer un Groupe',
          description: 'Nouveau groupe de classe',
          icon: BookOpen,
          color: 'bg-purple-500 hover:bg-purple-600',
          action: () => setShowCreateGroupModal(true),
        },
        {
          title: 'Ajouter un Cours',
          description: 'Créer un nouveau cours',
          icon: BookOpen,
          color: 'bg-orange-500 hover:bg-orange-600',
          action: () => setShowCreateCourseModal(true),
        },
        {
          title: 'Voir Rapports',
          description: 'Consulter les statistiques',
          icon: BarChart3,
          color: 'bg-red-500 hover:bg-red-600',
          action: () => setLocation('/grades'),
        },
        {
          title: 'Gérer Utilisateurs',
          description: 'Administrer tous les utilisateurs',
          icon: Users,
          color: 'bg-slate-500 hover:bg-slate-600',
          action: () => setLocation('/users'),
        },
      ];
    } else if (user?.role === 'professor') {
      return [
        {
          title: 'Créer un Élève',
          description: 'Ajouter un nouvel élève',
          icon: UserPlus,
          color: 'bg-green-500 hover:bg-green-600',
          action: () => handleCreateUser('student'),
        },
        {
          title: 'Nouveau Groupe',
          description: 'Créer un groupe de classe',
          icon: BookOpen,
          color: 'bg-purple-500 hover:bg-purple-600',
          action: () => setShowCreateGroupModal(true),
        },
        {
          title: 'Nouveau Cours',
          description: 'Créer un cours au planning',
          icon: BookOpen,
          color: 'bg-blue-500 hover:bg-blue-600',
          action: () => setShowCreateCourseModal(true),
        },
        {
          title: 'Uploader Fichier',
          description: 'Ajouter des supports',
          icon: Upload,
          color: 'bg-teal-500 hover:bg-teal-600',
          action: () => setShowUploadModal(true),
        },
        {
          title: 'Gérer Notes',
          description: 'Saisir et modifier les notes',
          icon: BarChart3,
          color: 'bg-orange-500 hover:bg-orange-600',
          action: () => setLocation('/grades'),
        },
        {
          title: 'Mes Groupes',
          description: 'Voir mes groupes',
          icon: Users,
          color: 'bg-slate-500 hover:bg-slate-600',
          action: () => setLocation('/groups'),
        },
      ];
    } else if (user?.role === 'student') {
      return [
        {
          title: 'Mes Notes',
          description: 'Consulter mes résultats',
          icon: BarChart3,
          color: 'bg-blue-500 hover:bg-blue-600',
          action: () => setLocation('/grades'),
        },
        {
          title: 'Mes Groupes',
          description: 'Voir mes groupes',
          icon: Users,
          color: 'bg-green-500 hover:bg-green-600',
          action: () => setLocation('/groups'),
        },
        {
          title: 'Supports de Cours',
          description: 'Accéder aux ressources',
          icon: FileText,
          color: 'bg-purple-500 hover:bg-purple-600',
          action: () => setLocation('/materials'),
        },
      ];
    } else if (user?.role === 'parent') {
      return [
        {
          title: 'Notes de mon Enfant',
          description: 'Consulter les résultats',
          icon: BarChart3,
          color: 'bg-blue-500 hover:bg-blue-600',
          action: () => setLocation('/grades'),
        },
        {
          title: 'Planning Hebdomadaire',
          description: 'Voir le planning',
          icon: FileText,
          color: 'bg-green-500 hover:bg-green-600',
          action: () => setLocation('/materials'),
        },
      ];
    }
    return [];
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
          <div className={`grid gap-4 ${
            user?.role === 'admin' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
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
        defaultRole={selectedUserType}
      />
      <CreateGroupModal 
        isOpen={showCreateGroupModal} 
        onClose={() => setShowCreateGroupModal(false)} 
      />
      <UploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
      <CreateCourseModal 
        isOpen={showCreateCourseModal} 
        onClose={() => setShowCreateCourseModal(false)}
      />
    </>
  );
}
