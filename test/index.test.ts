import { describe, expect, it } from "vitest";
import fs from "fs";
import { pipeline } from "stream/promises";

import { Computerender } from "../dist/index";

const apiKey = process.env.CR_KEY || "invalid";

describe("should", () => {
  it("Instance", () => {
    const instance = new Computerender("test_key");
    expect(instance.apiKey).toEqual("test_key");
  });
});

describe("should", () => {
  it("image gen", async () => {
    const cr = new Computerender(apiKey);
    const prompt = "dog wearing sunglasses";
    const result = await cr.generateImage({prompt});
    //  write to file 
    fs.writeFileSync(prompt + ".jpg", result);
    expect(result).toBeDefined();
  }, 8000);
});

describe("should", () => {
  it("image to image", async () => {
    const cr = new Computerender(apiKey);
    const prompt = "portrait of a woman wearing sunglasses";
    const result = await cr.generateImage({prompt});
    fs.writeFileSync(prompt + ".jpg", result);
    const newPrompt = "abstract van gough painting of " + prompt;
    const img = result; // "oh baby"; // result.imageData.toString("base64");
    const styledResult = await cr.generateImage({prompt: newPrompt, img});
    fs.writeFileSync(newPrompt + ".jpg", styledResult);
    expect(styledResult).toBeDefined();
  }, 8000);
});
