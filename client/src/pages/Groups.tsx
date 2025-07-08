import { useState } from 'react';
import { Plus, Users, BookOpen, Edit, Trash2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreateGroupModal } from '@/components/modals/CreateGroupModal';
import { useGroups } from '@/hooks/useGroups';

export default function Groups() {
  const { data: groups = [], isLoading } = useGroups();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Gestion des Groupes
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Créez et gérez les groupes d'élèves
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Groupe
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Aucun groupe créé
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Commencez par créer votre premier groupe d'élèves
              </p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer un Groupe
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {group.name}
                    </CardTitle>
                    <Badge className={group.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }>
                      {group.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    {group.description || 'Aucune description'}
                  </p>
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>0 élèves</span>
                    </div>
                    <span>Année: {group.academicYear}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Voir Élèves
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <CreateGroupModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
}
