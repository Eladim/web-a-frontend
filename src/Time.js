import React, { useState, useEffect } from 'react';

const TimePicker = () => {
    const [selectedDateTime, setSelectedDateTime] = useState('');
    const [minDateTime, setMinDateTime] = useState('');

    useEffect(() => {
        // Set the minimum date-time to 15 minutes ahead of the current time
        const now = new Date();
        const offsetInMinutes = 15;
        const futureDate = new Date(now.getTime() + offsetInMinutes * 60000);

        const offset = futureDate.getTimezoneOffset();
        const localISOTime = new Date(futureDate.getTime() - (offset * 60 * 1000))
            .toISOString()
            .slice(0, 16);

        setMinDateTime(localISOTime);
    }, []);

    const handleChange = (e) => {
        setSelectedDateTime(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Selected date and time: ${selectedDateTime}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="timePicker">Pick a Date and Time:</label>
            <input
                type="datetime-local"
                id="timePicker"
                name="timePicker"
                value={selectedDateTime}
                onChange={handleChange}
                min={minDateTime} // Set the minimum allowed date-time to 15 minutes in the future
                required
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default TimePicker;
