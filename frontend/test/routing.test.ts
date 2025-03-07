import { describe, it, expect, afterEach } from 'vitest';
import { auth$ } from '../src/core/AuthStore';
import { router$ } from '../src/core/RouterStore';

describe('routing', () => {
    it('should start at the login page', () => {
        // when the app starts, and the user is not logged in
        expect(auth$.token.get()).toBe("");
        // the user should be redirected to the login page
        expect(router$.currentRoute.get()).toBe('login');
        expect(window.location.pathname).toBe('/login');    
    })
    afterEach(() => {
        // reset the auth token to logged out
        auth$.token.set("token"); // cant just log out if not logged in
        auth$.token.set("");
    })
    it('should successfully navigate to a page, and set the url', () => {
        router$.navigate('profile');
        expect(router$.currentRoute.get()).toBe('profile');
        expect(window.location.pathname).toBe('/profile');
    })
    it('should navigate to /home page after login, /login after logout', () => {
        // simulate login
        auth$.token.set("token");
        expect(router$.currentRoute.get()).toBe('home');
        expect(window.location.pathname).toBe('/home');

        // simulate logout
        auth$.token.set("");
        expect(router$.currentRoute.get()).toBe('login');
        expect(window.location.pathname).toBe('/login');
    })
});