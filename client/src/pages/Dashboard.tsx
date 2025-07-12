import { Navbar } from '@/components/layout/Navbar';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { UserManagement } from '@/components/dashboard/UserManagement';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { GradeChart } from '@/components/dashboard/GradeChart';
import { CourseMaterials } from '@/components/dashboard/CourseMaterials';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useUsers } from '@/hooks/useUsers';
import { useGroups } from '@/hooks/useGroups';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: users = [] } = useUsers();
  const { data: groups = [] } = useGroups();

  const totalUsers = users.length;
  const totalProfessors = users.filter(u => u.role === 'professor').length;
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalGroups = groups.length;

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'professor': return 'Professeur';
      case 'student': return 'Élève';
      case 'parent': return 'Parent';
      default: return 'Utilisateur';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Tableau de Bord {getRoleTitle(user?.role || '')}
          </h2>
          <StatsCards 
            totalUsers={totalUsers}
            totalProfessors={totalProfessors}
            totalStudents={totalStudents}
            totalGroups={totalGroups}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Management */}
          <div className="lg:col-span-2">
            <UserManagement />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentActivity />
            <GradeChart />
          </div>
        </div>

        {/* Course Materials */}
        <div className="mt-8">
          <CourseMaterials />
        </div>
      </main>
    </div>
  );
}
