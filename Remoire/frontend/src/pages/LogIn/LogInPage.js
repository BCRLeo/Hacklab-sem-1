import Card from "../../components/Card/Card";
import Field from "../../components/Field/Field";
import Header from "../../components/Header/Header";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LogInPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailInput = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordInput = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                body: JSON.stringify({
                    login: email,
                    password: password
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                navigate("/wardrobe");
            } else {
                console.log("Login failed: ", data.message);
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
                <form onSubmit={handleSubmit} method="post" className="login">
                    <Field label="Email" onChange={handleEmailInput} type="text" name="login" placeholder="Email" />
                    <Field label="Password" onChange={handlePasswordInput} type="password" name="password" placeholder="Password" />
                    <button type="submit">Log in</button>
                </form>
            </Card>
        </>
    );
};

export default LogInPage;