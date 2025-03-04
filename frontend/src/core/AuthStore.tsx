import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

export const auth$ = observable({
    token: '',
    setToken: (token: string) => {
        auth$.token.set(token);
    },
})

persistObservable(auth$.token, {
    local: 'auth',
    pluginLocal: ObservablePersistLocalStorage
})