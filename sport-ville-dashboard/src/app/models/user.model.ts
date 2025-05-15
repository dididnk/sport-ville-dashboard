/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentSnapshot, Timestamp } from 'firebase/firestore';
import { UserTypeEnum } from '../enums/user-type.enum';
import { AddressModel } from './address.model';
import { AuthTypeEnum } from '../enums/auth-type.enum';
export class UserModel {
  uid: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  role: UserTypeEnum;
  createdAt: Date;
  updatedAt?: Date | null;
  address?: AddressModel | null;
  birthdate?: Date | null;
  activitiesCreated: string[];
  activitiesJoined: string[];
  rating: number;
  photoUrl?: string | null;
  bio?: string | null;
  authType: AuthTypeEnum;

  constructor(params: {
    uid: string;
    name: string;
    email: string;
    phoneNumber?: string | null;
    role: UserTypeEnum;
    createdAt: Date;
    updatedAt?: Date | null;
    address?: AddressModel | null;
    birthdate?: Date | null;
    activitiesCreated: string[];
    activitiesJoined: string[];
    rating: number;
    photoUrl?: string | null;
    bio?: string | null;
    authType: AuthTypeEnum;
  }) {
    this.uid = params.uid;
    this.name = params.name;
    this.email = params.email;
    this.phoneNumber = params.phoneNumber ?? null;
    this.role = params.role;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt ?? null;
    this.address = params.address ?? null;
    this.birthdate = params.birthdate ?? null;
    this.activitiesCreated = params.activitiesCreated ?? [];
    this.activitiesJoined = params.activitiesJoined ?? [];
    this.rating = params.rating;
    this.photoUrl = params.photoUrl ?? null;
    this.bio = params.bio ?? null;
    this.authType = params.authType;
  }

  static fromJson(json: any): UserModel {
    return new UserModel({
      uid: json.uid as string,
      name: json.name as string,
      email: json.email as string,
      phoneNumber: json.phoneNumber ?? null,
      role: json.role,
      createdAt: parseDateTime(json.createdAt),
      updatedAt: json.updatedAt ? parseDateTime(json.updatedAt) : null,
      address: json.address ?? json.address,
      birthdate: json.birthdate ? parseDateTime(json.birthdate) : null,
      activitiesCreated: Array.isArray(json.activitiesCreated) ? json.activitiesCreated : [],
      activitiesJoined: Array.isArray(json.activitiesJoined) ? json.activitiesJoined : [],
      rating: typeof json.rating === 'number' ? json.rating : 0,
      photoUrl: json.photoUrl ?? null,
      bio: json.bio ?? null,
      authType: json.authType,
    });
  }

  toJson(): any {
    return {
      uid: this.uid,
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      role: this.role,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      address: this.address ?? "",
      birthdate: this.birthdate ? this.birthdate.toISOString() : null,
      activitiesCreated: this.activitiesCreated,
      activitiesJoined: this.activitiesJoined,
      rating: this.rating,
      photoUrl: this.photoUrl,
      bio: this.bio,
      authType: this.authType,
    };
  }

  static fromFirestore(doc: DocumentSnapshot<any>): UserModel {
    const data = doc.data();
    if (!data) {
      throw new Error('Document data is undefined');
    }

    return new UserModel({
      uid: doc.id,
      name: data.name ?? '',
      email: data.email ?? '',
      phoneNumber: data.phoneNumber ?? null,
      role: data.role,
      createdAt: parseDateTime(data.createdAt),
      updatedAt: data.updatedAt ? parseDateTime(data.updatedAt) : null,
      address: data.address ?? data.address,
      birthdate: data.birthdate ? parseDateTime(data.birthdate) : null,
      activitiesCreated: Array.isArray(data.activitiesCreated) ? data.activitiesCreated : [],
      activitiesJoined: Array.isArray(data.activitiesJoined) ? data.activitiesJoined : [],
      rating: typeof data.rating === 'number' ? data.rating : 0,
      photoUrl: data.photoUrl ?? null,
      bio: data.bio ?? null,
      authType: data.authType,
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
