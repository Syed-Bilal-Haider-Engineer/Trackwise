import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addWorkEntry, deleteWorkEntry, getWorkEntries } from '../api/workEntriesRepo';
import type { WorkEntry } from '@/entities/work-entry/types';

export const workEntriesKeys = {
  all: ['workEntries'] as const,
};

export function useWorkEntries() {
  return useQuery({
    queryKey: workEntriesKeys.all,
    queryFn: getWorkEntries,
  });
}

export function useAddWorkEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: WorkEntry) => {
      await addWorkEntry(entry);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: workEntriesKeys.all });
    },
  });
}

export function useDeleteWorkEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteWorkEntry(id);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: workEntriesKeys.all });
    },
  });
}
