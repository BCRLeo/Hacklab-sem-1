import "./ProfilePage.css";

import Header from "../../components/Header/Header";
import Icon from "../../components/Icon/Icon";

import { UserContext } from "../../UserContext";
import { useContext } from "react";

export default function ProfilePage() {
    const { user, setUser } = useContext(UserContext);

    if (user && user !== -1) {
        return (
            <>
                <Header />
                <Icon className="profile-icon" name="accountIcon" size="xl" />
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