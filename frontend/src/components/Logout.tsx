import { observer } from '@legendapp/state/react';
import { auth$ } from '../core/AuthStore';
export const Logout = observer(() => {
    const handleLogout = async () => {
        await auth$.logout();
    }
    return (
        <button onClick={handleLogout}>Logout</button>
    )
})