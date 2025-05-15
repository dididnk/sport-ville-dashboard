/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timestamp } from 'firebase/firestore';

export interface Attendance {
  id: string;
  activityId: string;
  participants: string[];
  attendances: string[];
  updatedAt: Date;
}

// 🔁 Convert Firestore data to local model
export const attendanceFromFirestore = (data: any): Attendance => {
  return {
    id: data.id,
    activityId: data.activityId,
    participants: Array.isArray(data.participants)
      ? data.participants
      : [],
    attendances: Array.isArray(data.attendances)
      ? data.attendances
      : [],
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate()
      : new Date(data.updatedAt),
  };
};

// 🔁 Convert local model to Firestore format
export const attendanceToFirestore = (attendance: Attendance): any => {
  return {
    id: attendance.id,
    activityId: attendance.activityId,
    participants: attendance.participants,
    attendances: attendance.attendances,
    updatedAt: Timestamp.fromDate(attendance.updatedAt),
  };
};

// ✨ Utility to copy and override values
export const copyAttendance = (
  attendance: Attendance,
  overrides: Partial<Attendance>
): Attendance => {
  return {
    ...attendance,
    ...overrides,
  };
};
