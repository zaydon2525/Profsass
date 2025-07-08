import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Material, InsertMaterial } from '@shared/schema';

export function useMaterials() {
  const queryClient = useQueryClient();

  const materialsQuery = useQuery({
    queryKey: ['/api/materials'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/materials');
      return response.json() as Promise<Material[]>;
    },
  });

  const createMaterial = useMutation({
    mutationFn: async (materialData: InsertMaterial) => {
      const response = await apiRequest('POST', '/api/materials', materialData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
    },
  });

  const deleteMaterial = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/materials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
    },
  });

  return {
    data: materialsQuery.data,
    isLoading: materialsQuery.isLoading,
    error: materialsQuery.error,
    createMaterial,
    deleteMaterial,
  };
}
