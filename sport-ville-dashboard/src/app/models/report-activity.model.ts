/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ReportActivityModel {
  id: string;
  activityId: string;
  reporterUid: string;
  title: string;
  comment: string;
  reportedAt: Date;
}

export const reportActivityFromFirestore = (data: any): ReportActivityModel => {
  return {
    id: data.id ?? '',
    activityId: data.activityId ?? '',
    reporterUid: data.reporterUid ?? '',
    title: data.title ?? '',
    comment: data.comment ?? '',
    reportedAt: data.reportedAt instanceof Date
      ? data.reportedAt
      : new Date(data.reportedAt ?? Date.now()),
  };
};

export const reportActivityToFirestore = (report: ReportActivityModel): any => {
  return {
    id: report.id,
    activityId: report.activityId,
    reporterUid: report.reporterUid,
    title: report.title,
    comment: report.comment,
    reportedAt: report.reportedAt.toISOString(),
  };
};
