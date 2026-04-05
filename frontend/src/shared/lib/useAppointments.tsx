// import { useState } from 'react';

// export type AppointmentType = 'visa' | 'university' | 'doctor' | 'job' | 'government' | 'other';

// export type Appointment = {
//     id: string;
//     title: string;
//     type: AppointmentType;
//     date: string;
//     time: string;
//     location: string;
//     notes: string;
//     createdAt: string;
// };

// export const APPOINTMENT_TYPES: { value: AppointmentType; label: string; icon: string; color: string }[] = [
//     { value: 'visa', label: 'Visa', icon: 'airplane-outline', color: '#2e6bff' },
//     { value: 'university', label: 'University', icon: 'school-outline', color: '#06b6d4' },
//     { value: 'doctor', label: 'Doctor', icon: 'medkit-outline', color: '#22c55e' },
//     { value: 'job', label: 'Job', icon: 'briefcase-outline', color: '#8B5CF6' },
//     { value: 'government', label: 'Government', icon: 'business-outline', color: '#f59e0b' },
//     { value: 'other', label: 'Other', icon: 'calendar-outline', color: '#6b7280' },
// ];

// export function getUrgency(date: string): 'past' | 'today' | 'soon' | 'upcoming' {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const appt = new Date(date);
//     appt.setHours(0, 0, 0, 0);
//     const diffDays = Math.ceil((appt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
//     if (diffDays < 0) return 'past';
//     if (diffDays === 0) return 'today';
//     if (diffDays <= 7) return 'soon';
//     return 'upcoming';
// }

// let _appointments: Appointment[] = [];
// let _listeners: (() => void)[] = [];

// export function useAppointments() {
//     const [appointments, setAppointmentsState] = useState<Appointment[]>(_appointments);

//     const setAppointments = (updater: (prev: Appointment[]) => Appointment[]) => {
//         _appointments = updater(_appointments);
//         setAppointmentsState([..._appointments]);
//         _listeners.forEach(l => l());
//     };

//     const addAppointment = (appt: Appointment) => setAppointments(prev => [appt, ...prev]);
//     const deleteAppointment = (id: string) => setAppointments(prev => prev.filter(a => a.id !== id));

//     return { appointments, addAppointment, deleteAppointment };
// }




import { useState, useEffect } from 'react';

export type AppointmentType = 'visa' | 'university' | 'doctor' | 'job' | 'government' | 'other';

export type Appointment = {
  id: string;
  title: string;
  type: AppointmentType;
  date: string;
  time: string;
  location: string;
  notes: string;
  createdAt: string;
};

export const APPOINTMENT_TYPES: { value: AppointmentType; label: string; icon: string; color: string }[] = [
  { value: 'visa',       label: 'Visa',       icon: 'airplane-outline',  color: '#2e6bff' },
  { value: 'university', label: 'University', icon: 'school-outline',    color: '#06b6d4' },
  { value: 'doctor',     label: 'Doctor',     icon: 'medkit-outline',    color: '#22c55e' },
  { value: 'job',        label: 'Job',        icon: 'briefcase-outline', color: '#8B5CF6' },
  { value: 'government', label: 'Government', icon: 'business-outline',  color: '#f59e0b' },
  { value: 'other',      label: 'Other',      icon: 'calendar-outline',  color: '#6b7280' },
];

export function getUrgency(date: string): 'past' | 'today' | 'soon' | 'upcoming' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const appt = new Date(date);
  appt.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((appt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'past';
  if (diffDays === 0) return 'today';
  if (diffDays <= 7) return 'soon';
  return 'upcoming';
}

// ─── Global Store ─────────────────────────────────────────────────────────────
let _appointments: Appointment[] = [];
const _listeners = new Set<(appointments: Appointment[]) => void>();

function notifyAll() {
  _listeners.forEach(fn => fn([..._appointments]));
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([..._appointments]);

  useEffect(() => {
    // Subscribe
    _listeners.add(setAppointments);
    // Sync on mount in case data already exists
    setAppointments([..._appointments]);
    return () => {
      // Unsubscribe on unmount
      _listeners.delete(setAppointments);
    };
  }, []);

  const addAppointment = (appt: Appointment) => {
    _appointments = [appt, ..._appointments];
    notifyAll();
  };

  const deleteAppointment = (id: string) => {
    _appointments = _appointments.filter(a => a.id !== id);
    notifyAll();
  };

  return { appointments, addAppointment, deleteAppointment };
}