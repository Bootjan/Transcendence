import { CreateMessageDto } from "../../websocket/chat/models/create_message.dto";
import { DirectMessageDto } from "../../websocket/chat/models/direct_message.dto";
import { API_ENDPOINT } from "../api_endpoint"
import axios, { Axios, AxiosResponse } from 'axios';
axios.defaults.baseURL = API_ENDPOINT;

export const deleteMessagesByIds: (id1: number, id2: number) => Promise<void> = async (id1, id2) => {
  try {
    await axios.delete(`/dm/delete/${id1}/${id2}`);
  } catch (error) {
    void(0);
  }
}

export const sendDirectMessageByIds: (createMessageDto: CreateMessageDto) => Promise<void> = async(createMessageDto) => {
  try {
    await axios.post(`/dm/send`, createMessageDto);
  } catch (error) {
    void(0);
  }
}

export const getMessagesByIds: (id_player1: number, id_player2: number) => Promise<DirectMessageDto[] | null> = async (id_player1, id_player2) => {
  try {
    const axiosResponse: AxiosResponse<any, any> = await axios.get(`/dm/receive/${id_player1}/${id_player2}`);
    if (axiosResponse.data === '') {
      return [];
    }
    return <DirectMessageDto[]>axiosResponse.data;
  } catch (error) {
    void(0);
  }
  return null;
}
