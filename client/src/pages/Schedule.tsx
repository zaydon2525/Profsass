import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, BookOpen, Users, Plus } from 'lucide-react';
import { useSchedules } from '@/hooks/useSchedules';
import { CreateCourseModal } from '@/components/modals/CreateCourseModal';

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lundi', short: 'Lun' },
  { value: 2, label: 'Mardi', short: 'Mar' },
  { value: 3, label: 'Mercredi', short: 'Mer' },
  { value: 4, label: 'Jeudi', short: 'Jeu' },
  { value: 5, label: 'Vendredi', short: 'Ven' },
  { value: 6, label: 'Samedi', short: 'Sam' },
  { value: 0, label: 'Dimanche', short: 'Dim' }
];

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00'
];

export default function Schedule() {
  const { user } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Fetch schedules based on user role
  const schedulesQuery = useSchedules(
    user?.role === 'professor' ? undefined : undefined,
    user?.role === 'professor' ? user.id : undefined
  );

  const canCreateSchedule = user?.role === 'admin' || user?.role === 'professor';

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      week.push(weekDate);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedWeek);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(selectedWeek.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedWeek(newDate);
  };

  const formatWeekRange = (dates: Date[]) => {
    const start = dates[0];
    const end = dates[6];
    const startStr = start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    const endStr = end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  const scheduleData = schedulesQuery.data || [];

  const getScheduleForDay = (dayOfWeek: number) => {
    return scheduleData.filter(item => item.dayOfWeek === dayOfWeek);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Emploi du temps
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {user?.role === 'admin' ? 'Gestion des emplois du temps' :
             user?.role === 'professor' ? 'Vos cours et plannings' :
             'Votre emploi du temps'}
          </p>
        </div>
        {canCreateSchedule && (
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau cours
          </Button>
        )}
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigateWeek('prev')}
              className="flex items-center gap-2"
            >
              ← Semaine précédente
            </Button>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-slate-600" />
              <span className="text-lg font-medium">
                {formatWeekRange(weekDates)}
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigateWeek('next')}
              className="flex items-center gap-2"
            >
              Semaine suivante →
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Weekly Schedule Grid */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-8 gap-2">
            {/* Header with days */}
            <div className="text-center font-medium text-slate-600 dark:text-slate-400 p-2">
              Heure
            </div>
            {DAYS_OF_WEEK.map((day, index) => (
              <div key={day.value} className="text-center font-medium text-slate-600 dark:text-slate-400 p-2">
                <div className="font-bold">{day.short}</div>
                <div className="text-sm">
                  {weekDates[index]?.getDate()}
                </div>
              </div>
            ))}

            {/* Time slots */}
            {TIME_SLOTS.map((time) => (
              <div key={time} className="contents">
                <div className="text-center text-sm font-medium text-slate-500 dark:text-slate-500 p-2 border-r">
                  {time}
                </div>
                {DAYS_OF_WEEK.map((day) => {
                  const daySchedule = getScheduleForDay(day.value);
                  const slotSchedule = daySchedule.find(s => s.startTime === time);
                  
                  return (
                    <div 
                      key={`${day.value}-${time}`} 
                      className="min-h-[60px] p-1 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      {slotSchedule && (
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md text-xs h-full">
                          <div className="font-medium text-blue-800 dark:text-blue-200 truncate">
                            Cours
                          </div>
                          <div className="text-blue-600 dark:text-blue-300 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {slotSchedule.startTime} - {slotSchedule.endTime}
                            </div>
                            {slotSchedule.room && (
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                {slotSchedule.room}
                              </div>
                            )}
                            {slotSchedule.notes && (
                              <div className="text-xs mt-1 truncate">
                                {slotSchedule.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily View for Mobile */}
      <div className="md:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Vue journalière</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day, index) => {
                const daySchedule = getScheduleForDay(day.value);
                if (daySchedule.length === 0) return null;

                return (
                  <div key={day.value} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {day.label} {weekDates[index]?.getDate()}
                    </h3>
                    <div className="space-y-2">
                      {daySchedule.map((schedule) => (
                        <div key={schedule.id} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-slate-600" />
                            <span className="font-medium">
                              {schedule.startTime} - {schedule.endTime}
                            </span>
                          </div>
                          <div className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                            Cours
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {schedule.room && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {schedule.room}
                              </div>
                            )}
                            {schedule.notes && (
                              <div className="mt-1">{schedule.notes}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-specific actions */}
      {user?.role === 'professor' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un cours
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Modifier planning
              </Button>
              <Button variant="outline" className="justify-start">
                <Users className="h-4 w-4 mr-2" />
                Voir mes groupes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Course Modal */}
      <CreateCourseModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}