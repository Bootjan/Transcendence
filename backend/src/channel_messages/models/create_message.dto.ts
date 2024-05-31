import { ChannelMessage } from "./channel_message.entity";
import { OmitType } from "@nestjs/mapped-types";

export class CreateChannelMessageDto extends OmitType(ChannelMessage, ["id"]) {}
