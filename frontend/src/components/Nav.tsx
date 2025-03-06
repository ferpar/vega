import { router$ } from "../core/RouterStore";

export const Nav = () => {
    const currentRoute = router$.currentRoute.get();
    const routes = ["home", "login", "profile"];
    return (
        <nav className="flex gap-4">
            {routes
                .filter((route) => route != currentRoute)
                .filter((route) => route != "login")
                .map((route) => {
                    return (
                        <a
                            className="cursor-pointer px-4 flex items-center rounded-lg hover:bg-gray-200"
                            key={route}
                            onClick={() => router$.navigate(route)}
                        >
                            {route}
                        </a>
                    );
                })}
        </nav>
    );
};
