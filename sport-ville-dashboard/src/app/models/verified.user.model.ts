/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentSnapshot, Timestamp } from 'firebase/firestore';
import { VerificationStatusEnum } from '../enums/verification-status.enum';

export class VerifiedUserModel {
  uid: string;
  userId: string;
  verifiedAt?: Timestamp | null;
  documentUrl?: string | null;
  verifiedBy?: string | null;
  status: VerificationStatusEnum;
  specialField?: string | null;

  constructor(params: {
    uid: string;
    userId: string;
    verifiedAt?: Timestamp | null;
    documentUrl?: string | null;
    verifiedBy?: string | null;
    status?: VerificationStatusEnum;
    specialField?: string | null;
  }) {
    this.uid = params.uid;
    this.userId = params.userId;
    this.verifiedAt = params.verifiedAt ?? null;
    this.documentUrl = params.documentUrl ?? null;
    this.verifiedBy = params.verifiedBy ?? null;
    this.status = params.status ?? VerificationStatusEnum.None;
    this.specialField = params.specialField ?? null;
  }

  static fromJson(json: any): VerifiedUserModel {
    return new VerifiedUserModel({
      uid: json.uid as string,
      userId: json.userId as string,
      verifiedAt: json.verifiedAt ?? null,
      documentUrl: json.documentUrl ?? null,
      verifiedBy: json.verifiedBy ?? null,
      status: json.status ?? VerificationStatusEnum.None,
      specialField: json.specialField ?? null,
    });
  }

  toJson(): any {
    return {
      uid: this.uid,
      userId: this.userId,
      verifiedAt: this.verifiedAt,
      documentUrl: this.documentUrl,
      verifiedBy: this.verifiedBy,
      specialField: this.specialField,
      status: this.status,
    };
  }

  static fromFirestore(doc: DocumentSnapshot<any>): VerifiedUserModel {
    const data = doc.data();
    if (!data) {
      throw new Error('Document data is undefined');
    }

    return new VerifiedUserModel({
      uid: doc.id,
      userId: data.userId ?? '',
      verifiedAt: data.verifiedAt ?? null,
      documentUrl: data.documentUrl ?? null,
      verifiedBy: data.verifiedBy ?? null,
      status: data.status ?? VerificationStatusEnum.None,
      specialField: data.specialField ?? null,
    });
  }
}
