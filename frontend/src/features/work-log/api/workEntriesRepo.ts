import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageKeys } from "@/shared/config/storageKeys";
import type { WorkEntry } from "@/entities/work-entry/types";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function getWorkEntries(): Promise<WorkEntry[]> {
  const raw = await AsyncStorage.getItem(storageKeys.workEntries);
  const parsed = safeParse<WorkEntry[]>(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export async function setWorkEntries(entries: WorkEntry[]): Promise<void> {
  await AsyncStorage.setItem(storageKeys.workEntries, JSON.stringify(entries));
}

export async function addWorkEntry(entry: WorkEntry): Promise<void> {
  const entries = await getWorkEntries();
  await setWorkEntries([entry, ...entries]);
}

