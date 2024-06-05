// provider.js

import axios from 'axios'; 
import { handleResponse, handleError } from './response';
import { API_URL } from 'config';

const getAll = (resource: string) => { 
  return axios 
    .get(`${API_URL}/${resource}`) 
    .then(handleResponse) 
    .catch(handleError); 
}; 

const getSingle = (resource: string, id: string) => { 
  return axios 
    .get(`${API_URL}/${resource}/${id}`) 
    .then(handleResponse) 
    .catch(handleError); 
}; 

const post = (resource: string, model: object) => { 
  return axios 
    .post(`${API_URL}/${resource}`, model) 
    .then(handleResponse) 
    .catch(handleError); 
}; 

const put = (resource: string, model: object) => { 
  return axios 
    .put(`${API_URL}/${resource}`, model) 
    .then(handleResponse) 
    .catch(handleError); 
}; 

const patch = (resource: string, model: object) => { 
  return axios 
    .patch(`${API_URL}/${resource}`, model) 
    .then(handleResponse) 
    .catch(handleError); 
}; 

const remove = (resource: string, model: object) => { 
  return axios 
    .delete(`${API_URL}/${resource}`, model) 
    .then(handleResponse) 
    .catch(handleError); 
}; 

export const apiProvider = { 
  getAll, 
  getSingle, 
  post, 
  put, 
  patch, 
  remove, 
};