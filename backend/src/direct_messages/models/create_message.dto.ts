import { DirectMessage } from "./direct_message.entity";
import { OmitType } from "@nestjs/mapped-types";

export class CreateMessageDto extends OmitType(DirectMessage, ["id"]) {}
