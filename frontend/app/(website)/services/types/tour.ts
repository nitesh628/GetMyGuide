export interface TourData {
  id: string;
  name: string;
  description: string;
  location: string;
  images: File[];
  rating?: number;
}
