import React, { useEffect, useRef, useState } from 'react';

export const ResizableDraggableDiv = () => {
    const [position, setPosition] = useState({ x: 800, y: 100 });
    const [size, setSize] = useState({ width: 330, height: 330 });
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
    const [resizeDirection, setResizeDirection] = useState('');
    const canvasRef = useRef(null);

    const handleMouseDown = (e) => {
        setDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseUp = () => {
        setDragging(false);
        setResizing(false);
        setResizeDirection('');
        console.log(position);
        console.log(size);
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y
            });
        } else if (resizing) {
            const dx = e.clientX - resizeStart.x;
            const dy = e.clientY - resizeStart.y;

            let newSize = { ...size };
            let newPosition = { ...position };

            if (resizeDirection.includes('e')) {
                newSize.width += dx;
            }
            if (resizeDirection.includes('s')) {
                newSize.height += dy;
            }
            if (resizeDirection.includes('w')) {
                newSize.width -= dx;
                newPosition.x += dx;
            }
            if (resizeDirection.includes('n')) {
                newSize.height -= dy;
                newPosition.y += dy;
            }

            setSize(newSize);
            setPosition(newPosition);
            setResizeStart({
                x: e.clientX,
                y: e.clientY
            });
        }
    };

    const handleResizeMouseDown = (direction) => (e) => {
        e.stopPropagation();
        setResizing(true);
        setResizeStart({
            x: e.clientX,
            y: e.clientY
        });
        setResizeDirection(direction);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, resizing, offset, resizeStart, size, position, resizeDirection]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            canvas.width = size.width;
            canvas.height = size.height;
        }
    }, [size]);

    return (
        <div
            className='flex z-1 border-red-700 border-2'
            style={{
                width: `${size.width}px`,
                height: `${size.height}px`,
                backgroundColor: 'blue',
                position: 'absolute',
                top: `${position.y}px`,
                left: `${position.x}px`,
                cursor: 'move'
            }}
            onMouseDown={handleMouseDown}
        >
            <div
                style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'red',
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    cursor: 'se-resize'
                }}
                onMouseDown={handleResizeMouseDown('se')}
            ></div>
            <div
                style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'red',
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    cursor: 'sw-resize'
                }}
                onMouseDown={handleResizeMouseDown('sw')}
            ></div>
            <canvas id='canvas' ref={canvasRef} style={{ width: '100%', height: '100%' }}></canvas>
            <div
                style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'red',
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    cursor: 'ne-resize'
                }}
                onMouseDown={handleResizeMouseDown('ne')}
            ></div>
            <div
                style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'red',
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    cursor: 'nw-resize'
                }}
                onMouseDown={handleResizeMouseDown('nw')}
            ></div>
            <div
                style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    top: '0',
                    cursor: 'n-resize'
                }}
                onMouseDown={handleResizeMouseDown('n')}
            ></div>
            <div
                style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    bottom: '0',
                    cursor: 's-resize'
                }}
                onMouseDown={handleResizeMouseDown('s')}
            ></div>
            <div
                style={{
                    width: '10px',
                    height: '100%',
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    right: '0',
                    cursor: 'e-resize'
                }}
                onMouseDown={handleResizeMouseDown('e')}
            ></div>
            <div
                style={{
                    width: '10px',
                    height: '100%',
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    left: '0',
                    cursor: 'w-resize'
                }}
                onMouseDown={handleResizeMouseDown('w')}
            ></div>
        </div>
    );
};
