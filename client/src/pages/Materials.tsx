import { Navbar } from '@/components/layout/Navbar';
import { CourseMaterials } from '@/components/dashboard/CourseMaterials';

export default function Materials() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Supports de Cours
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Gérez les supports de cours et les ressources pédagogiques
          </p>
        </div>
        <CourseMaterials />
      </main>
    </div>
  );
}
