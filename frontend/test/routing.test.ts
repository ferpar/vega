import { describe, it, expect, beforeEach } from "vitest";
import { auth$ } from "../src/core/AuthStore";
import { router$ } from "../src/core/RouterStore";

// by default auth$.token is ""
// by default router$.currentRoute is "login"

describe("routing", () => {
    it("should start at the login page", () => {
        // when the app starts, and the user is not logged in
        expect(auth$.token.get()).toBe("");
        // the user should be redirected to the login page
        expect(router$.currentRoute.get()).toBe("login");
        expect(window.location.pathname).toBe("/login");
    });
    it("should navigate to /home page after login, /login after logout", () => {
        // simulate login
        auth$.token.set("token");
        expect(router$.currentRoute.get()).toBe("home");
        expect(window.location.pathname).toBe("/home");

        // simulate logout
        auth$.token.set("");
        expect(router$.currentRoute.get()).toBe("login");
        expect(window.location.pathname).toBe("/login");
    });
    describe("when logged in", () => {
        beforeEach(() => {
            // simulate login
            auth$.token.set("token");
        });
        it("redirects to the /home, when logged in and new route does not exist, ", () => {
            router$.navigate("not-allowed");
            expect(router$.currentRoute.get()).toBe("home");
            expect(window.location.pathname).toBe("/home");
        });
        it("navigates to profile, and sets the url, when logged in", () => {
            router$.navigate("profile");
            expect(router$.currentRoute.get()).toBe("profile");
            expect(window.location.pathname).toBe("/profile");
        });
    });
    describe("when logged out", () => {
        beforeEach(() => {
            // ensure logged out
            auth$.token.set("token"); // cant set to "", when its already ""
            auth$.token.set("");
        });
        it("redirects to the /login, when logged out and new route does not exist, ", () => {
            router$.navigate("not-allowed");
            expect(router$.currentRoute.get()).toBe("login");
            expect(window.location.pathname).toBe("/login");
        });
    });
});
