/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Sport {
  id: number;
  nameEn: string;
  nameFr: string;
  icon: string;
}

export const sportFromFirestore = (data: any): Sport => {
  return {
    id: typeof data.id === 'number' ? data.id : Number(data.id) || 0,
    nameEn: data.name_en ?? '',
    nameFr: data.name_fr ?? '',
    icon: data.icon ?? '',
  };
};

export const sportToFirestore = (sport: Sport): any => {
  return {
    id: sport.id,
    name_en: sport.nameEn,
    name_fr: sport.nameFr,
    icon: sport.icon,
  };
};
