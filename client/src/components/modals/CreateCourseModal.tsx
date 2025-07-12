import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useGroups } from '@/hooks/useGroups';
import { insertScheduleSchema, type InsertSchedule } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' }
];

const SUBJECTS = [
  { value: 'mathematics', label: 'Mathématiques' },
  { value: 'physics', label: 'Physique' },
  { value: 'chemistry', label: 'Chimie' },
  { value: 'biology', label: 'Biologie' },
  { value: 'french', label: 'Français' },
  { value: 'english', label: 'Anglais' },
  { value: 'history', label: 'Histoire' },
  { value: 'geography', label: 'Géographie' },
  { value: 'philosophy', label: 'Philosophie' },
  { value: 'economics', label: 'Économie' },
  { value: 'computer_science', label: 'Informatique' },
  { value: 'art', label: 'Arts plastiques' },
  { value: 'music', label: 'Musique' },
  { value: 'physical_education', label: 'EPS' }
];

export function CreateCourseModal({ isOpen, onClose }: CreateCourseModalProps) {
  const { user } = useAuth();
  const { data: groups = [] } = useGroups();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InsertSchedule>({
    resolver: zodResolver(insertScheduleSchema),
    defaultValues: {
      groupId: '',
      subjectId: '',
      professorId: user?.id || '',
      dayOfWeek: 1,
      startTime: '',
      endTime: '',
      room: '',
      notes: '',
      isActive: true,
    },
  });

  const onSubmit = async (data: InsertSchedule) => {
    try {
      setIsLoading(true);
      
      // First, find or create the subject
      const selectedSubject = SUBJECTS.find(s => s.value === data.subjectId);
      let subjectId = data.subjectId;
      
      // If it's a known subject, try to find it in the database or create it
      if (selectedSubject) {
        try {
          const response = await apiRequest('GET', `/api/subjects`);
          const subjects = await response.json();
          
          let existingSubject = subjects.find((s: any) => s.name.toLowerCase() === selectedSubject.label.toLowerCase());
          
          if (!existingSubject) {
            // Create the subject
            const createResponse = await apiRequest('POST', '/api/subjects', {
              name: selectedSubject.label,
              description: `Cours de ${selectedSubject.label}`,
              color: '#3B82F6'
            });
            existingSubject = await createResponse.json();
          }
          
          subjectId = existingSubject.id;
        } catch (error) {
          console.error('Error handling subject:', error);
          toast({
            title: "Erreur",
            description: "Erreur lors de la création de la matière.",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Create the schedule entry
      const scheduleData = {
        ...data,
        subjectId,
        professorId: user?.id || '',
      };
      
      const response = await apiRequest('POST', '/api/schedules', scheduleData);
      
      if (response.ok) {
        toast({
          title: "Cours créé",
          description: "Le cours a été ajouté au planning avec succès.",
        });
        
        // Invalidate schedules cache
        queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
        
        onClose();
        form.reset();
      } else {
        throw new Error('Failed to create schedule');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du cours.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un Nouveau Cours</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Groupe</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un groupe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name} ({group.academicYear})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matière</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une matière" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SUBJECTS.map((subject) => (
                        <SelectItem key={subject.value} value={subject.value}>
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jour de la semaine</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un jour" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de début</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de fin</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salle (optionnel)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ex: Salle 101" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Informations complémentaires..." disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Création...' : 'Créer le cours'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}