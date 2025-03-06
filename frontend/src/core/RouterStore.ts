import { observable } from "@legendapp/state";
import { auth$ } from "./AuthStore";

const routeObjects = [
    {
        id: "home",
    },
    { id: "login" },
    { id: "profile" },
];
const possibleRoutes = routeObjects.map((route) => route.id);
const defaultRoute = "home";
const fallBackRoute = "login";
const currentRoute = window.location.pathname.replace("/", "") || defaultRoute;

export const router$ = observable({
    currentRoute: auth$.token.get()
        ? possibleRoutes.includes(currentRoute)
            ? currentRoute
            : fallBackRoute
        : fallBackRoute,
    navigate: (route: string) => {
        router$.currentRoute.set(route);
        window.history.pushState({}, "", `${route}`);
    },
});

auth$.token.onChange(() => {
    if (!auth$.token.get()) {
        router$.currentRoute.set(fallBackRoute);
    } else {
        router$.currentRoute.set(defaultRoute);
    }
});

window.onpopstate = () => {
    const newRoute = window.location.pathname.replace("/", "");
    router$.currentRoute.set(newRoute);
};
