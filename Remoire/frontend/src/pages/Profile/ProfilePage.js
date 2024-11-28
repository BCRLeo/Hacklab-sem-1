import Header from "../../components/Header/Header";

import { UserContext } from "../../UserContext";
import { useContext } from "react";

export default function ProfilePage() {
    const { user, setUser } = useContext(UserContext);

    return (
        <>
            <Header />
            {user ? <h1>{user.username}'s profile</h1> : <h1>Profile</h1>}
        </>
    );
}