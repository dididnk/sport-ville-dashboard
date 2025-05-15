
export enum VerificationStatusEnum {
    None = 0,
    Pending = 1,
    Accepted = 2,
    Rejected = 3
}

export const verificationStatusFromValue = (value: number): VerificationStatusEnum => {
  switch (value) {
    case 1:
      return VerificationStatusEnum.Pending;
    case 2:
      return VerificationStatusEnum.Accepted;
    case 3:
      return VerificationStatusEnum.Rejected;
    default:
      return VerificationStatusEnum.None;
  }
};
