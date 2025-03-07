import { it, describe, expect } from "vitest";
import { auth$ } from "../src/core/AuthStore";

// mock httpGateway within auth$


describe("auth", () => {
    it("should start with no token", () => {
        expect(auth$.state.token.get()).toBe("");
    });
    it("should set token", () => {
        auth$.state.token.set("token");
        expect(auth$.state.token.get()).toBe("token");
    });
    it("should remove token", () => {
        auth$.state.token.set("");
        expect(auth$.state.token.get()).toBe("");
    });
})