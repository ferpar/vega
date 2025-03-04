import { describe, it, expect, beforeAll } from 'vitest';
import { router$ } from '../src/core/RouterStore';

describe('routing', () => {
    beforeAll(() => {
        router$.navigate('home');
    })
    it('should navigate to the home page', () => {
        expect(router$.currentRoute.get()).toBe('home');
    })
    it('should navigate to the login page', () => {
        router$.navigate('login');
        expect(router$.currentRoute.get()).toBe('login');
    })
    it('should navigate to the profile page', () => {
        router$.navigate('profile');
        expect(router$.currentRoute.get()).toBe('profile');
    })
});