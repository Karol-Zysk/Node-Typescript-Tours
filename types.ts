export type TourType = {
  startLocation: {
    description: string;
    type: string;
    coordinates: number[];
    address: string;
  };
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[];
  startDates: string[];
  _id: string;
  name: string;
};
