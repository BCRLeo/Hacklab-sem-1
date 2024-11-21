import "./FeedPage.css"

import Sab from "../../assets/images/sab.jpeg";
import Liv from "../../assets/images/liv.jpeg";
import Niall from "../../assets/images/niall.jpeg";
import Wallows from "../../assets/images/wallows.jpeg";
import Novo from "../../assets/images/novoamor.jpeg";
import Swing from "../../assets/images/swing.jpeg";
import Gracie from "../../assets/images/gracie.jpeg";

import Header from "../../components/Header/Header";
import Post from "../../components/Post/Post";

import { useEffect, useState } from "react";
import { useMediaQueryContext } from "../../MediaQueryContext";

export default function FeedPage() {
    const screenSize = useMediaQueryContext();

    const posts = [
        <Post className="feed-post" image={Sab}/>,
        <Post className="feed-post" image={Wallows}/>,
        <Post className="feed-post" image={Liv}/>,
        <Post className="feed-post" image={Niall}/>,
        <Post className="feed-post" image={Gracie}/>,
        <Post className="feed-post" image={Novo}/>,
        <Post className="feed-post" image={Wallows}/>,
        <Post className="feed-post" image={Sab}/>,
        <Post className="feed-post" image={Swing}/>,
        <Post className="feed-post" image={Gracie}/>
    ]

    const [postWidth, setPostWidth] = useState(0);
    const [columns, setColumns] = useState([]);

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

    

    return (
        <>
            <Header />
            <h1>Feed</h1>
            <div className="feed-container">
                {/* {posts} */}
                {columns}
            </div>
            <button />
        </>
    );
};