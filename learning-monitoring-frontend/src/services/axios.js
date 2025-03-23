import axios from 'axios';
const baseURL = 'http://127.0.0.1:6868';

export const api = axios.create({
  baseURL,
});

export const postLogin = async (url, data) => {
  try {
    const response = await api.post(`${url}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const token = response.data.token;
    localStorage.setItem("token", token);
    return response;
  }  catch (error) {
    if (error.response.status === 301) {
        return { status: 301, data: null }; 
    }
    if (error.response.status === 401) {
      return { status: 401, data: null }; 
  }
    throw error;
}
}

export const getData = async (url, query = {}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`${url}`, {
      headers: {
        'Authorization': `${token}`,
      },
      params: query
    });
    return response;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const postData = async (url, data, contentType = 'application/json') => {
  try {
    let token = localStorage.getItem("token");
    const response = await api.post(`${url}`, data, {
      headers: {
        'authorization': token,
        'Content-Type': contentType
      }
    });
    return response;
  }
  catch (error) {
    throw new Error(error.response.data);
  }
};