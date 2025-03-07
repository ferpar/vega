import { observable } from "@legendapp/state";
import { auth$ } from "./AuthStore";

const possibleRoutes = ["home", "login", "profile"];
const defaultRoute = "home";
const fallBackRoute = "login";
const currentRoute = window.location.pathname.replace("/", "") || defaultRoute;

export const router$ = observable({
    currentRoute: auth$.token.get()
        ? possibleRoutes.includes(currentRoute)
            ? currentRoute
            : defaultRoute
        : fallBackRoute,
    navigate: (route: string) => {
        const redirectedRoute = auth$.token.get() 
            ? possibleRoutes.includes(route) 
                ? route 
                : defaultRoute 
            : fallBackRoute;
        router$.currentRoute.set(redirectedRoute);
        window.history.pushState({}, "", `${redirectedRoute}`);
    },
});
// set the url to the current route
window.history.pushState({}, "", `${router$.currentRoute.get()}`);

auth$.token.onChange(() => {
    if (!auth$.token.get()) {
        router$.navigate(fallBackRoute);
    } else {
        router$.navigate(defaultRoute);
    }
});

window.onpopstate = () => {
    const newRoute = window.location.pathname.replace("/", "");
    router$.currentRoute.set(newRoute);
};
