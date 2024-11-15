import "./WardrobePage.css"

import Carousel from "../../components/Carousel/Carousel";
import Field from "../../components/Field/Field";
import Header from "../../components/Header/Header";
import Popover from "../../components/Popover/Popover";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

const importAllImages = (requireContext) => {
    return requireContext.keys().map(requireContext);
};

const images = importAllImages(require.context('../../assets/images', false, /\.(png|jpe?g|svg|webp)$/));

const WardrobePage = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [jackets, setJackets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getJackets = async () => {
        try {
            const response = await fetch("/api/images", {
                method: "GET"
            });
            
            if (response.ok) {
                const data = await response.json()
                setJackets(data);
            } else {
                console.error('Failed to fetch image list');
            }
        } catch (error) {
            console.error("Error: ", error);
            setUploadStatus("An error occurred while uploading the file")
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
        getJackets();
    }, [user, navigate]);

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
            {user ? <h1>{user.username}'s wardobe</h1> : <h1>Wardrobe</h1>}
            <div className="wardrobe-carousel-container">
                {isLoading ? <p>loading</p> : 
                    <div>
                        {jackets.length === 0 ? (
                        <p>No images available.</p>
                        ) : (
                        jackets.map((image) => (
                            <div key={image.id} style={{ marginBottom: '20px' }}>
                            <img src={image.url} alt={image.type} style={{ width: '100%', maxWidth: '400px' }} />
                            </div>
                        ))
                        )}
                    </div>
                }
                <Carousel id="carousel-tops" images={images} />
                <Carousel id="carousel-bottoms" images={images} />
            </div>

            <Popover label="Upload item">
                <form onSubmit={handleSubmit} method="post" className="upload">
                    <Field label="Upload item" onChange={handleFileChange} type="file" name="item" />
                    <button type="submit">
                        <span>Upload</span>
                    </button>
                </form>
            </Popover>
        </>
    );
};

export default WardrobePage;