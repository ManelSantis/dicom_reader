import React from 'react';
import { Rnd } from 'react-rnd';

export const ResizableDraggableDiv = ({cover}) => {
    return (
        <Rnd
            default={{
                x: 800,
                y: 100,
                width: 400,
                height: 260,
            }}
            minWidth={100}
            minHeight={100}
            bounds="parent"
            style={{
                backgroundColor: 'blue', // Optional background color
                border: '2px solid #4A90E2', // Stylish border color
                borderRadius: '8px', // Rounded corners
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow effect
                zIndex: 30
              }}
            
        >
            <img src={cover} style={{
                                        width: '100%', height:'100%'}}
                                        alt="" />
        </Rnd>
    );
};
