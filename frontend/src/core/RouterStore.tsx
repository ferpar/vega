import { observable } from "@legendapp/state";
import { auth$ } from "./AuthStore";

const possibleRoutes = ['home', 'login', 'profile'];
const defaultRoute = 'home';
const fallBackRoute = 'login';
const currentRoute = window.location.pathname.replace('/', '') || defaultRoute;

export const router$ = observable({
    currentRoute: auth$.token.get() 
    ? possibleRoutes.includes(currentRoute) 
        ? currentRoute : fallBackRoute
    : fallBackRoute,
    navigate: (route: string) => {
        router$.currentRoute.set(route)
        window.history.pushState({}, '', `${route}`)
    }
});

window.onpopstate = () => {
    router$.currentRoute.set(window.location.pathname.replace('/', ''))
};