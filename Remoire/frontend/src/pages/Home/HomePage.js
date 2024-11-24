import Header from "../../components/Header/Header";

import { useContext } from "react";
import { UserContext } from "../../UserContext";

export default function HomePage() {
    const { user, setUser } = useContext(UserContext);
    return (
        <>
            <Header />
            {user && user.isLoggedIn ? <h1>Hi, {user.username}</h1> : <h1>Home</h1>}
        </>
    );
}