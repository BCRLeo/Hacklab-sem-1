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

export default function FeedPage() {
    return (
        <>
            <Header />
            <h1>Feed</h1>
            <div className="feed-container">
                <Post className="feed-post" image={Sab}/>
                <Post className="feed-post" image={Liv}/>
                <Post className="feed-post" image={Niall}/>
                <Post className="feed-post" image={Gracie}/>
                <Post className="feed-post" image={Wallows}/>
                <Post className="feed-post" image={Novo}/>
                <Post className="feed-post" image={Wallows}/>
                <Post className="feed-post" image={Sab}/>
                <Post className="feed-post" image={Swing}/>
                <Post className="feed-post" image={Gracie}/>
            </div>
            <button />
        </>
    );
};