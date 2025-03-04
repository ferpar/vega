import { observable } from "@legendapp/state";

const possibleRoutes = ['home', 'login', 'profile'];
const defaultRoute = 'home';
const fallBackRoute = 'login';
const currentRoute = window.location.pathname.replace('/', '') || defaultRoute;

export const router$ = observable({
    currentRoute: possibleRoutes.includes(currentRoute) ? currentRoute : fallBackRoute,
    navigate: (route: string) => {
        router$.currentRoute.set(route)
        window.history.pushState({}, '', `${route}`)
    }
});

window.onpopstate = () => {
    router$.currentRoute.set(window.location.pathname.replace('/', ''))
};