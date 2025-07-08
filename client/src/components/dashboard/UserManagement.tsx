import { useState } from 'react';
import { Edit, Trash2, Plus, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateUserModal } from '@/components/modals/CreateUserModal';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@shared/schema';

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const { data: users = [], isLoading } = useUsers();
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredUsers = users.filter(user => 
    selectedRole === 'all' || user.role === selectedRole
  );

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'Administrateur', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      professor: { label: 'Professeur', className: 'bg-accent/10 text-accent' },
      student: { label: 'Élève', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      parent: { label: 'Parent', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    };

    const config = roleConfig[role as keyof typeof roleConfig];
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-300 dark:bg-slate-600 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Gestion des Utilisateurs
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="admin">Administrateurs</SelectItem>
                  <SelectItem value="professor">Professeurs</SelectItem>
                  <SelectItem value="student">Élèves</SelectItem>
                  <SelectItem value="parent">Parents</SelectItem>
                </SelectContent>
              </Select>
              {(currentUser?.role === 'admin' || currentUser?.role === 'professor') && (
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Nom
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Email
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Rôle
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Statut
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary text-white text-sm font-medium">
                            {getInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {user.email}
                    </td>
                    <td className="p-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="p-4">
                      <Badge className={user.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }>
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-slate-500 hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-slate-500 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <CreateUserModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </>
  );
}
