import {Status} from "../enums/Status";
import {Priority} from "../enums/Priority";


export interface TaskDto {
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
  priority: Priority;
  status: Status;
  projectId: number;
  rIds: number[];
}
