import "./ProfilePage.css";

import { getProfile } from "../../api/profile";

import Bar from "../../components/Bar/Bar";
import Header from "../../components/Header/Header";
import Icon from "../../components/Icon/Icon";
import NavItem from "../../components/NavItem/NavItem";
import Post from "../../components/Post/Post";
import TabBar from "../../components/TabBar/TabBar";
import Button from "../../components/Button/Button";
import Field from "../../components/Field/Field";
import Popover from "../../components/Popover/Popover";

import { UserContext } from "../../UserContext";
import { useContext, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

export default function ProfilePage() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    const { user } = useContext(UserContext);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await getProfile(username);
                if (data) {
                    setProfile(data);
                    // Set initial profile picture URL
                    setProfilePictureUrl(`/api/users/${data.id}/profile-picture`);
                } else {
                    setProfile(null);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setProfile(null);
            }
        }
        fetchProfile();
    }, [username]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        
        // Basic file validation
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            setUploadStatus("Invalid file type. Please upload a JPEG, PNG, or GIF.");
            return;
        }

        if (file.size > maxSize) {
            setUploadStatus("File is too large. Maximum size is 5MB.");
            return;
        }

        setSelectedFile(file);
        setUploadStatus(""); // Clear previous status
    };

    const handleUpload = async () => {
        setIsUploading(true);
        setUploadStatus("");

        if (!selectedFile) {
            setUploadStatus("Please select a file first.");
            setIsUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch(`/api/users/${profile.id}/upload-profile-picture`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                // Update profile picture URL immediately
                setProfilePictureUrl('/api/users/${profile.id}/profile-picture}');
                setUploadStatus("Profile picture uploaded successfully.");
                setSelectedFile(null);
            } else {
                setUploadStatus(data.message || "Failed to upload profile picture.");
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            setUploadStatus("An error occurred. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    if (!profile) {
        return <p>{username}'s profile could not be found.</p>;
    }

    return (
        <>
            <h1>{profile.username}</h1>
            <div className="profile-picture-container">
                <img
                    className="profile-icon"
                    src={profilePictureUrl}
                    alt={`${profile.username}'s profile`}
                    onError={(e) => {
                        e.target.src = "/path/to/placeholder/image.jpg"; // Fallback image
                        e.target.onerror = null; // Prevent infinite loop
                    }}
                />
            </div>
                <p>bio test test i'm so cool test test fashion whatever</p>
            <TabBar
                orientation="horizontal"
                links={[
                    { href: `/${profile.username}/posts`, label: "Posts" },
                    { href: `/${profile.username}/clothes`, label: "Clothes" },
                    { href: `/${profile.username}/outfits`, label: "Outfits" },
                ]}
            />

            <Popover renderToggle={(dropdownProps) => <Button {...dropdownProps}>Upload Profile Picture</Button>}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpload();
                    }}
                    method="post"
                    className="upload"
                >
                    <Field
                        label="Upload Profile Picture"
                        onChange={handleFileChange}
                        type="file"
                        name="item"
                    />
                    <button 
                        type="submit" 
                        className={`button-${isUploading ? 'uploading' : 'upload'}`} 
                        disabled={isUploading}
                    >
                        <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    </button>
                </form>
                {uploadStatus && <p id="upload-status">{uploadStatus}</p>}
            </Popover>

            <Outlet />
        </>
    );
}