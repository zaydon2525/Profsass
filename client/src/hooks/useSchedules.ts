import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Schedule, InsertSchedule } from '@shared/schema';

export function useSchedules(groupId?: string, professorId?: string) {
  const queryClient = useQueryClient();

  const queryKey = groupId ? ['/api/schedules', { groupId }] : 
                   professorId ? ['/api/schedules', { professorId }] : 
                   ['/api/schedules'];

  const schedulesQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (groupId) params.append('groupId', groupId);
      if (professorId) params.append('professorId', professorId);
      
      const url = `/api/schedules${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiRequest('GET', url);
      return response.json() as Promise<Schedule[]>;
    },
  });

  const createSchedule = useMutation({
    mutationFn: async (scheduleData: InsertSchedule) => {
      const response = await apiRequest('POST', '/api/schedules', scheduleData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
    },
  });

  const updateSchedule = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Schedule> }) => {
      const response = await apiRequest('PUT', `/api/schedules/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
    },
  });

  const deleteSchedule = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/schedules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
    },
  });

  return {
    data: schedulesQuery.data,
    isLoading: schedulesQuery.isLoading,
    error: schedulesQuery.error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
}