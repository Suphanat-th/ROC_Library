export interface StoneClasses {
  name: string;
  position: "upper" | "middle" | "lower" | "garment" | "";
  stone: StoneClasses[];
  version: number;
  image: string;
  description: DescriptionDetail | null;
}
export interface DescriptionDetail {
  upper: string[];
  middle: string[];
  lower: string[];
  default: string[];
}
export interface JobClass {
  name: string;
  class: string;
  image: string;
  Stone: StoneClasses[];
}
