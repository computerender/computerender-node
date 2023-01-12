import axios, {AxiosError} from "axios";
import FormData from "form-data";

// polyfill for node/web interoperability 
interface BrowserFile {
  arrayBuffer: () => Promise<ArrayBuffer>
  name: string
}

interface ErrorResponse {
  status: ("success" | "error"),
  message: string,
  errorType: string,
}

export class InvalidRequestError extends Error {
  errorInfo: ErrorResponse
  constructor(message: string, data: ErrorResponse) {
    super(message);
    this.errorInfo = data;
  }
}

export class InternalServerError extends Error {
  errorInfo: ErrorResponse
  constructor(message: string, data: ErrorResponse) {
    super(message);
    this.errorInfo = data; 
  }
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
  try {
    const res = await axios.post(
      baseURL + route,
      formData,
      {headers, responseType: "arraybuffer"},
    );
    return Buffer.from(res.data, "binary");
  } catch (err) {
    if (err instanceof AxiosError && axios.isAxiosError(err) && err.response) {
      const status = err.response.status;
      // Convert ArrayBuffer response to json for error handling
      const jsonError = JSON.parse(
        String.fromCharCode.apply(
          null,
          Array.from(new Uint8Array(err.response.data))
        )) as ErrorResponse;
      if (status >= 400 && status < 500) {
        throw new InvalidRequestError(
          "Invalid request", jsonError);
      } else {
        throw new InternalServerError(
          "Internal Server Error", jsonError);
      }
    } else {
      throw new Error(err as any);
    }
  }
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