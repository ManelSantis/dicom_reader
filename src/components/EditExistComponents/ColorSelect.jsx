import React from 'react';

const ColorSelect = ({ colors, value, onChange }) => {
    const handleChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <div className="color-select-container">
            <select
                value={value}
                onChange={handleChange}
                className="color-select"
            >
                {colors.map(color => (
                    <option key={color} value={color} style={{ backgroundColor: color }}>
                    </option>
                ))}
            </select>
            <div
                className="color-preview"
                style={{ backgroundColor: value }}
            />
        </div>
    );
};

export default ColorSelect;
