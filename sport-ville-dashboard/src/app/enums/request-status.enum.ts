export enum RequestStatusEnum {
    None = 0,
    Pending = 1,
    Accepted = 2,
    Rejected = 3
}

export const requestStatusFromValue = (value: number): RequestStatusEnum => {
  switch (value) {
    case 1:
      return RequestStatusEnum.Pending;
    case 2:
      return RequestStatusEnum.Accepted;
    case 3:
      return RequestStatusEnum.Rejected;
    default:
      return RequestStatusEnum.None;
  }
};
