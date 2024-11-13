import "./SignUpPage.css"

import Card from "../../components/Card/Card";
import Field from "../../components/Field/Field";
import Header from "../../components/Header/Header";

const SignUpPage = () => {
    return (
        <>
            <Header />
            <h1>Create your Remoire account</h1>
            <Card id="card-registration">
                <h3>Card!</h3>
                <form action="" method="post" class="registration">
                    <Field label="Username" type="text" name="username" placeholder="MarioRossi88" />
                    <Field label="Email" type="text" name="email" placeholder="Email" />
                    <Field label="Password" type="password" name="password" placeholder="Create a password" />
                    <Field label="Birthdate" type="" name="birthdate" placeholder="11-12-2024" />
                    <button type="submit">Sign up</button>
                </form>
            </Card>
        </>
    );
};

export default SignUpPage;