import { observer } from "@legendapp/state/react";
import { AuthPresenter } from "../core/Auth";

export const Login = observer(() => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const username = form.username.value;
        const password = form.password.value;
        await AuthPresenter.login(username, password);
    }

    return (
        <div className="container mx-auto p-4" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <form>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" />
                <button type="submit">Login</button>
            </form>
        </div>
    )
})