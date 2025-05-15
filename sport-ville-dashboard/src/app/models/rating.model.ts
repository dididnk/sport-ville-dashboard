/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentSnapshot, Timestamp } from 'firebase/firestore';

export class RatingModel {
  id: string;
  activityId: string;
  participantId: string;
  creatorId: string;
  rating: number;
  createdAt: Date;

  constructor(params: {
    id: string;
    activityId: string;
    participantId: string;
    creatorId: string;
    rating: number;
    createdAt: Date;
  }) {
    this.id = params.id;
    this.activityId = params.activityId;
    this.participantId = params.participantId;
    this.creatorId = params.creatorId;
    this.rating = params.rating;
    this.createdAt = params.createdAt;
  }

  static fromJson(json: any): RatingModel {
    return new RatingModel({
      id: json.id,
      activityId: json.activityId,
      participantId: json.participantId,
      creatorId: json.creatorId,
      rating: Number(json.rating),
      createdAt: parseDateTime(json.createdAt),
    });
  }

  toJson(): any {
    return {
      id: this.id,
      activityId: this.activityId,
      participantId: this.participantId,
      creatorId: this.creatorId,
      rating: this.rating,
      createdAt: Timestamp.fromDate(this.createdAt),
    };
  }

  static fromFirestore(doc: DocumentSnapshot<any>): RatingModel {
    const data = doc.data();
    if (!data) {
      throw new Error('Document data is undefined');
    }
    return new RatingModel({
      id: doc.id,
      activityId: data.activityId ?? '',
      participantId: data.participantId ?? '',
      creatorId: data.creatorId ?? '',
      rating: typeof data.rating === 'number' ? data.rating : 0,
      createdAt: data.createdAt ? parseDateTime(data.createdAt) : new Date(),
    });
  }

  static empty(): RatingModel {
    return new RatingModel({
      id: '',
      activityId: '',
      participantId: '',
      creatorId: '',
      rating: 0,
      createdAt: new Date(),
    });
  }
}

// Helper function to parse Firestore Timestamp or ISO string to Date
function parseDateTime(value: any): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  } else if (typeof value === 'string') {
    return new Date(value);
  } else if (value instanceof Date) {
    return value;
  } else {
    return new Date();
  }
}
