import { Type } from "../enums/Type";

export interface Resource {
  id: number;
  title: string;
  provider: string;
  acquisitionDate: Date;
  picture: string;
  quantity: string;
  availability: boolean;
  type: Type;
}
