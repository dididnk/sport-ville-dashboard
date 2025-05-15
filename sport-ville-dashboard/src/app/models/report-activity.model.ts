/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ReportActivity {
  id: string;
  activityId: string;
  reporterUid: string;
  title: string;
  comment: string;
  reportedAt: Date;
}

export const reportActivityFromFirestore = (data: any): ReportActivity => {
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

export const reportActivityToFirestore = (report: ReportActivity): any => {
  return {
    id: report.id,
    activityId: report.activityId,
    reporterUid: report.reporterUid,
    title: report.title,
    comment: report.comment,
    reportedAt: report.reportedAt.toISOString(),
  };
};
