import { Type } from "../enums/Type";

export interface ResourceDto {
  title: string;
  provider: string;
  acquisitionDate: Date;
  picture: string;
  quantity: string;
  availability: boolean;
  type: Type;
}
