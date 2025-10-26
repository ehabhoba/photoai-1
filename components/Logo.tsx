/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
    language: 'ar' | 'en';
}

const Logo: React.FC<LogoProps> = ({ language, ...props }) => {
    const text = language === 'ar' ? 'رحلة عبر الزمن' : 'Past Forward';
    const isArabic = language === 'ar';
    const textY = isArabic ? 65 : 62;
    const fontFamily = isArabic ? "'Cairo', 'Caveat', cursive" : "'Caveat', cursive";
    const letterSpacing = isArabic ? '0' : '0.1em';


    return (
        <svg
            viewBox="0 0 200 80"
            xmlns="http://www.w3.org/2000/svg"
            aria-label={text}
            role="img"
            {...props}
        >
            <defs>
                <filter id="text-shadow" x="-0.1" y="-0.1" width="1.2" height="1.2">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                    <feOffset dx="1" dy="1" result="offsetblur" />
                    <feFlood floodColor="rgba(0,0,0,0.5)" />
                    <feComposite in2="offsetblur" operator="in" />
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            {/* Camera Shutter Icon */}
            <g transform="translate(25, 40) scale(0.6)">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#FBBF24" strokeWidth="4" />
                <path d="M50 50 L85.35 25 A45 45 0 0 0 50 5 Z" fill="#FBBF24" opacity="0.8" />
                <path d="M50 50 L14.65 25 A45 45 0 0 0 14.65 75 Z" fill="#FBBF24" opacity="0.8" />
                <path d="M50 50 L50 95 A45 45 0 0 0 85.35 75 Z" fill="#FBBF24" opacity="0.8" />
                <circle cx="50" cy="50" r="15" fill="none" stroke="#000" strokeWidth="3" />
            </g>

            {/* App Title */}
            <text
                x="130"
                y={textY}
                fontFamily={fontFamily}
                fontSize="32"
                fill="#FFFFFF"
                textAnchor="middle"
                letterSpacing={letterSpacing}
                style={{ filter: 'url(#text-shadow)' }}
            >
                {text}
            </text>
        </svg>
    );
};

export default Logo;
