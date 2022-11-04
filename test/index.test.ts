import { describe, expect, it } from "vitest";

import { Computerender } from "../dist/index";

describe("should", () => {
  it("Instance", () => {
    const instance = new Computerender("test_key");
    expect(instance.apiKey).toEqual("test_key");
  })
})
