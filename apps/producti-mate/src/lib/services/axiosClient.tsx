// axis client
import { useInitData } from "@twa.js/sdk-react";
import axios from "axios";
import React, { useEffect } from "react";

export const axiosClient = axios.create({
  baseURL: `${process.env.API_URL}/api/`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function AxiosClient({ children }: { children: React.ReactNode }) {
  // add a header to the axiosClient
  const initData = useInitData();

  useEffect(() => {
    axiosClient.interceptors.request.use((config) => {
      console.log(initData);

      if (initData) {
        // set Authorization header
        config.headers.Authorization = `Bearer ${initData.user?.id}`;
      }
      return config;
    });
  }, [initData]);

  return <>{children}</>;
}

export default AxiosClient;
