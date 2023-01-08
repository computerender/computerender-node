import axios from "axios";
import FormData from "form-data";

interface BrowserFile {
  arrayBuffer: () => Promise<ArrayBuffer>
  name: string
}

export interface GenerateParams {
    prompt: string
    seed?: number
    w?: number
    h?: number
    guidance?: number
    iterations?: number
    eta?: number
    img?: Buffer | BrowserFile
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
  // TODO add exception types for different error types here
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