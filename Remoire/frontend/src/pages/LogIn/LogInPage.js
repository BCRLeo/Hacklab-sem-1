import Card from "../../components/Card/Card";
import Field from "../../components/Field/Field";
import Header from "../../components/Header/Header";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LogInPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/login", {
                method: "POST",
                body: JSON.stringify({
                    email: {email},
                    password: {password}
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            const data = await response.json();
            if (response.ok && data.success) {
                console.log(data);
                navigate("/wardrobe");
            } else {
                console.log("fuck you");
            }
        } catch (error) {
            console.error("Error during login: ", error);
        }
    };

    return (
        <>
            <Header />
            <h1>Welcome to Remoire</h1>
            <Card id="card-login">
                <h3>Card!</h3>
                <form onSubmit={handleSubmit} method="post" class="login">
                    <Field label="Email" type="text" name="email" placeholder="Email" />
                    <Field label="Password" type="password" name="password" placeholder="Create a password" />
                    <button type="submit">Log in</button>
                </form>
            </Card>
        </>
    );
};

export default LogInPage;