import { it, describe, expect, vi, beforeEach } from "vitest";
import { auth$ } from "../src/core/AuthStore";

// mock the gateway;
auth$.gateway.post = vi
    .fn()
    .mockImplementation(async (url: string, data: any) => {
        if (url === "/auth/login") {
            if (data.username === "username" && data.password === "password") {
                return await Promise.resolve({ accessToken: "token" });
            } else {
                throw new Error("Unauthorized");
            }
        }
    });

// test the auth store
describe("auth", () => {
    beforeEach(() => {
        // unset the token, in case it was set
        auth$.state.token.set("");
    });
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
        expect(auth$.gateway.post).toHaveBeenCalledWith(
            "/auth/login",
            {
                username: "username",
                password: "password",
            },
            { credentials: "include" }
        );
        // check the token was set
        expect(auth$.state.token.get()).toBe("token"); //token from mock
    });
    it("should not login with wrong credentials", async () => {
        // act
        try {
            await auth$.login("wrong", "wrong");
        } catch (e) {
            // assert
            expect(e.message).toBe("Unauthorized");
            expect(auth$.state.token.get()).toBe("");
        }
        expect(auth$.gateway.post).toHaveBeenCalledWith(
            "/auth/login",
            {
                username: "wrong",
                password: "wrong",
            },
            { credentials: "include" }
        );
    });
    it("should logout", async () => {
        // act
        await auth$.logout();
        // assert
        // check the fn was called
        expect(auth$.gateway.post).toHaveBeenCalledWith("/auth/logout", {});
        // check the token was set
        expect(auth$.state.token.get()).toBe("");
    });
});
