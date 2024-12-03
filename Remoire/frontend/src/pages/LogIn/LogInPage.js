import "./LogInPage.css";

import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Field from "../../components/Field/Field";
import Header from "../../components/Header/Header";

import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../../UserContext";

export default function LogInPage() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [isInvalid, setIsInvalid] = useState({login: false, password: false});

    const [loginStatus, setLoginStatus] = useState("");

    const handleLoginInput = (event) => {
        if (isInvalid.login) {
            setIsInvalid(isInvalid => ({login: false, password: false}));
        }

        setLogin(event.target.value);
    };

    const handlePasswordInput = (event) => {
        if (isInvalid.password) {
            setIsInvalid(isInvalid => ({login: false, password: false}));
        }

        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        setIsInvalid({login: !Boolean(login), password: !Boolean(password)})

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                body: JSON.stringify({
                    login: login,
                    password: password
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setUser(data.user);
                navigate("/wardrobe");
            } else {
                setLoginStatus(data.message);
                console.log("Login failed: ", data.message);
            }
        } catch (error) {
            setLoginStatus(`Error during login: ${error}`);
            console.error("Error during login: ", error);
        }
    };

    return (
        <>
            <h1>Welcome to Remoire</h1>
            <Card className="login">
                <h3>Card!</h3>
                <form onSubmit={handleSubmit} method="post" className="login">
                    <Field className={isInvalid.login ? "invalid" : ""} label="Email/username" onChange={handleLoginInput} type="text" name="login" placeholder="Email/username" aria-required />
                    <Field className={isInvalid.password ? "invalid" : ""} label="Password" onChange={handlePasswordInput} type="password" name="password" placeholder="Password" aria-required />
                    <Button text="Log in" type="submit" />
                </form>
                <p>{loginStatus}</p>
                <NavLink to="/signup" className="nav-link no-account">Don't have an account?</NavLink>
            </Card>
        </>
    );
}