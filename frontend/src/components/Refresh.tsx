import { useState } from "react";
import { auth$ } from "../core/AuthStore";
import { observer } from "@legendapp/state/react";

export const RefreshToken = observer(() => {
    const [loading, setLoading] = useState(false);
    const handleRefreshToken = async () => {
        setLoading(true);
        auth$.refresh();
        setLoading(false);
    };
    return (
        <div>
            {loading ? (
                <p>Refreshing token...</p>
            ) : (
                <button onClick={handleRefreshToken}>Refresh Token</button>
            )}
        </div>
    );
});
