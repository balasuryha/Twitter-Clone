import axios from "axios";
import * as url from "../urls";
axios.defaults.withCredentials = true;

export const getPublicKey = () => axios.get(url.PUSH_PUBLIC_KEY);
export const subscribePush = (subscription) => axios.post(url.PUSH_SUBSCRIBE, subscription);
export const unsubscribePush = (endpoint) => axios.post(url.PUSH_UNSUBSCRIBE, { endpoint });
