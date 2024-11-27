import "./FeedPage.css"

import Sab from "../../assets/images/sab.jpeg";
import Liv from "../../assets/images/liv.jpeg";
import Niall from "../../assets/images/niall.jpeg";
import Wallows from "../../assets/images/wallows.jpeg";
import Novo from "../../assets/images/novoamor.jpeg";
import Swing from "../../assets/images/swing.jpeg";
import Gracie from "../../assets/images/gracie.jpeg";

import Button from "../../components/Button/Button";
import Field from "../../components/Field/Field";
import Header from "../../components/Header/Header";
import Popover from "../../components/Popover/Popover";
import Post from "../../components/Post/Post";

import { useEffect, useState } from "react";
import { useMediaQueryContext } from "../../MediaQueryContext";

export default function FeedPage() {
    const screenSize = useMediaQueryContext();

    const [posts, setPosts] = useState([]); 
    const [postWidth, setPostWidth] = useState(0);
    const [columns, setColumns] = useState([]);
    
    const [postFile, setPostFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");

    const fetchPosts = async () => {
        try {
            const response = await fetch("/api/posts", {
                method: "GET"
            });

            if (response.ok) {
                const data = await response.json();
                setPosts(data.map((source) => {<img src={source}/>})); // Save posts to state
            } else {
                console.error("Failed to fetch posts");
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };


    const handleFileChange = (event) => {
        setPostFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsUploading(true);
        if (!postFile) {
            setUploadStatus("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", postFile);

        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                setUploadStatus("File uploaded successfully");
                fetchPosts(); // Refresh posts after upload
            } else {
                setUploadStatus("Failed to upload file");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploadStatus("An error occurred while uploading the file");
        }
        setIsUploading(false);
    };

    
    useEffect(() => {
        const rootStyles = getComputedStyle(document.documentElement);
        const width = rootStyles.getPropertyValue("--width__post");
        const columnCount = rootStyles.getPropertyValue("--count__post-columns");
        let columnDivs = [];

        setPostWidth(width.trim());

        for (let i = 0; i < columnCount; i++) {
            columnDivs.push([]);
        }

        for (let i = 0; i < posts.length; i++) {
            columnDivs[i % columnCount].push(posts[i]);
        }
        console.log(columnDivs);
        setColumns(columnDivs.map((column, i) => {
            return (<div id={`column-${i}`} className="column">{column}</div>)
        }));
    }, [screenSize]);

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <>
            <Header />
            <h1>Feed</h1>
            <div className="feed-container">
                {/* posts */}
                {columns}
            </div>
            
            <Popover renderToggle={(dropdownProps) => <Button {...dropdownProps}>Create post</Button>}>
                <form onSubmit={handleSubmit} method="post" className="upload">
                    <Field label="Upload item" onChange={handleFileChange} type="file" name="item" />
                    {!isUploading ?
                        <button type="submit" className="button-upload">
                            <span>Post</span>
                        </button>
                    :
                        <button type="button" className="button-uploading">
                            <span>Posting...</span>
                        </button>
                    }
                </form>
                <p id="upload-status">{uploadStatus}</p>
            </Popover>
        </>
    );
}