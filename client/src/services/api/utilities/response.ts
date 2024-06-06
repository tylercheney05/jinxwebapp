import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "store";

export function handleResponse(response: any) {
    if (response.results) {
      return response.results;
    }
  
    if (response.data) {
      return response.data;
    }
  
    return response;
  }
  
export function handleError(error: any) {
  if (error.data) {
    return error.data;
  }
  return error;
}