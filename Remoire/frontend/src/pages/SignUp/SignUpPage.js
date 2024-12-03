import "./SignUpPage.css"

import Card from "../../components/Card/Card";
import Field from "../../components/Field/Field";
import Header from "../../components/Header/Header";

import { NavLink, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../../UserContext";

export default function SignUpPage() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthday, setBirthday] = useState("");
    const [isInvalid, setIsInvalid] = useState({
        username: false,
        email: false,
        password: false,
        birthday: false
    });

    const [signupStatus, setSignupStatus] = useState("");

    const handleUsernameInput = (event) => {
        if (isInvalid.username) {
            setIsInvalid(isInvalid => ({...isInvalid, username: false}));
        }

        setUsername(event.target.value);
    };

    const handleEmailInput = (event) => {
        if (isInvalid.email) {
            setIsInvalid(isInvalid => ({...isInvalid, email: false}));
        }

        setEmail(event.target.value);
    };

    const handleBirthdayInput = (event) => {
        if (isInvalid.birthday) {
            setIsInvalid(isInvalid => ({...isInvalid, birthday: false}));
        }

        setBirthday(event.target.value);
    };

    const handlePasswordInput = (event) => {
        if (isInvalid.password) {
            setIsInvalid(isInvalid => ({...isInvalid, password: false}));
        }
        
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsInvalid({username: !Boolean(username), email: !Boolean(email), birthday: !Boolean(birthday), password: !Boolean(password)});
        if (!Boolean(username) || !Boolean(email) || !Boolean(birthday) || !Boolean(password)) {
            setSignupStatus("Fill in all fields.");
            return;
        }

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
                setSignupStatus(data.message);
                console.log("Signup failed: ", data.message);
                setIsInvalid({
                    username: true,
                    email: true,
                    password: true,
                    birthday: true
                });
            }
        } catch (error) {
            setSignupStatus(`Error during signup: ${error}`);
            console.error("Error during signup: ", error);
            setIsInvalid({
                username: true,
                email: true,
                password: true,
                birthday: true
            });
        }
    };

    return (
        <>
            <h1>Create your Remoire account</h1>
            <Card className="registration">
                <h3>Card!</h3>
                <form onSubmit={handleSubmit} method="post" class="registration">
                    <Field className={isInvalid.username ? "invalid" : ""} label="Username" onChange={handleUsernameInput} type="text" name="username" placeholder="MarioRossi88" aria-required />
                    <Field className={isInvalid.email ? "invalid" : ""} label="Email" onChange={handleEmailInput} type="text" name="email" placeholder="Email" aria-required />
                    <Field className={isInvalid.password ? "invalid" : ""} label="Password" onChange={handlePasswordInput} type="password" name="password" placeholder="Create a password" aria-required />
                    <Field className={isInvalid.birthday ? "invalid" : ""} label="Birthday" onChange={handleBirthdayInput} type="date" name="birthday" aria-required />
                    <button type="submit">Sign up</button>
                </form>
                <p>{signupStatus}</p>
                <NavLink to="/login" className="nav-link account">Already have an account?</NavLink>
            </Card>
        </>
    );
}