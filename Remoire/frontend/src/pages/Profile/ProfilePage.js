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
                <Icon class="profile-icon" name="accountIcon" size="xl" />
                <h1>{user.username}</h1>
            </>
        );
    }

    return (
        <>
            <Header />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
                <rect x="10" y="10" width="50" height="80" fill="#8B4513" stroke="black" stroke-width="2" />

                <path d="M60 10 Q90 25 60 50" fill="#8B4513" stroke="black" stroke-width="2" />

                <rect x="35" y="50" width="25" height="40" fill="#8B4513" stroke="black" stroke-width="2" />

                <line x1="35" y1="10" x2="35" y2="50" stroke="black" stroke-width="2" />
                <circle cx="32" cy="30" r="2" fill="black" />
                <circle cx="38" cy="30" r="2" fill="black" />

                <line x1="10" y1="40" x2="35" y2="40" stroke="black" stroke-width="1" />
            </svg>

            {user && user !== -1 ? <h1>{user.username}</h1> : <h1>Profile</h1>}
        </>
    );
}