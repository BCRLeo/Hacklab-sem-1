import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';
import { Link } from 'react-router-dom';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        // Add click listener to the document
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Cleanup the event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = async (event) => {
        const searchQuery = event.target.value;
        setQuery(searchQuery);

        // Only search if query is not empty
        if (searchQuery.trim()) {
            try {
                const response = await fetch('/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ query: searchQuery }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setUsers(data.userNames || []);
                    setError(null);
                    setShowResults(true);
                } else {
                    setUsers([]);
                    setError(data.message || 'No results found.');
                    setShowResults(true);
                }
            } catch (error) {
                console.error('Error during search: ', error);
                setUsers([]);
                setError('An error occurred during the search.');
                setShowResults(true);
            }
        } else {
            setUsers([]);
            setError(null);
            setShowResults(false);
        }
    };

    return (
        <div className="searchbar-container" ref={containerRef}>
            <div className="searchbar">
                <input
                    type="text"
                    name="search"
                    placeholder="Search"
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => {
                        if (users.length > 0 || error) {
                            setShowResults(true);
                        }
                    }}
                />
            </div>

            {showResults && (
                <div className="search-results">
                    {error && <div className="search-error">{error}</div>}

                    {!error && users.length > 0 && (
                        <ul>
                            {users.map((username, index) => (
                                <li key={index}>
                                    {/* Wrap each username in a Link component */}
                                    <Link to={`/${username}`} className="search-result-link">
                                        {username}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    {!error && users.length === 0 && query.trim() && (
                        <div className="no-results">No users found</div>
                    )}
                </div>
            )}
        </div>
    );
}
