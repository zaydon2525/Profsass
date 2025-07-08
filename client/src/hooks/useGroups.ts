import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Group, InsertGroup } from '@shared/schema';

export function useGroups() {
  const queryClient = useQueryClient();

  const groupsQuery = useQuery({
    queryKey: ['/api/groups'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/groups');
      return response.json() as Promise<Group[]>;
    },
  });

  const createGroup = useMutation({
    mutationFn: async (groupData: InsertGroup) => {
      const response = await apiRequest('POST', '/api/groups', groupData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/groups'] });
    },
  });

  const updateGroup = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Group> }) => {
      const response = await apiRequest('PUT', `/api/groups/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/groups'] });
    },
  });

  const deleteGroup = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/groups/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/groups'] });
    },
  });

  return {
    data: groupsQuery.data,
    isLoading: groupsQuery.isLoading,
    error: groupsQuery.error,
    createGroup,
    updateGroup,
    deleteGroup,
  };
}
