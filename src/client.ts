import axios from "axios";

export interface GenerateParams {
    prompt: string
    seed?: number
    w?: number
    h?: number
    guidance?: number
    iterations?: number
    eta?: number
    modelVersion?: string
    extension?: "png" | "jpg"
}

const getImage = async (
  params: GenerateParams, apiKey: string,
  methodType: ("generate" | "cost"), ) => {
  const promptEncoded = encodeURIComponent(params.prompt);
  const softParams = params as Record<string, any>;
  const usedParams = {} as Record<string, string>;
  for (const key of Object.keys(params)) {
    if (key === "prompt") continue;
    usedParams[key] = softParams[key].toString();
  }
  const paramsEncoded = "?" + new URLSearchParams(usedParams).toString();
  const res = await axios.request({
    method: "get",
    headers:{
      "Authorization": `X-API-Key ${apiKey}`,
    },
    baseURL: `https://api.computerender.com/${methodType}/`,
    url: promptEncoded + paramsEncoded,
    responseType: "stream"
  });
  if (res.status !== 200) throw new Error(
    `Error getting image ${res.status} ${res.statusText} ${res.data}`);
  return res.data as NodeJS.ReadStream;
}

export class Computerender {
    apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    generateImage(params: GenerateParams) {
      return getImage(params, this.apiKey, "generate");
    }
}