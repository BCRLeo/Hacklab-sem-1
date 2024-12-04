import Button from "../../components/Button/Button";
import Field from "../../components/Field/Field";

import React, { useState } from 'react';

export default function AccessPage({ onAccessGranted }) {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    const correctCode = 'Remoire3';

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputValue === correctCode) {
            onAccessGranted();
        } else {
            setError('Invalid access code. Please try again.');
        }
    };

    return (
        <>
            <h1>Welcome to Remoire!</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    label="Enter access code"
                    type="password"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="Enter secret code"
                />
                <Button text="Submit" type="submit" />
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
    );
};