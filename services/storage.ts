
import { MessData } from '../types';
import { STORAGE_KEY } from '../constants';

export const saveMessData = (data: MessData[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadMessData = (): MessData[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse mess data", e);
    return [];
  }
};

export const getMonthYearString = (date: Date = new Date()): string => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = months[date.getMonth()];
  const y = date.getFullYear().toString().slice(-2);
  return `${m}-${y}`;
};
