import "./Clothes.css";

import { getClothingImageEndpoints, getUserClothingImageEndpoints, createOutfit, uploadClothingImages } from "../../api/wardrobe";

import Bar from "../../components/Bar/Bar";
import Button from "../../components/Button/Button";
import Carousel from "../../components/Carousel/Carousel";
import ClothesCarousel from "../ClothesCarousel/ClothesCarousel";
import Field from "../../components/Field/Field";
import Icon from "../../components/Icon/Icon";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import Loading from "../../components/Loading/Loading";
import Popover from "../../components/Popover/Popover";
import TabBar from "../../components/TabBar/TabBar";
import ToggleButton from "../../components/ToggleButton/ToggleButton";

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../UserContext";

export default function Clothes() {
    const navigate = useNavigate();
    const { username } = useParams();
    const { user, setUser } = useContext(UserContext);
    const [files, setFiles] = useState([]);
    const [category, setCategory] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");

    const [isUploadPopoverToggled, setIsUploadPopoverToggled] = useState(false);

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
    const [clickedClassName, setClickedClassName] = useState("");

    const getImages = async (itemType, setImagesCallback) => {
        const data = username ? await getUserClothingImageEndpoints(username, itemType) : await getClothingImageEndpoints(itemType);
        if (data === null) {
            console.error(`"Failed to fetch ${itemType} image list"`);
            setIsLoading(false);
            return;
        }

        setImagesCallback(data);
        setIsLoading(false);
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
        getAllImages();
        setIsPendingUpdate(false);
    }, [user, uploadStatus, isPendingUpdate]);

    const toggleIsEditing = () => {
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
            if (await createOutfit(newOutfit)) {
                console.log("Successfully created outfit");
            }
        }
        
        setIsChoosingOutfit(isChoosingOutfit => !isChoosingOutfit);
    };

    useEffect(() => {
        if (isEditing) {
            setHoveredClassName(deleteHoveredClassName);
            setClickedClassName("");
        } else if (isChoosingOutfit) {
            setHoveredClassName(chooseHoveredClassName);
            setClickedClassName(outfitClassName);
        } else {
            setHoveredClassName("");
            setClickedClassName("");
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
            const clothingId = event.target.dataset.clothingId;
            console.log(clothingId);

            if (itemClassName.includes("jacket")) {
                setNewOutfit({
                    ...newOutfit,
                    "jacket": clothingId
                });
            } else if (itemClassName.includes("shirt")) {
                setNewOutfit({
                    ...newOutfit,
                    "shirt": clothingId
                });
            } else if (itemClassName.includes("trouser")) {
                setNewOutfit({
                    ...newOutfit,
                    "trousers": clothingId
                });
            } else if (itemClassName.includes("shoe")) {
                setNewOutfit({
                    ...newOutfit,
                    "shoes": clothingId
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
        event.preventDefault();
        if (!files || files.length === 0) {
            setUploadStatus("Please select at least one file");
            return;
        }
        setIsUploading(true);

        if (files.length > 1) {
            setUploadStatus(`Uploading ${files.length} files...`);
        } else {
            setUploadStatus("Uploading file...");
        }

        (async () => {
            const data = await uploadClothingImages(files, category);
            if (data === 0) {
                setUploadStatus(`Failed to upload ${files.length > 1 ? `${files.length} of ${files.length} files` : "file"}.`);
            } else if (data < files.length) {
                setUploadStatus(`Uploaded ${data} of ${files.length} files. Failed to upload ${data > 1 ? `${data} files` : "1 file"}.`);
                setIsPendingUpdate(true);
            } else {
                setUploadStatus(`${files.length === 1 ? "File" : `All ${files.length} files`} uploaded successfully.`);
                setIsPendingUpdate(true);
            }
            setIsUploading(false);
            event.target.reset();
        })();
    };

    return (
        <>
            {!username && <Bar orientation="horizontal">
                <Popover
                    className="upload-popover"
                    renderToggle={(dropdownProps) => <Button text="Upload" {...dropdownProps}><Icon name="uploadIcon" /></Button>}
                    onToggle={() => setUploadStatus("")}
                >
                    <form onSubmit={handleSubmit} method="post" className="upload">
                        <Field label="Upload item" onChange={handleFileChange} type="file" name="item" accept="image/png, image/jpeg, image/webp" multiple disabled={isUploading} />
                        <Field label="Clothing category">
                            <select name="category" onChange={handleCategoryChange} disabled={isUploading}>
                                <option value="">Select a clothing category</option>
                                <option value="jacket">Jacket</option>
                                <option value="shirt">Shirt</option>
                                <option value="trouser">Trousers</option>
                                <option value="shoe">Shoes</option>
                            </select>
                        </Field>
                        <Button text={isUploading ? "Uploading..." : "Upload"} type="submit" className={isUploading ? "uploading" : "upload"} disabled={isUploading} />
                    </form>
                    <p id="upload-status">{uploadStatus}</p>
                </Popover>
                <ToggleButton labels={{"before": "Edit", "after": "Done"}} content={{"before": <Icon name="editIcon" />, "after": <Icon name="checkIcon" />}} isToggled={isEditing} onClick={toggleIsEditing} />
                <ToggleButton labels={{"before": "Create outfit", "after": "Done"}} content={{"before": <Icon name="hangerIcon" />, "after": <Icon name="checkIcon" />}} isToggled={isChoosingOutfit} onClick={toggleIsChoosingOutfit} />
            </Bar>}
            


            <div className="clothes-carousel-container" onClick={handleClothingClick}>
                {jackets.length === 0 ? (
                    <p>No jackets available.</p>
                ) : (
                    <ClothesCarousel
                        className="clothes-carousel"
                        itemType="jacket"
                        imageClassName="jacket"
                        hoveredClassName={hoveredClassName}
                        clickedClassName={clickedClassName}
                        isPendingUpdate={isPendingUpdate}
                    />
                )}

                {shirts.length === 0 ? (
                    <p>No shirts available.</p>
                ) : (
                    <ClothesCarousel
                        className="clothes-carousel"
                        itemType="shirt"
                        imageClassName="shirt"
                        hoveredClassName={hoveredClassName}
                        clickedClassName={clickedClassName}
                        isPendingUpdate={isPendingUpdate}
                    />
                )}

                {trousers.length === 0 ? (
                    <p>No trousers available.</p>
                ) : (
                    <ClothesCarousel
                        className="clothes-carousel"
                        itemType="trousers"
                        imageClassName="trouser"
                        hoveredClassName={hoveredClassName}
                        clickedClassName={clickedClassName}
                        isPendingUpdate={isPendingUpdate}
                    />
                )}

                {shoes.length === 0 ? (
                    <p>No shoes available.</p>
                ) : (
                    <ClothesCarousel
                        className="clothes-carousel"
                        itemType="shoes"
                        imageClassName="shoe"
                        hoveredClassName={hoveredClassName}
                        clickedClassName={clickedClassName}
                        isPendingUpdate={isPendingUpdate}
                    />
                )}
            </div>
        </>
    );
}