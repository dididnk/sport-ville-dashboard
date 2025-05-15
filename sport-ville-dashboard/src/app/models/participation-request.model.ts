/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timestamp } from 'firebase/firestore';
import { RequestStatusEnum, requestStatusFromValue } from '../enums/request-status.enum';

export interface ParticipationRequestModel {
  id: string;
  activityId: string;
  requesterId: string;
  creatorId: string;
  status: RequestStatusEnum;
  requestDate: Date;
  isNotificationRead: boolean;
}

// 🔁 Firestore → Local Model
export const participationRequestFromFirestore = (data: any): ParticipationRequestModel => {
  const rawDate = data.requestDate;

  let parsedDate: Date;
  if (rawDate instanceof Timestamp) {
    parsedDate = rawDate.toDate();
  } else if (typeof rawDate === 'string') {
    parsedDate = new Date(rawDate);
  } else {
    throw new Error(`Invalid date format for 'requestDate': ${rawDate}`);
  }

  return {
    id: data.id,
    activityId: data.activityId,
    requesterId: data.requesterId,
    creatorId: data.creatorId,
    status: requestStatusFromValue(data.status),
    requestDate: parsedDate,
    isNotificationRead: data.isNotificationRead ?? false,
  };
};

// 🔁 Local Model → Firestore
export const participationRequestToFirestore = (request: ParticipationRequestModel): any => {
  return {
    id: request.id,
    activityId: request.activityId,
    requesterId: request.requesterId,
    creatorId: request.creatorId,
    status: request.status,
    requestDate: Timestamp.fromDate(request.requestDate),
    isNotificationRead: request.isNotificationRead,
  };
};
