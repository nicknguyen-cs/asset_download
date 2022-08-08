import Contentstack from "contentstack";
import * as cm from "@contentstack/management";
import * as fs from "fs";
import { AxiosRequestConfig } from "axios";
require('dotenv').config({ path: './.env' });

export const getDefaultAxiosOptions = (
  options: AxiosRequestConfig<any>
): AxiosRequestConfig<any> => {
  const o = {
    ...options,
    headers: {
      authorization: process.env.CS_CM_TOKEN,
      api_key: process.env.CS_API_KEY ,
      access_token: process.env.CS_CD_TOKEN ,
      ...options.headers,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  return o;
};
export const saveToFile = (data: any, filename: string) => {
  fs.writeFileSync(filename, JSON.stringify(data));
};

export const Stack = Contentstack.Stack({
  api_key: process.env.CS_API_KEY, 
  delivery_token: process.env.CS_CD_TOKEN,
  environment: process.env.CS_ENVIRONMENT,
});

export const getContentstackClient = () => {
  const client = cm.client({
    maxRequests: 10,
  });
  return client.stack({
    api_key: process.env.CS_API_KEY,
    management_token: process.env.CS_CM_TOKEN,
  });
};
