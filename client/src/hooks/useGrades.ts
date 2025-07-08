import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Grade, InsertGrade } from '@shared/schema';

export function useGrades() {
  const queryClient = useQueryClient();

  const gradesQuery = useQuery({
    queryKey: ['/api/grades'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/grades');
      return response.json() as Promise<Grade[]>;
    },
  });

  const createGrade = useMutation({
    mutationFn: async (gradeData: InsertGrade) => {
      const response = await apiRequest('POST', '/api/grades', gradeData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/grades'] });
    },
  });

  const updateGrade = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Grade> }) => {
      const response = await apiRequest('PUT', `/api/grades/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/grades'] });
    },
  });

  const deleteGrade = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/grades/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/grades'] });
    },
  });

  return {
    data: gradesQuery.data,
    isLoading: gradesQuery.isLoading,
    error: gradesQuery.error,
    createGrade,
    updateGrade,
    deleteGrade,
  };
}
