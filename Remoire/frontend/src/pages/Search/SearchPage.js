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
                    query: query
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
    
            if (response.ok && data.success) {
                console.log(data);
                const userNames = data.userNames; // Assuming this is an array
                if (userNames && Array.isArray(userNames)) {
                    setText(userNames.join("\n")); // Join usernames with newline character
                    console.log(userNames.join("\n"));
                }
            } else {
                setText(data.message || "No results found.");
            }
        } catch (error) {
            console.error("Error during search: ", error);
            setText("An error occurred during the search.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} method="POST"> 
                <Field label="Search bar" onChange={handleSearch} type="text" name="search" placeholder="Username" />
                <button type="submit">Search</button>
                <pre>{text}</pre>
            </form>

        
        </>
    );
}