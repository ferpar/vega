import { observer } from '@legendapp/state/react';
import { AuthPresenter } from '../core/Auth';
export const Logout = observer(() => {
    const handleLogout = async () => {
        await AuthPresenter.logout();
    }
    return (
        <button onClick={handleLogout}>Logout</button>
    )
})