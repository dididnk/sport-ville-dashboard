/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Price {
  cost: number;
  currency: string;
}

// Firestore → Local model
export const priceFromFirestore = (data: any): Price => {
  return {
    cost: typeof data.cost === 'number' ? data.cost : parseFloat(data.cost) || 0,
    currency: data.currency ?? '',
  };
};

// Local model → Firestore
export const priceToFirestore = (price: Price): any => {
  return {
    cost: price.cost,
    currency: price.currency,
  };
};

// Copy with update helper
export const copyPrice = (price: Price, updates: Partial<Price>): Price => {
  return {
    cost: updates.cost ?? price.cost,
    currency: updates.currency ?? price.currency,
  };
};
