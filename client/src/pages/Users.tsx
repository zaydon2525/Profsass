import { Navbar } from '@/components/layout/Navbar';
import { UserManagement } from '@/components/dashboard/UserManagement';

export default function Users() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Gestion des Utilisateurs
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Gérez les utilisateurs de votre système éducatif
          </p>
        </div>
        <UserManagement />
      </main>
    </div>
  );
}
