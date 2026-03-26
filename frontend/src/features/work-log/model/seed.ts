import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageKeys } from "@/shared/config/storageKeys";
import type { WorkEntry } from "@/entities/work-entry/types";
import { createId } from "@/shared/lib/uuid";
import { isoDate } from "@/shared/lib/date";

export async function seedIfNeeded(): Promise<void> {
  const seeded = await AsyncStorage.getItem(storageKeys.seeded);
  if (seeded === "1") return;

  const now = new Date();
  const today = isoDate(now);

  const d1 = new Date(now);
  d1.setDate(d1.getDate() - 1);
  const d2 = new Date(now);
  d2.setDate(d2.getDate() - 3);

  const sample: WorkEntry[] = [
    {
      id: createId(),
      jobTitle: "Waiter",
      jobType: "part-time",
      date: today,
      startTime: "17:00",
      endTime: "21:00",
      createdAt: new Date().toISOString(),
    },
    {
      id: createId(),
      jobTitle: "Cleaner",
      jobType: "mini-job",
      date: isoDate(d1),
      startTime: "09:00",
      endTime: "12:00",
      createdAt: new Date().toISOString(),
    },
    {
      id: createId(),
      jobTitle: "Software Engineer",
      jobType: "part-time",
      date: isoDate(d2),
      startTime: "10:00",
      endTime: "16:30",
      createdAt: new Date().toISOString(),
    },
  ];

  await AsyncStorage.setItem(storageKeys.workEntries, JSON.stringify(sample));
  await AsyncStorage.setItem(storageKeys.seeded, "1");
}

