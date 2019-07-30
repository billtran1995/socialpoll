import axios from "axios";

const POLLS_URL = `/api/polls`;

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
  return pollsApi.post(`${POLLS_URL}/createPoll`, body);
};

export const getPolls = async query => {
  return pollsApi.get(`${POLLS_URL}${query}`);
};

export const getPoll = async id => {
  return pollsApi.get(`${POLLS_URL}/${id}`);
};

export const vote = async body => {
  return pollsApi.post(`${POLLS_URL}/vote`, body);
};

export const like = async (pollId, body) => {
  return pollsApi.post(`${POLLS_URL}/${pollId}/like`, body);
};

export const unlike = async (pollId, body) => {
  return pollsApi.post(`${POLLS_URL}/${pollId}/unlike`, body);
};

export const follow = async (pollId, body) => {
  return pollsApi.post(`${POLLS_URL}/${pollId}/follow`, body);
};

export const unfollow = async (pollId, body) => {
  return pollsApi.post(`${POLLS_URL}/${pollId}/unfollow`, body);
};

export const getStatistic = async (pollId, year) => {
  return pollsApi.get(`${POLLS_URL}/${pollId}/getStat?year=${year}`);
};

export const createComment = async (pollId, body) => {
  return pollsApi.post(`${POLLS_URL}/${pollId}/comment`, body);
};
