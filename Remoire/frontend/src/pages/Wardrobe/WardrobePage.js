import "./WardrobePage.css"

import Bar from "../../components/Bar/Bar";
import Carousel from "../../components/Carousel/Carousel";
import Field from "../../components/Field/Field";
import Header from "../../components/Header/Header";
import Icon from "../../components/Icon/Icon";
import Loading from "../../components/Loading/Loading";
import Popover from "../../components/Popover/Popover";
import ToggleButton from "../../components/ToggleButton/ToggleButton";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

export default function WardrobePage() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [file, setFile] = useState(null);
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

    const [status, setStatus] = useState("");

    const getImages = async (itemType, setImagesCallback) => {
        try {
            const response = await fetch(`/api/images/${itemType}`, {
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
    }

    useEffect(() => {
        if (user === null) {
            setIsUserLoading(true);
            return;
        }
        setIsUserLoading(false);
        if (user === -1) {
            navigate("/login");
        }
        getAllImages();
        setIsPendingUpdate(false);
    }, [user, uploadStatus, isPendingUpdate]);

    if (isUserLoading) {
        return (
            <Loading />
        );
    }

    const handleClothingClick = async (event) => {
        if (event.target.className !== "carousel-image") {
            return;
        }

        const url = new URL(event.target.src);
        const path = url.pathname;
        const query = url.search;
        const newPath = path.replace("/api/images/", "/api/delete-item/") + query;
        console.log(newPath);

        try {
            const response = await fetch(newPath, {
                method: "DELETE"
            });

            const data = await response.json();
            if (response.ok && data.success) {
                console.log(`${newPath} successfully deleted`);
                setIsPendingUpdate(true);
                return;
            }
            console.log("Image deletion failed: ", data.message);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleSubmit = async (event) => {
        setIsUploading(true);
        event.preventDefault();
        if (!file) {
            setUploadStatus("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);

        try {
            setUploadStatus("Uploading file");
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                setUploadStatus("File uploaded successfully");
                event.target.reset();
            } else {
                setUploadStatus("Failed to upload file");
            }
        } catch (error) {
            console.error("Error: ", error);
            setUploadStatus("An error occurred while uploading the file");
        }
        setIsUploading(false);
    };

    return (
        <>
            <Header />
            {user ? <h1>{user.username}'s wardobe</h1> : <h1>Wardrobe</h1>}

            <Bar orientation="horizontal">
                <Popover label="Upload item">
                    <form onSubmit={handleSubmit} method="post" className="upload">
                        <Field label="Upload item" onChange={handleFileChange} type="file" name="item" />
                        <Field label="Clothing category">
                            <select name="category" onChange={handleCategoryChange}>
                                <option value="">Select a clothing category</option>
                                <option value="jacket">Jacket</option>
                                <option value="shirt">Shirt</option>
                                <option value="trouser">Trousers</option>
                                <option value="shoe">Shoes</option>
                            </select>
                        </Field>
                        {!isUploading ?
                            <button type="submit" className="button-upload">
                                <span>Upload</span>
                            </button>
                        :
                            <button type="button" className="button-uploading">
                                <span>Uploading...</span>
                            </button>
                        }
                    </form>
                    <p id="upload-status">{uploadStatus}</p>
                </Popover>
                <ToggleButton labels={{"before": "Edit", "after": "Done"}} content={{"before": <Icon name="editIcon" />, "after": <Icon name="checkIcon" />}} />
            </Bar>

            <div className="wardrobe-carousel-container" onClick={handleClothingClick}>
                {jackets.length === 0 ? (
                    <p>No jackets available.</p>
                ) : (
                    <Carousel id="carousel-jackets" images={jackets.map((image) => image.url)} />
                )}

                {shirts.length === 0 ? (
                    <p>No shirts available.</p>
                ) : (
                    <Carousel id="carousel-shirts" images={shirts.map((image) => image.url)} />
                )}

                {trousers.length === 0 ? (
                    <p>No trousers available.</p>
                ) : (
                    <Carousel id="carousel-trousers" images={trousers.map((image) => image.url)} />
                )}

                {shoes.length === 0 ? (
                    <p>No shoes available.</p>
                ) : (
                    <Carousel id="carousel-shoes" images={shoes.map((image) => image.url)} />
                )}
            </div>
        </>
    );
}