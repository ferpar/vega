import { observable } from "@legendapp/state";
import { auth$ } from "./AuthStore";
import { portfolio$ } from "./PortfolioStore";

const routeObjects = [
    {
        id: 'home',
        init: portfolio$.init
    },
    { id: 'login' },
    { id: 'profile' }
];
const possibleRoutes = routeObjects.map(route => route.id);
const defaultRoute = 'home';
const fallBackRoute = 'login';
const currentRoute = window.location.pathname.replace('/', '') || defaultRoute;

export const router$ = observable({
    currentRoute: auth$.token.get()
        ? possibleRoutes.includes(currentRoute)
            ? currentRoute : fallBackRoute
        : fallBackRoute,
    navigate: (route: string) => {
        const initFn = routeObjects.find(r => r.id === route)?.init;
        if (initFn) initFn();
        router$.currentRoute.set(route)
        window.history.pushState({}, '', `${route}`)
    }
});

// Ensure init function runs when the page loads
const initFn = routeObjects.find((r) => r.id === router$.currentRoute.get())?.init;
if (initFn) initFn(); // Run the function on refresh

window.onpopstate = () => {
    const newRoute = window.location.pathname.replace('/', '');
    router$.currentRoute.set(newRoute)
    // Run init function if available for the new route
    const newInitFn = routeObjects.find((r) => r.id === newRoute)?.init;
    if (newInitFn) newInitFn();
};