import {File} from "@web-std/file";
import axios from "axios";
import FormData from "form-data";

export interface GenerateParams {
    prompt: string
    seed?: number
    w?: number
    h?: number
    guidance?: number
    iterations?: number
    eta?: number
    img?: Buffer | typeof File
    strength?: number
    modelVersion?: string
    extension?: "png" | "jpg"
}

const getImageForm = async (
  params: GenerateParams,
  route: string,
  baseURL: string,
  authHeader: string) => {
  const formData = new FormData();
  for (const [key, val] of Object.entries(params)) {
    formData.append(key, val);
  }
  const headers = {
    "Content-Type": "multipart/form-data",
    "Authorization": authHeader
  };
  const res = await axios.post(
    baseURL + route, 
    formData, 
    {headers, responseType: "arraybuffer"},
  );
  if (res.status !== 200) throw new Error(
    `Error getting image ${res.status} ${res.statusText} ${res.data}`);
  return Buffer.from(res.data, "binary");
};

export class Computerender {
    authHeader: string
    baseURL = "https://api.computerender.com/"
    
    constructor(apiKey ? : string) {
        if (apiKey === undefined) {
          if (process.env.CR_KEY) {
            this.authHeader = `X-API-Key ${process.env.CR_KEY}`
          } else {
            throw new Error("No API key provided and no CR_KEY env variable found");
          }
        } else if (apiKey.startsWith("sk_")) {
          // use api key
          this.authHeader = `X-API-Key ${apiKey}`;
        } else if (apiKey === "use_fb_token") {
          // use bearer token
          this.authHeader = "";
        } else {
          throw new Error("apiKey format was not recognized");
        }
    }
    
    generateImage(params: GenerateParams) {
      return getImageForm(params, "generate/", this.baseURL, this.authHeader);
    }

    userGenerateImage(params: GenerateParams, fbToken: string) {
      return getImageForm(
        params, "user-generate/", this.baseURL,
        `Bearer ${fbToken}`);
    }
    
}