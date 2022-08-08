declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CS_CM_TOKEN: string; // this is the line you want
      CS_CD_TOKEN: string;
      CS_API_KEY: string;
      CS_ENVIRONMENT: string;
      FILE_PATH: string;
      NODE_ENV: "development" | "production";
      PORT?: string;
      PWD: string;
    }
  }
}

export {};
