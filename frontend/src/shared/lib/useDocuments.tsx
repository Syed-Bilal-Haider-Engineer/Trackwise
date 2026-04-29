// import { useState } from 'react';

// export type DocType =
//     | 'visa'
//     | 'health-insurance'
//     | 'residency-card'
//     | 'id-card'
//     | 'room-contract'
//     | 'university-letter'
//     | 'other';

// export type Document = {
//     id: string;
//     name: string;
//     type: DocType;
//     expiryDate: string | null;
//     notes: string;
//     createdAt: string;
// };

// export const DOC_TYPES: { value: DocType; label: string; icon: string; color: string }[] = [
//     { value: 'visa', label: 'Visa', icon: 'airplane-outline', color: '#2e6bff' },
//     { value: 'health-insurance', label: 'Health Insurance', icon: 'medkit-outline', color: '#22c55e' },
//     { value: 'residency-card', label: 'Residency Card', icon: 'card-outline', color: '#8B5CF6' },
//     { value: 'id-card', label: 'ID Card', icon: 'person-circle-outline', color: '#f59e0b' },
//     { value: 'room-contract', label: 'Room Contract', icon: 'home-outline', color: '#ef4444' },
//     { value: 'university-letter', label: 'University Letter', icon: 'school-outline', color: '#06b6d4' },
//     { value: 'other', label: 'Other', icon: 'document-outline', color: '#6b7280' },
// ];

// export function getDocStatus(expiryDate: string | null): 'valid' | 'soon' | 'expired' | 'none' {
//     if (!expiryDate) return 'none';
//     const today = new Date();
//     const expiry = new Date(expiryDate);
//     const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
//     if (diffDays < 0) return 'expired';
//     if (diffDays <= 90) return 'soon';
//     return 'valid';
// }

// let _docs: Document[] = [];
// let _listeners: (() => void)[] = [];

// export function useDocuments() {
//     const [docs, setDocsState] = useState<Document[]>(_docs);

//     const setDocs = (updater: (prev: Document[]) => Document[]) => {
//         _docs = updater(_docs);
//         setDocsState([..._docs]);
//         _listeners.forEach(l => l());
//     };

//     const addDoc = (doc: Document) => setDocs(prev => [doc, ...prev]);
//     const deleteDoc = (id: string) => setDocs(prev => prev.filter(d => d.id !== id));

//     return { docs, addDoc, deleteDoc };
// }




import { useState, useEffect } from 'react';

export type DocType =
  | 'visa'
  | 'health-insurance'
  | 'residency-card'
  | 'id-card'
  | 'room-contract'
  | 'university-letter'
  | 'other';

export type Document = {
  id: string;
  name: string;
  type: DocType;
  expiryDate: string | null;
  notes: string;
  createdAt: string;
};

export const DOC_TYPES: { value: DocType; label: string; icon: string; color: string }[] = [
  { value: 'visa',              label: 'Visa',             icon: 'airplane-outline',      color: '#2e6bff' },
  { value: 'health-insurance',  label: 'Health Insurance', icon: 'medkit-outline',        color: '#22c55e' },
  { value: 'residency-card',    label: 'Residency Card',   icon: 'card-outline',          color: '#8B5CF6' },
  { value: 'id-card',           label: 'ID Card',          icon: 'person-circle-outline', color: '#f59e0b' },
  { value: 'room-contract',     label: 'Room Contract',    icon: 'home-outline',          color: '#ef4444' },
  { value: 'university-letter', label: 'University Letter',icon: 'school-outline',        color: '#06b6d4' },
  { value: 'other',             label: 'Other',            icon: 'document-outline',      color: '#6b7280' },
];

export function getDocStatus(expiryDate: string | null): 'valid' | 'soon' | 'expired' | 'none' {
  if (!expiryDate) return 'none';
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'expired';
  if (diffDays <= 90) return 'soon';
  return 'valid';
}

// ─── Global Store ─────────────────────────────────────────────────────────────
let _docs: Document[] = [];
const _listeners = new Set<(docs: Document[]) => void>();

function notifyAll() {
  _listeners.forEach(fn => fn([..._docs]));
}

export function useDocuments() {
  const [docs, setDocs] = useState<Document[]>([..._docs]);

  useEffect(() => {
    // Subscribe
    _listeners.add(setDocs);
    // Sync on mount in case data already exists
    setDocs([..._docs]);
    return () => {
      // Unsubscribe on unmount
      _listeners.delete(setDocs);
    };
  }, []);

  const addDoc = (doc: Document) => {
    _docs = [doc, ..._docs];
    notifyAll();
  };

  const deleteDoc = (id: string) => {
    _docs = _docs.filter(d => d.id !== id);
    notifyAll();
  };

  return { docs, addDoc, deleteDoc };
}