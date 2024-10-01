import { Priority } from "../enums/Priority";
import { Status } from "../enums/Status";

export interface Task {
  id: number;
  title: string;
  type: string;
  startDate: Date;
  endDate: Date;
  description: string;
  priority: Priority;
  status: Status;
  projectId: number;
  resourceIds: string;
}
