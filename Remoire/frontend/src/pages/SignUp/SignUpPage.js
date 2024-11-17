import "./SignUpPage.css"

import Card from "../../components/Card/Card";
import Field from "../../components/Field/Field";
import Header from "../../components/Header/Header";

import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../../UserContext";

const SignUpPage = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthday, setBirthday] = useState("");

    const handleUsernameInput = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailInput = (event) => {
        setEmail(event.target.value);
    };

    const handleBirthdayInput = (event) => {
        setBirthday(event.target.value);
    };

    const handlePasswordInput = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    email: email,
                    birthday: birthday,
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
                console.log("Signup failed: ", data.message);
            }
        } catch (error) {
            console.error("Error during signup: ", error);
        }
    };

    return (
        <>
            <Header />
            <h1>Create your Remoire account</h1>
            <Card id="card-registration">
                <h3>Card!</h3>
                <form onSubmit={handleSubmit} method="post" class="registration">
                    <Field label="Username" onChange={handleUsernameInput} type="text" name="username" placeholder="MarioRossi88" />
                    <Field label="Email" onChange={handleEmailInput} type="text" name="email" placeholder="Email" />
                    <Field label="Password" onChange={handlePasswordInput} type="password" name="password" placeholder="Create a password" />
                    <Field label="Birthday" onChange={handleBirthdayInput} type="date" name="birthday" />
                    <button type="submit">Sign up</button>
                </form>
            </Card>
        </>
    );
};

export default SignUpPage;