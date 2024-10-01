import {Role} from "../enums/Role";

export interface UserDto {
  username: string;
  password: string;
  email: string;
  role: Role;
  profilePicture: string;
}
