/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timestamp } from 'firebase/firestore';
import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { AddressModel } from './address.model';
import { Price } from './price.model';
import { Sport } from './sport.model';

export interface ActivityTime {
  hour: number;
  minute: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  date: Timestamp | Date;
  duration: ActivityTime;
  address: AddressModel;
  maxParticipants: number;
  participants: string[];
  status: ActivityStatusEnum;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date | null;
  sport: Sport;
  photoUrl?: string | null;
  moreInfo?: string | null;
  price?: Price | null;
}

// Helper type for Firebase document data
export type ActivityDocumentData = Omit<Activity, 'id'>;

// Helper functions for Firebase conversions
export const activityToFirestore = (activity: Activity): ActivityDocumentData => {
  return {
    ...activity,
    date: activity.date instanceof Date ? Timestamp.fromDate(activity.date) : activity.date,
    createdAt: activity.createdAt instanceof Date ? Timestamp.fromDate(activity.createdAt) : activity.createdAt,
    updatedAt: activity.updatedAt 
      ? (activity.updatedAt instanceof Date ? Timestamp.fromDate(activity.updatedAt) : activity.updatedAt)
      : null,
  };
};

export const activityFromFirestore = (id: string, data: any): Activity => {
  return {
    id,
    title: data.title,
    description: data.description,
    creatorId: data.creatorId,
    date: data.date?.toDate() ?? new Date(),
    duration: parseActivityTime(data.duration),
    address: data.address,
    maxParticipants: data.maxParticipants,
    participants: data.participants || [],
    status: data.status,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    updatedAt: data.updatedAt?.toDate() ?? null,
    sport: data.sport,
    photoUrl: data.photoUrl || null,
    moreInfo: data.moreInfo || null,
    price: data.price || null,
  };
};

// Helper function to parse time (assuming format "HH:mm")
const parseActivityTime = (timeStr: string): ActivityTime => {
  const [hour, minute] = timeStr.split(':').map(Number);
  return { hour, minute };
};