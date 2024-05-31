import { DirectMessageDto } from "./direct_message.dto";

export type CreateMessageDto = Omit<DirectMessageDto, "id">;
