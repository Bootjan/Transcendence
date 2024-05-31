import { UserDto } from "./user.dto";

export type CreateUserDto = Omit<UserDto, "id">;
