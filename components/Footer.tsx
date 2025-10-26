/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { translations } from '../lib/i18n';

type Language = 'ar' | 'en';

interface FooterProps {
    onShowPrompts: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
}

const Footer: React.FC<FooterProps> = ({ onShowPrompts, language, setLanguage }) => {
    const t = translations[language];

    const handleShare = async () => {
        const shareData = {
            title: t.share.title,
            text: t.share.text,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert(t.share.alert);
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const toggleLanguage = () => {
        setLanguage(language === 'ar' ? 'en' : 'ar');
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3 z-50 text-neutral-300 text-xs sm:text-sm border-t border-white/10">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center gap-4 px-4">
                {/* Left Side: Language Switcher */}
                <button
                    onClick={toggleLanguage}
                    className="font-permanent-marker text-sm sm:text-base text-center text-neutral-400 hover:text-white transition-colors duration-200"
                >
                    {language === 'ar' ? 'English' : 'العربية'}
                </button>
                
                {/* Middle: Developer Credit */}
                 <div className="hidden md:flex items-center gap-4 text-neutral-500 whitespace-nowrap">
                    <p>
                        {t.footer.developedBy}{' '}
                        <a
                            href="https://ehabgm.online"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-yellow-400 transition-colors duration-200"
                        >
                            ehabgm.online
                        </a>
                    </p>
                </div>


                {/* Right Side: Action Buttons */}
                <div className="flex-grow flex justify-end items-center gap-4 sm:gap-6">
                    <button
                        onClick={handleShare}
                        className="font-permanent-marker text-sm sm:text-base text-center text-black bg-yellow-400 py-2 px-4 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:-rotate-2 hover:bg-yellow-300 shadow-[1px_1px_0px_1px_rgba(0,0,0,0.2)] whitespace-nowrap"
                    >
                        {t.buttons.shareResults}
                    </button>
                    <button
                        onClick={onShowPrompts}
                        className="font-permanent-marker text-sm sm:text-base text-center text-white bg-white/10 backdrop-blur-sm border border-white/50 py-2 px-4 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:rotate-2 hover:bg-white hover:text-black whitespace-nowrap"
                    >
                        {t.buttons.readyPrompts}
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;