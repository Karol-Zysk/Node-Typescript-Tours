export enum Difficulty {
  easy,
  medium,
  difficult,
}
export interface Location {
  type: 'Point';
  coordinates: [number, number];
  address: string;
  description: string;
  day?: number;
}

export interface ITourModel {
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: Difficulty;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  createdAt: Date;
  startDates: Date[];
  secretTour: boolean;
  startLocation: {
    coordinates: number[];
    address: string;
    description: string;
  };
  locations: {
    coordinates: number[];
    address: string;
    description: string;
    day: number;
  };
}
