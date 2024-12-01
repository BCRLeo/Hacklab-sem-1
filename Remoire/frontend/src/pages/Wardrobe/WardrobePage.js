import "./WardrobePage.css"

import { postOutfit } from "../../api/wardrobe";

import Bar from "../../components/Bar/Bar";
import Button from "../../components/Button/Button";
import Carousel from "../../components/Carousel/Carousel";
import Field from "../../components/Field/Field";
import Header from "../../components/Header/Header";
import Icon from "../../components/Icon/Icon";
import Loading from "../../components/Loading/Loading";
import Popover from "../../components/Popover/Popover";
import TabBar from "../../components/TabBar/TabBar";
import ToggleButton from "../../components/ToggleButton/ToggleButton";

import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

export default function WardrobePage() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [files, setFiles] = useState([]);
    const [category, setCategory] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");

    const [jackets, setJackets] = useState([]);
    const [shirts, setShirts] = useState([]);
    const [trousers, setTrousers] = useState([]);
    const [shoes, setShoes] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isPendingUpdate, setIsPendingUpdate] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [isChoosingOutfit, setIsChoosingOutfit] = useState(false);
    const [newOutfit, setNewOutfit] = useState({});

    const [status, setStatus] = useState("");

    const outfitClassName = "outfit";
    const chooseHoveredClassName = "choose"
    const deleteHoveredClassName = "delete";
    const [hoveredClassName, setHoveredClassName] = useState("");

    /* const getImages = async (itemType, setImagesCallback) => {
        try {
            const response = await fetch(`/api/wardrobe/items/${itemType}`, {
                method: "GET"
            });

            if (response.ok) {
                const data = await response.json();
                if (data) {
                    setImagesCallback(data);
                }
            } else {
                console.error(`"Failed to fetch ${itemType} image list"`);
            }
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const getAllImages = async () => {
        setIsLoading(true);
        try {
            await getImages("jacket", setJackets);
            await getImages("shirt", setShirts);
            await getImages("trousers", setTrousers);
            await getImages("shoes", setShoes);
        } catch (error) {
            console.error("Error: ", error);
        }
    } */

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

    /* const toggleIsEditing = () => {
        if (isChoosingOutfit && !isEditing) {
            setIsChoosingOutfit(false);
        }
        setIsEditing(isEditing => !isEditing);
    };

    const toggleIsChoosingOutfit = async () => {
        if (isEditing && !isChoosingOutfit) {
            setIsEditing(false);
        }

        if (isChoosingOutfit) {
            if (await postOutfit(newOutfit)) {
                console.log("Successfully created outfit");
            }
        }

        setIsChoosingOutfit(isChoosingOutfit => !isChoosingOutfit);
    };

    useEffect(() => {
        if (isEditing) {
            setHoveredClassName(deleteHoveredClassName);
        } else if (isChoosingOutfit) {
            setHoveredClassName(chooseHoveredClassName);
        } else {
            setHoveredClassName("");
        }
    }, [isEditing, isChoosingOutfit]);

    const handleClothingClick = async (event) => {
        const itemClassName = event.target.className;
        if (!itemClassName.includes("carousel-image")) {
            return;
        }

        const url = new URL(event.target.src);
        const searchParams = url.searchParams;
        if (isEditing) {
            try {
                const response = await fetch(url, {
                    method: "DELETE"
                });

                const data = await response.json();
                if (response.ok && data.success) {
                    console.log(`Item ${searchParams.get("id")} successfully deleted`);
                    setIsPendingUpdate(true);
                    return;
                }
                console.log("Image deletion failed: ", data.message);
            } catch (error) {
                console.error("Error: ", error);
            }
        } else if (isChoosingOutfit) {
            if (itemClassName.includes("jacket")) {
                setNewOutfit({
                    ...newOutfit,
                    "jacket": searchParams.get("id")
                });
            } else if (itemClassName.includes("shirt")) {
                setNewOutfit({
                    ...newOutfit,
                    "shirt": searchParams.get("id")
                });
            } else if (itemClassName.includes("trouser")) {
                setNewOutfit({
                    ...newOutfit,
                    "trousers": searchParams.get("id")
                });
            } else if (itemClassName.includes("shoe")) {
                setNewOutfit({
                    ...newOutfit,
                    "shoes": searchParams.get("id")
                });
            }
        }
    };

    const handleFileChange = (event) => {
        setFiles(Array.prototype.slice.call(event.target.files))
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleSubmit = async (event) => {
        setIsUploading(true);
        event.preventDefault();
        if (!files || files.length === 0) {
            setUploadStatus("Please select at least one file");
            return;
        }

        const uploadFile = async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("category", category);

            try {
                const response = await fetch("/api/wardrobe/items", {
                    method: "POST",
                    body: formData
                });
    
                if (response.ok) {
                    return { success: true, file: file.name };
                } else {
                    return { success: false, file: file.name };
                }
            } catch (error) {
                console.error("Error uploading file: ", file.name, error);
                return { success: false, file: file.name, error };
            }
        };

        if (files.length > 1) {
            setUploadStatus(`Uploading ${files.length} files...`);
        } else {
            setUploadStatus("Uploading file...");
            const result = await uploadFile(files[0]);
            if (result.success) {
                setUploadStatus("File uploaded successfully.");
            } else {
                setUploadStatus("Failed to upload file.");
            }
            setIsUploading(false);
            event.target.reset();
            return;
        }

        let successfulUploads = 0;
        let failedUploads = 0;

        const uploadPromises = files.map(file =>
            uploadFile(file).then((result) => {
                if (result.success) {
                    successfulUploads++;
                    console.log(`Successfully uploaded: ${result.file}`);
                } else {
                    failedUploads++;
                    console.log(`Failed to upload: ${result.file}`);
                }

                if (failedUploads > 0) {
                    setUploadStatus(`Uploaded ${successfulUploads} of ${files.length} files. Failed to upload ${failedUploads} files.`);
                } else {
                    setUploadStatus(`Uploaded ${successfulUploads} of ${files.length} files.`);
                }
                return result;
            })
        );
        await Promise.all(uploadPromises);

        if (failedUploads > 0) {
            setUploadStatus(`${successfulUploads} of ${files.length} files uploaded successfully.`);
        } else {
            setUploadStatus("All files uploaded successfully.");
        }

        setIsUploading(false);
        event.target.reset();
    }; */

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