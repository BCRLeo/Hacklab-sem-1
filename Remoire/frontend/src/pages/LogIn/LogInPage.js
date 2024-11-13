import Card from "../../components/Card/Card";
import Field from "../../components/Field/Field";
import Header from "../../components/Header/Header";

const LogInPage = () => {
    return (
        <>
            <Header />
            <h1>Welcome to Remoire</h1>
            <Card id="card-login">
                <h3>Card!</h3>
                <form action="" method="post" class="login">
                    <Field label="Email" type="text" name="email" placeholder="Email" />
                    <Field label="Password" type="password" name="password" placeholder="Create a password" />
                    <button type="submit">Log in</button>
                </form>
            </Card>
        </>
    );
};

export default LogInPage;