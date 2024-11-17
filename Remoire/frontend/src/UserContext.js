import React, { createContext, useState, useEffect } from 'react';

// Create a UserContext
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch('/api/check-login');
                const data = await response.json();

                if (data.success) {
                    setUser(data.user);
                } else {
                    setUser(-1);
                }
            } catch (error) {
                console.error('Error fetching login status:', error);
            }
        };

        checkLoginStatus();
    }, []); // Empty dependency array to run only once when the component mounts


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
