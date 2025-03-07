import { it, describe, expect, vi } from "vitest";
import { auth$ } from "../src/core/AuthStore";

auth$.gateway.post = vi.fn().mockResolvedValue({ accessToken: "token" });

describe("auth", () => {
    describe("token state", () => {
        it("starts as empty string", () => {
            expect(auth$.state.token.get()).toBe("");
        });
        it("can be set", () => {
            auth$.state.token.set("token");
            expect(auth$.state.token.get()).toBe("token");
        });
        it("can be unset", () => {
            auth$.state.token.set("");
            expect(auth$.state.token.get()).toBe("");
        });
    });
    it("should login", async () => {
        // act
        await auth$.login("username", "password");
        // assert
        // check the fn was called
        expect(auth$.gateway.post).toHaveBeenCalledWith("/login", {
            username: "username",
            password: "password",
        });
        // check the token was set
        expect(auth$.state.token.get()).toBe("token"); //token from mock
    });
    it("should logout", async () => {
        // act
        await auth$.logout();
        // assert
        // check the fn was called
        expect(auth$.gateway.post).toHaveBeenCalledWith("/logout", {});
        // check the token was set
        expect(auth$.state.token.get()).toBe("");
    });
});
