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
    img?: Buffer
    strength?: number
    modelVersion?: string
    extension?: "png" | "jpg"
}

const getImageForm = async (
  params: GenerateParams, baseURL: string, apiKey: string) => {
  const method = "generate/";
  const formData = new FormData();
  for (const [key, val] of Object.entries(params)) {
    formData.append(key, val);
  }
  const headers = formData.getHeaders();
  headers["Authorization"] = `X-API-Key ${apiKey}`;
  const res = await axios.post(
    baseURL + method, 
    formData, 
    {headers, responseType: "arraybuffer"},
  );
  if (res.status !== 200) throw new Error(
    `Error getting image ${res.status} ${res.statusText} ${res.data}`);
  return Buffer.from(res.data, "binary");
};

export class Computerender {
    apiKey: string
    baseURL = "https://api.computerender.com/"

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    generateImage(params: GenerateParams) {
      return getImageForm(params, this.baseURL, this.apiKey);
    }
}