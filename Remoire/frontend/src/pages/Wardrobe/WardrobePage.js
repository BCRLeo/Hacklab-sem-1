import "./WardrobePage.css"

import Carousel from "../../components/Carousel/Carousel";
import Field from "../../components/Field/Field";
import Header from "../../components/Header/Header";
import Popover from "../../components/Popover/Popover";

import { useContext, useState } from "react";
import { UserContext } from "../../UserContext";

const importAllImages = (requireContext) => {
    return requireContext.keys().map(requireContext);
};

const images = importAllImages(require.context('../../assets/images', false, /\.(png|jpe?g|svg|webp)$/));

const WardrobePage = () => {
    const { user, setUser } = useContext(UserContext);
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setUploadStatus("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                setUploadStatus("File uploaded successfully");
            } else {
                setUploadStatus("Failed to upload file");
            }
        } catch (error) {
            console.error("Error: ", error);
            setUploadStatus("An error occurred while uploading the file")
        }
    };

    return (
        <>
            <Header />
            {(user && user.isLoggedIn) ? <h1>{user.username}'s wardobe</h1> : <h1>Wardrobe</h1>}
            <div className="wardrobe-carousel-container">
                <Carousel id="carousel-tops" images={images} />
                <Carousel id="carousel-bottoms" images={images} />
            </div>
            <form onSubmit={handleSubmit} method="post" className="upload">
                <Field label="Upload item" onChange={handleFileChange} type="file" name="item" />
                <button type="submit">
                    <span>Upload</span>
                </button>
            </form>

            <Popover label="Upload item">
                <h1>hi</h1>
            </Popover>
        </>
    );
};

export default WardrobePage;