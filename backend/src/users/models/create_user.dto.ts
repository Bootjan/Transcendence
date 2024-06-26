import { User } from "./user.entity";
import { OmitType } from "@nestjs/mapped-types";

export class CreateUserDto extends OmitType(User, ["id"]) {}
