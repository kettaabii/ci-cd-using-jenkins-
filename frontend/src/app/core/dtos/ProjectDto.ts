import { Status } from "../enums/Status";

export interface ProjectDto {
  name: string;
  geolocation: string;
  dateStart: Date;
  dateEnd: Date;
  status: Status;
  description: string;
  room: number;
  bath: number;
  garage: number;
  terrace: number;
  wallMaterial: string;
  foundationType: string;
  roofingType: string;
  areaSize: number;
  budget: number;
  planFloor: string;
  picture: string;
}
