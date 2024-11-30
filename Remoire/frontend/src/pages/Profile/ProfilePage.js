import "./ProfilePage.css";

import { getProfile } from "../../api/profile";

import Bar from "../../components/Bar/Bar";
import Header from "../../components/Header/Header";
import Icon from "../../components/Icon/Icon";
import NavItem from "../../components/NavItem/NavItem";
import Post from "../../components/Post/Post";
import TabBar from "../../components/TabBar/TabBar";

import { UserContext } from "../../UserContext";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";

export default function ProfilePage() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    
    const location = useLocation();

    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        (async () => {
            const data = await getProfile(username);
            if (data) {
                setProfile(data);
            }
        })();
    }, []);

    if (profile) {
        return (
            <>
                <h1>{profile.username}</h1>
                <Icon className="profile-icon" name="accountIcon" size="xl" />
                <p>bio test test i'm so cool test test fashion whatever</p>
                <TabBar orientation="horizontal" links={[
                    {
                        "href": `/${profile.username}/posts`,
                        "label": "Posts"
                    },
                    {
                        "href": `/${profile.username}/wardrobe`,
                        "label": "Wardrobe"
                    },
                    {
                        "href": `/${profile.username}/outfits`,
                        "label": "Outfits"
                    }
                    ]} />
                <Outlet />
            </>
        );
    }

    return (
        <>
            <p>{username}'s profile could not be found.</p>
        </>
    );
}