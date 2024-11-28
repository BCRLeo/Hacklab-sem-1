import Header from "../../components/Header/Header";

import { UserContext } from "../../UserContext";
import { useContext } from "react";

export default function ProfilePage() {
    const { user, setUser } = useContext(UserContext);

    if (user && user !== -1) {
        return (
            <>
                <Header />
                <h1>{user.username}</h1>
            </>
        );
    }
    return (
        <>
            <Header />
            {user && user !== -1 ? <h1>{user.username}</h1> : <h1>Profile</h1>}
        </>
    );
}