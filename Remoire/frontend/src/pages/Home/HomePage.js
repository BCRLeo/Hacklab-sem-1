import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";

const HomePage = () => {
    const [name, setname] = useState("");
    const suckmynuts = async () => {
        const display = await fetch("/api/check-login");
        const data = await display.json();
        
        if (display.ok){
            if (data.success){
                setname(data.user.username);
                
            }
        }
    

    }
    useEffect(()=>{suckmynuts()}, [])
    return (
        <>
            <Header />
            <h1>hello, {name}</h1>
        </>
    );
};

export default HomePage;

