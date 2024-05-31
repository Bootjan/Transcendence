import { CreateMessageDto } from "../../websocket/chat/models/create_message.dto";
import { DirectMessageDto } from "../../websocket/chat/models/direct_message.dto";
import { API_ENDPOINT } from "../api_endpoint"
import axios, { Axios, AxiosResponse } from 'axios';
import { CreateChannelMessageDto } from "./dto/create_message.dto";
import { ChannelMessageDto } from "./dto/channel_message.dto";
axios.defaults.baseURL = API_ENDPOINT;

export const createChannelMessage: (sender_id: number, channel_id: number, message: string, is_invite: boolean, id_of_opponent: number) => CreateChannelMessageDto = (sender_id, channel_id, message, is_invite, id_of_opponent) => {
  const channelMessageDto: CreateChannelMessageDto = {
    sender_id: sender_id,
    channel_id: channel_id,
    message: message,
    is_invite: is_invite,
    id_of_opponent: id_of_opponent,
  }
  return channelMessageDto;
}

export const deleteMessagesByIds: (id: number) => Promise<void> = async (id) => {
  try {
    await axios.delete(`/channel_message/delete/${id}`);
  } catch (error) {
    void(0);
  }
}

export const sendChannelMessageByIds: (createChannelMessageDto: CreateChannelMessageDto) => Promise<void> = async(createChannelMessageDto) => {
  try {
    await axios.post(`/channel_message/send`, createChannelMessageDto);
  } catch (error) {
    void(0);
  }
}

export const getChannelMessagesByIds: (channel_id: number) => Promise<ChannelMessageDto[] | null> = async (channel_id) => {
  try {
    const axiosResponse: AxiosResponse<any, any> = await axios.get(`/channel_message/receive/${channel_id}`);
    if (axiosResponse.data === '') {
      return [];
    }
    return <ChannelMessageDto[]>axiosResponse.data;
  } catch (error) {
    void(0);
  }
  return null;
}
