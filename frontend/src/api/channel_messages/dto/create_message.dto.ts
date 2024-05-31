import { ChannelMessageDto } from "./channel_message.dto";

export type CreateChannelMessageDto = Omit<ChannelMessageDto, "id">;
