import "./SignUpPage.css"

import Card from "../../components/Card/Card";
import Field from "../../components/Field/Field";
import Header from "../../components/Header/Header";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SignUpPage = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthdate, setBirthdate] = useState("");

    const handleUsernameInput = (event) => {
        setEmail(event.target.value);
    };

    const handleEmailInput = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordInput = (event) => {
        setPassword(event.target.value);
    };

    const handleBirthdateInput = (event) => {
        setEmail(event.target.value);
    };

    return (
        <>
            <Header />
            <h1>Create your Remoire account</h1>
            <Card id="card-registration">
                <h3>Card!</h3>
                <form action="" method="post" class="registration">
                    <Field label="Username" onChange={handleUsernameInput} type="text" name="username" placeholder="MarioRossi88" />
                    <Field label="Email" onChange={handleEmailInput} type="text" name="email" placeholder="Email" />
                    <Field label="Password" onChange={handlePasswordInput} type="password" name="password" placeholder="Create a password" />
                    <Field label="Birthdate" onChange={handleBirthdateInput} type="date" name="birthdate" placeholder="11-12-2024" />
                    <button type="submit">Sign up</button>
                </form>
            </Card>
        </>
    );
};

export default SignUpPage;