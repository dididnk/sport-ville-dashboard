/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timestamp } from 'firebase/firestore';

export interface Event {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  dateTime: Date;
  location: string;
  maxParticipants: number;
  participants: string[];
  createdAt: Date;
  updatedAt?: Date;
  sportType?: string;
  price?: number;
}

// 🔁 Convert Firestore data to local Event model
export const eventFromFirestore = (data: any): Event => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    organizerId: data.organizerId,
    dateTime: data.dateTime instanceof Timestamp
      ? data.dateTime.toDate()
      : new Date(data.dateTime),
    location: data.location,
    maxParticipants: data.maxParticipants,
    participants: Array.isArray(data.participants)
      ? data.participants
      : [],
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate()
      : new Date(data.createdAt),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate()
      : data.updatedAt ? new Date(data.updatedAt) : undefined,
    sportType: data.sportType,
    price: typeof data.price === 'number' ? data.price : undefined,
  };
};

// 🔁 Convert local Event model to Firestore format
export const eventToFirestore = (event: Event): any => {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    organizerId: event.organizerId,
    dateTime: Timestamp.fromDate(event.dateTime),
    location: event.location,
    maxParticipants: event.maxParticipants,
    participants: event.participants,
    createdAt: Timestamp.fromDate(event.createdAt),
    updatedAt: event.updatedAt ? Timestamp.fromDate(event.updatedAt) : undefined,
    sportType: event.sportType,
    price: event.price,
  };
};
