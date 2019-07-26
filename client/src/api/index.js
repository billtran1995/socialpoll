import axios from "axios";

const BASE_URL = "/api/";
const POLLS_URL = `${BASE_URL}polls`;

let pollsApi;

const initApis = token => {
  const headers = { Authorization: `Bearer ${token}` };

  pollsApi = axios.create({
    // baseURL: POLLS_URL,
    headers
  });
};

export default initApis;

export const createPoll = async body => {
  return pollsApi.post("/api/polls/createPoll", body);
};

export const getPolls = async query => {
  return pollsApi.get(`/api/polls${query}`);
};

export const getPoll = async id => {
  return pollsApi.get(`/${id}`);
};

export const vote = async body => {
  return pollsApi.post("/api/polls/vote", body);
};

export const like = async (pollId, body) => {
  return pollsApi.post(`/api/polls/${pollId}/like`, body);
};

export const unlike = async (pollId, body) => {
  return pollsApi.post(`/api/polls/${pollId}/unlike`, body);
};

export const follow = async (pollId, body) => {
  return pollsApi.post(`/api/polls/${pollId}/follow`, body);
};

export const unfollow = async (pollId, body) => {
  return pollsApi.post(`/api/polls/${pollId}/unfollow`, body);
};

export const createComment = async (pollId, body) => {
  return pollsApi.post(`/${pollId}/comment`, body);
};
