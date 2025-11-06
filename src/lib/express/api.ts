import axios from "axios";
import { EXPRESS_API_BASE_URL } from "./config";

export const api = axios.create({
  baseURL: EXPRESS_API_BASE_URL,
  withCredentials: true,
});
