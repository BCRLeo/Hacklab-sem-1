import "./WardrobePage.css"

import Loading from "../../components/Loading/Loading";
import TabBar from "../../components/TabBar/TabBar";

import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../UserContext";

export default function WardrobePage() {
    const navigate = useNavigate();
    const { username } = useParams();
    const { user } = useContext(UserContext);
    const [uploadStatus, setUploadStatus] = useState("");
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [isPendingUpdate, setIsPendingUpdate] = useState(false);
    

    useEffect(() => {
        if (user === null) {
            setIsUserLoading(true);
            return;
        }
        setIsUserLoading(false);
        if (user === -1) {
            navigate("/login");
        }
        //getAllImages();
        setIsPendingUpdate(false);
    }, [user, uploadStatus, isPendingUpdate]);

    if (isUserLoading) {
        return (
            <Loading />
        );
    }

    return (
        <>
            {user ? <h1>{user.username}'s wardobe</h1> : <h1>Wardrobe</h1>}
            <TabBar
                orientation="horizontal"
                links={[
                    {
                        href: "/wardrobe/clothes",
                        label: "Clothes"
                    },
                    {
                        href: "/wardrobe/outfits",
                        label: "Outfits"
                    }
                ]}
            />
            <Outlet />
        </>
    );
}