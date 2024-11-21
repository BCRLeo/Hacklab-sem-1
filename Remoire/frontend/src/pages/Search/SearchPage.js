import { useState } from "react";
import Field from "../../components/Field/Field";

export default function SearchPage() {

    const [text, setText] = useState("");
    const [query, setQuery] = useState("");
    const handleSearch = (event) => {
        setQuery(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/search", 
        {
            method: "POST",
            body: JSON.stringify({
                query : query
            }),
            headers : {
                "Content-Type" : "application/json"
            }
        });
        const data = await response.json();
        

        if (response.ok && data.success){
            console.log(data);
            const userIds = await data.userIds;
            if (userIds) {
                setText(userIds);
                console.log(userIds);
            }
        }
        else{
            setText(data.message);
        }
        }
        catch(error){
            console.error("error during search: ", error);
        }
        
    };



    return (
        <>
            <form onSubmit={handleSubmit} method="POST"> 
                <Field label="Search bar" onChange={handleSearch} type="text" name="search" placeholder="Username" />
                <button type="submit">Search</button>
                <p>{text}</p>
            </form>

        
        </>
    );
};