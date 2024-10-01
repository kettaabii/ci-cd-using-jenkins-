import {Role} from "../enums/Role";

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  role: Role;
  profilePicture?: string;
}
