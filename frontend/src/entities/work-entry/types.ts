export type JobType = "mini-job" | "part-time" | "full-time";

export type WorkEntry = {
  id: string;
  jobTitle: string;
  jobType: JobType;
  /**
   * ISO date string, e.g. 2026-03-26
   */
  date: string;
  /**
   * 24h time, e.g. 09:30
   */
  startTime: string;
  /**
   * 24h time, e.g. 13:00
   */
  endTime: string;
  createdAt: string;
};

export type DayType = "half" | "full";

