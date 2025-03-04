import { observer } from '@legendapp/state/react';
import { AuthService } from '../core/Auth';
export const Logout = observer(() => {
    const handleLogout = async () => {
        await AuthService.logout();
    }
    return (
        <button onClick={handleLogout}>Logout</button>
    )
})