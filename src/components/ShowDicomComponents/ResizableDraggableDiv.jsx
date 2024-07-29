import React from 'react';
import { Rnd } from 'react-rnd';

export const ResizableDraggableDiv = () => {
    return (
        <Rnd
            default={{
                x: 800,
                y: 100,
                width: 330,
                height: 330,
            }}
            minWidth={100}
            minHeight={100}
            bounds="parent"
            style={{
                backgroundColor: 'blue', // Optional background color
                border: '2px solid #4A90E2', // Stylish border color
                borderRadius: '8px', // Rounded corners
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow effect
                zIndex: 20
              }}
            
        >
            <canvas id="canvas" style={{ width: '100%', height: '100%' }}></canvas>
        </Rnd>
    );
};
