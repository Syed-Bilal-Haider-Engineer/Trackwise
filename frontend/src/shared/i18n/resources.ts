export const resources = {
  en: {
    translation: {
      appName: 'TrackWise',
      tabs: {
        dashboard: 'Dashboard',
        addWork: 'Add',
        history: 'History',
      },
      dashboard: {
        today: 'Today',
        weekly: 'This week',
        monthly: 'This month',
        yearly: 'Yearly limit',
        remainingDays: 'Remaining',
        completedToday: "Today's work completed",
        closeToLimit: 'You are close to your legal work limit',
        exceededLimit: 'You exceeded the allowed limit',
        dontForgetToday: "Don't forget to add today's work",
      },
      workEntry: {
        addTitle: 'Add Work Entry',
        jobTitle: 'Job title',
        jobType: 'Job type',
        date: 'Date',
        startTime: 'Start time',
        endTime: 'End time',
        save: 'Save Entry',
      },
      jobType: {
        miniJob: 'Mini-job',
        partTime: 'Part-time',
        fullTime: 'Full-time',
      },
      history: {
        title: 'Work History',
        empty: 'No entries yet. Add your first work entry!',
      },
      toast: {
        added: 'Work entry added successfully',
        deleted: 'Entry deleted',
      },
      legal: {
        halfDay: 'Half day',
        fullDay: 'Full day',
      },
    },
  },
  de: {
    translation: {
      appName: 'TrackWise',
      tabs: {
        dashboard: 'Übersicht',
        addWork: 'Hinzufügen',
        history: 'Verlauf',
      },
      dashboard: {
        today: 'Heute',
        weekly: 'Diese Woche',
        monthly: 'Diesen Monat',
        yearly: 'Jahreslimit',
        remainingDays: 'Verbleibend',
        completedToday: 'Heutige Arbeit erledigt',
        closeToLimit: 'Du bist nahe am gesetzlichen Arbeitslimit',
        exceededLimit: 'Du hast das erlaubte Limit überschritten',
        dontForgetToday: 'Vergiss nicht, die heutige Arbeit einzutragen',
      },
      workEntry: {
        addTitle: 'Arbeitseintrag hinzufügen',
        jobTitle: 'Jobtitel',
        jobType: 'Jobart',
        date: 'Datum',
        startTime: 'Startzeit',
        endTime: 'Endzeit',
        save: 'Speichern',
      },
      jobType: {
        miniJob: 'Minijob',
        partTime: 'Teilzeit',
        fullTime: 'Vollzeit',
      },
      history: {
        title: 'Arbeitsverlauf',
        empty: 'Noch keine Einträge.',
      },
      toast: {
        added: 'Arbeitseintrag erfolgreich hinzugefügt',
        deleted: 'Eintrag gelöscht',
      },
      legal: {
        halfDay: 'Halber Tag',
        fullDay: 'Ganzer Tag',
      },
    },
  },
} as const;
