import { observer } from "@legendapp/state/react";
import { AuthService } from "../core/Auth";

export const Login = observer(() => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const username = form.username.value;
        const password = form.password.value;
        await AuthService.login(username, password);
    }

    return (
        <div className="container mx-auto p-4" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <form className="flex flex-col space-y-4 max-w-sm mx-auto">
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
})