/* eslint-disable @typescript-eslint/no-explicit-any */
import { GeoPoint } from 'firebase/firestore';

export interface AddressDetails {
  [key: string]: string | undefined; // Flexible structure for address components
  house_number?: string;
  road?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

export interface AddressModel {
  displayName: string;
  location: GeoPoint; // Using Firebase's GeoPoint for coordinates
  addressDetails: AddressDetails;
}

// Helper functions for Firebase conversions
export const addressToFirestore = (address: AddressModel): any => {
  return {
    display_name: address.displayName,
    location: address.location, // GeoPoint is natively supported by Firestore
    address: address.addressDetails,
  };
};

export const addressFromFirestore = (data: any): AddressModel => {
  return {
    displayName: data.display_name || '',
    location: data.location instanceof GeoPoint 
      ? data.location 
      : new GeoPoint(parseFloat(data.lat || '0'), parseFloat(data.lon || '0')),
    addressDetails: typeof data.address === 'object' && data.address !== null
      ? data.address as AddressDetails
      : {},
  };
};

// Helper function to create a new Address
export const createAddress = (
  displayName: string,
  latitude: number,
  longitude: number,
  details: AddressDetails
): AddressModel => {
  return {
    displayName,
    location: new GeoPoint(latitude, longitude),
    addressDetails: details,
  };
};

// Utility function to format address as string
export const formatAddress = (address: AddressModel): string => {
  return address.displayName;
};