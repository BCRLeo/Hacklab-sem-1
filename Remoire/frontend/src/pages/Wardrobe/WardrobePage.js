import "./WardrobePage.css"

import Carousel from "../../components/Carousel/Carousel";
import Field from "../../components/Field/Field";
import Header from "../../components/Header/Header";
import Loading from "../../components/Loading/Loading";
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
    const [category, setCategory] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");

    const [jackets, setJackets] = useState([]);
    const [shirts, setShirts] = useState([]);
    const [trousers, setTrousers] = useState([]);
    const [shoes, setShoes] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isUserLoading, setIsUserLoading] = useState(true);

    const getJackets = async () => {
        try {
            const response = await fetch("/api/images/jacket", {
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
        if (user === null) {
            setIsUserLoading(true);
            return;
        }
        setIsUserLoading(false);
        if (user === -1) {
            navigate("/login");
        }
        getJackets();
    }, [user, navigate, uploadStatus]);

    if (isUserLoading) {
        return (
            <Loading />
        );
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setUploadStatus("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
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

        console.log(uploadStatus);
    };

    return (
        <>
            <Header />
            {user ? <h1>{user.username}'s wardobe</h1> : <h1>Wardrobe</h1>}
            <div className="wardrobe-carousel-container">
                {jackets.length === 0 ? (
                    <p>No images available.</p>
                ) : (
                    <Carousel id="carousel-jackets" images={jackets.map((image) => image.url)} />
                )}
                
                <Carousel id="carousel-tops" images={images} />
                <Carousel id="carousel-bottoms" images={images} />
            </div>

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
                    <button type="submit">
                        <span>Upload</span>
                    </button>
                </form>
            </Popover>
        </>
    );
};

export default WardrobePage;