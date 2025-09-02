import React from 'react';

const ImagePlaceholder = ({ width = 300, height = 200, text = "No Image" }) => {
    const safeWidth = typeof width === "number" || String(width).includes("%") ? width : 300;
    const safeHeight = typeof height === "number" || String(height).includes("%") ? height : 200;

    return (
        <svg
            width={safeWidth}
            height={safeHeight}
            viewBox={`0 0 ${parseInt(safeWidth) || 300} ${parseInt(safeHeight) || 200}`}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            <rect width="100%" height="100%" fill="#f3f4f6" />
            <rect width="100%" height="100%" fill="none" stroke="#d1d5db" strokeWidth="2" />
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                fill="#6b7280"
                fontSize="16"
                fontFamily="Arial, sans-serif"
            >
                {text}
            </text>
        </svg>
    );
};

export default ImagePlaceholder;
