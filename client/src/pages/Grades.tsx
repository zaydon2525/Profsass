import { Navbar } from '@/components/layout/Navbar';
import { GradeChart } from '@/components/dashboard/GradeChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';

export default function Grades() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Gestion des Notes
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Suivez les notes et les progrès des élèves
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button className="bg-primary text-white hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Note
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Tableau des Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <p>Aucune note enregistrée pour le moment</p>
                  <Button className="mt-4 bg-primary text-white hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter des Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <GradeChart />
          </div>
        </div>
      </main>
    </div>
  );
}
