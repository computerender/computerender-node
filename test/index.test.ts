import { describe, expect, it } from "vitest";
import fs from "fs";

import { Computerender } from "../dist/index";

const apiKey = process.env.CR_KEY || "invalid";

describe("should", () => {
  it("Instance", () => {
    const instance = new Computerender("test_key");
    expect(instance.apiKey).toEqual("test_key");
  })
})

describe("should", () => {
  it("image gen", async () => {
    const cr = new Computerender(apiKey);
    const prompt = "cat with sunglasses";
    const imageResult = await cr.generateImage({prompt});
    // Optionally write to file 
    const ws = imageResult.pipe(fs.createWriteStream(prompt + ".jpg"));
    await new Promise(fulfill => ws.on("finish", fulfill));
    expect(imageResult).toBeDefined();
    //expect(instance.apiKey).toEqual("test_key");
  })
})


