/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateDecadeImage } from './services/geminiService';
import PolaroidCard from './components/PolaroidCard';
import { createAlbumPage, applyWatermark } from './lib/albumUtils';
import Footer from './components/Footer';
import Logo from './components/Logo';
import { cn } from './lib/utils';
import { translations, getPrompts } from './lib/i18n';

type Language = 'ar' | 'en';

// --- Prompt Modal Component ---

interface PromptModalProps {
    onClose: () => void;
    language: Language;
}

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const PromptModal: React.FC<PromptModalProps> = ({ onClose, language }) => {
    const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
    const t = translations[language];
    const prompts = getPrompts(language);

    const handleCopy = (prompt: string) => {
        navigator.clipboard.writeText(prompt);
        setCopiedPrompt(prompt);
        setTimeout(() => setCopiedPrompt(null), 2000);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                aria-modal="true"
                role="dialog"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                >
                    <header className="flex items-center justify-between p-4 border-b border-neutral-700 flex-shrink-0">
                        <h2 className="text-xl font-permanent-marker text-neutral-100">{t.promptModal.title}</h2>
                        <button
                            onClick={onClose}
                            className="text-neutral-500 hover:text-white transition-colors rounded-full p-1"
                            aria-label={t.promptModal.closeAriaLabel}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </header>
                    <div className="p-6 overflow-y-auto space-y-4">
                        {prompts.map(({ title, prompt }) => (
                            <div key={title} className="bg-neutral-800/50 p-4 rounded-md flex items-center justify-between gap-4">
                                <div className="flex-grow">
                                    <h3 className="font-bold text-yellow-400 font-permanent-marker tracking-wide">{title}</h3>
                                    <p className="text-neutral-300 mt-1">{prompt}</p>
                                </div>
                                <button
                                    onClick={() => handleCopy(prompt)}
                                    className="flex-shrink-0 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-3 rounded-md transition-all duration-200 flex items-center gap-2 text-sm"
                                    aria-label={`${t.promptModal.copyAriaLabel}: ${title}`}
                                >
                                    {copiedPrompt === prompt ? <CheckIcon /> : <CopyIcon />}
                                    <span>{copiedPrompt === prompt ? t.promptModal.copied : t.promptModal.copy}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// --- Main App Component ---

const DECADES = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s'];
const EXAMPLE_IMAGE_URL = "data:image/jpeg;base64,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lFLQAlFLS0AJRS0tACUUUtACUtJS0ALRSUtAC0lFLQAlFLS0ALSUUUALSUUUALSUUtAC0lFLQAlFLS0ALRSUtAC0lFLQAlFLS0ALSUUUALSUUtAC0lFFABS0lLQAUtJRQAtLSUUALSUtJQAUtJS0ALSUUtAC0tJS0ALSUUUALSUUUALSUtJQAtJS0lAC0lFFAC0lFFAC0tJS0ALSUUtAC0lFLQAtJSUtAC0tJRQAtJS0lAC0lFFAC0lFLQAUlLS0AJRS0tACUUUUALRSUtACUUtLQAUtJS0ALSUUtAC0tJS0ALSUUtACUtJS0ALRSUtAC0lFFAC0tJS0ALSUUtABS0lFAC0lLSUALSUUUALSUUtAC0tJS0ALRSUtAC0lFFABS0lLQAtJSUtAC0lLSUALSUUUALSUUUALSUtJQAUtJS0ALSUUtAC0lFLQAtJS0lAC0tJS0ALSUUUALRSUtACUtJS0ALRSUtACUtJS0ALRSUtACUtFFAC0tJS0ALSUUtAC0lFLQAtJS0lAC0tJS0ALRSUtACUtJS0ALRSUtAC0tJS0ALRSUtAC0tJS0ALSUUUALSUUtAC0lLSUALSUUtAC0lLSUALSUUtAC0tJS0ALSUUtAC0lFLQAtLSUlAC0tJS0AJRS0tAC0lFLQAtJS0lAC0tJS0AJRS0tAC0lFLQAlFLS0AJRS0tACUUUUALSUtJQAUtJS0AJRS0tAC0lLSUALSUUtACUtJS0ALRSUtAC0lFLQAtJS0lAC0lLSUALRSUtACUtJS0ALSUUUALSUUtAC0lLSUALSUUtAC0lFLQAtLSUlAC0tJRQAtJS0lAC0lLSUALRSUtAC0lLS0AJRS0tACUtJS0ALRSUtAC0tJS0ALSUUUALSUUUALSUtJQAUtJS0ALSUUtAC0lLSUALSUUUALSUUtAC0lLSUALSUUtAC0tJS0ALSUUUALRSUtAC0tJS0ALSUUUALRSUtACUtJS0ALSUUUALSUUtABS0lLQAtJSUtAC0lLS0AJRS0tACUUUUALSUUtAC0lLSUALSUUtAC0lLSUALSUUtAC0lLSUALSUUUALSUUtAC0tJS0ALSUUUALRSUtAC0lLSUALSUUtAC0tJRQAtJS0lAC0lLSUALSUUUALSUUtAC0lLSUALSUUtAC0lLSUALRSUtAC0tJS0ALRSUtAC0lLS0AJRS0tACUtJS0ALRSUtAC0lFLQAUlLS0ALSUUUALSUUUALSUUtAC0lFLQAUlLS0ALRSUtACUtJS0ALSUUtAC0lLSUALSUUtAC0lFLQAtJS0lAC0lLS0ALRSUtAC0lFLQAtLSUlAC0lLS0ALRSUtAC0lLSUALRSUtAC0tJRQAtJS0lAC0lLSUALSUUUALSUUtAC0lLSUALSUUtAC0lLS0AJRS0tACUtJS0ALRSUtAC0lLS0ALRSUtAC0tJS0ALRSUtAC0lLS0AJRS0tAC0lFLQAUlLS0AJRS0tAC0lFLQAUlLSUALRSUtACUtJS0ALRSUtAC0lLS0ALRSUtACUtJS0ALRSUtAC0lFLQAlLSUtACUtJS0ALRSUtAC0lLSUALSUUUALSUUtAC0lFLQAlLSUtACUtJS0ALRSUtAC0tJS0ALRSUtAC0lLS0ALSUUUALSUtJQAtFLS0AJRS0tACUUUtAC0lLSUALSUUUALSUtJQAtFLS0AJRS0tACUUUUALSUtJQAtJS0lAC0UUtACUUtLQAUtJRQAtJSUtACUUtLQAUtJRQAtJSUtAC0lFLQAUlLS0ALRSUtACUtJS0ALRSUtAC0lFLQAUlLS0ALRSUtACUtJS0ALRSUtAC0lFLQAUlLSUALRSUtAC0lFLQAlLSUtACUtJS0ALRSUtAC0lLSUALSUUUALSUtJQAtJS0lAC0tJS0AJRS0tAC0lLSUALRSUtAC0lLSUALSUUtAC0lLS0AJRS0tACUtFFABS0lLQAtLSUlAC0UtJQAlLSUtACUtFFABS0lLQAtLSUlAC0UtJQAlLSUtACUtJS0ALRSUtAC0tJQAtLSUlAC0UtJQAlLSUtACUtFFABS0lLQAtLSUlAC0UtJQAlLSUtACUtFFABS0lLQAtLSUlAC0UtJQAlLSUtAC0lLSUALSUUtAC0lLS0AJRS0tAC0lFLQAUlLS0ALSUUUALSUUtABSUtJQAUtJS0AJRS0tAC0lLSUALSUtJQAUtJS0AJRS0tAC0lFLQAUlLS0ALSUUtACUtJS0ALSUtJQAUtJS0AJRS0tAC0lLSUALSUtJQAUtJS0AJRS0tAC0lLSUALSUtJQAUtJS0AJRS0tAC0lFLQAUlLS0ALSUUUALSUUtACUtFFAC0tJS0ALSUUUALSUtJQAtLSUtACUUUUALSUUUALSUtJQAtLSUtACUUUtAC0lFLQAUlLS0ALRSUtAC0tJS0AJRS0tAC0lLSUALSUtJQAUtFFAC0lLS0AJRS0tAC0lFLQAUlLSUALRSUtACUtJS0ALRSUtACUtJS0ALSUUtAC0lLSUALRSUtAC0lLS0AJRS0tAC0lLS0ALSUUUALSUtJQAtFLS0AJRS0tAC0lLSUALSUtJQAUtLS0AJRS0tAC0lLSUALSUtJQAtLS0tACUUUUALSUUtAC0lLS0ALSUUUALSUUtAC0lLS0AJRS0tAC0lLS0ALRSUtACUtLS0ALSUUUALSUtJQAtFLS0AJRS0tAC0lLSUALSUtJQAUtLS0AJRS0tAC0lLS0ALRSUtACUtLS0ALRSUtACUtLS0ALSUUUALSUtJQAtFLS0AJRS0tAC0lLS0ALRSUtACUtLS0AJRS0tAC0lLSUALSUtJQAUtLS0AJRS0tAC0lLSUALSUtJQAtLS0tACUUUUALSUUtAC0lLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALSUUUALSUtJQAtFLS0AJRS0tAC0lLS0ALRSUtACUtLS0ALRSUtACUtLS0ALSUUUALSUUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALSUUUALSUtJQAtFLS0AJRS0tAC0lLS0ALRSUtACUtLS0ALSUUUALSUUtACUtLS0ALSUUUALSUtJQAtFLS0AJRS0tAC0lLSUALSUtJQAUtLS0AJRS0tAC0lLS0ALRSUtACUtLS0ALRSUtACUtLS0ALSUUUALSUUtACUtLS0ALSUUUALSUtJQAtFLS0AJRS0tAC0lLS0ALRSUtACUtLS0ALRSUtACUtLS0ALSUUUALSUtJQAtFLS0AJRS0tAC0lLS0ALRSUtACUtLS0ALRSUtACUtLS0ALSUUUALSUtJQAtFLS0AJRS0tAC0lLSUALSUtJQAUtLS0AJRS0tAC0lLSUALSUtJQAtLS0tACUUUUALSUUtAC0lLS0ALRSUtACUtLS0ALSUUUALSUtJQAtFLS0AJRS0tAC0lLSUALSUtJQAUtLS0AJRS0tAC0lLS0ALRSUtACUtLS0ALRSUtACUtLS0ALSUUUALSUUtACUtLS0ALSUUUALSUtJQAtFLS0AJRS0tAC0lLSUALSUtJQAUtLS0AJRS0tAC0lLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALSUUUALSUUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALSUUUALSUtJQAtFLS0AJRS0tAC0lLSUALSUtJQAUtLS0AJRS0tAC0lLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0ALRSUtACUtLS0AL-sAR-JQAAAgICAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAg-ls/sIR-JQAAAgICAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAgACAg-UtLS0ALRSUtAC";

// Pre-defined positions for a scattered look on desktop
const POSITIONS = [
    { top: '5%', left: '10%', rotate: -8 },
    { top: '15%', left: '60%', rotate: 5 },
    { top: '45%', left: '5%', rotate: 3 },
    { top: '2%', left: '35%', rotate: 10 },
    { top: '40%', left: '70%', rotate: -12 },
    { top: '50%', left: '38%', rotate: -3 },
];

const FILTERS = [
    { nameKey: 'noFilter', value: 'none', css: 'none' },
    { nameKey: 'sepia', value: 'sepia', css: 'sepia(1)' },
    { nameKey: 'bw', value: 'grayscale', css: 'grayscale(1)' },
    { nameKey: 'vintage', value: 'vintage', css: 'sepia(0.6) contrast(1.1) brightness(0.9) saturate(1.2) hue-rotate(-10deg)' },
];

type ImageStatus = 'pending' | 'done' | 'error';
interface GeneratedImage {
    status: ImageStatus;
    url?: string;
    error?: string;
}

const primaryButtonClasses = "font-permanent-marker text-xl text-center text-black bg-yellow-400 py-3 px-8 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:-rotate-2 hover:bg-yellow-300 shadow-[2px_2px_0px_2px_rgba(0,0,0,0.2)]";
const secondaryButtonClasses = "font-permanent-marker text-xl text-center text-white bg-white/10 backdrop-blur-sm border-2 border-white/80 py-3 px-8 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:rotate-2 hover:bg-white hover:text-black";

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);
    return matches;
};

function App() {
    const [language, setLanguage] = useState<Language>('ar');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<Record<string, GeneratedImage>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [appState, setAppState] = useState<'idle' | 'image-uploaded' | 'generating' | 'results-shown'>('idle');
    const [selectedFilter, setSelectedFilter] = useState<string>('none');
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
    const dragAreaRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const t = translations[language];

    useEffect(() => {
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'en') {
            setLanguage('en');
        } else {
            setLanguage('ar');
        }
    }, []);

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);


    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
                setAppState('image-uploaded');
                setGeneratedImages({}); // Clear previous results
                setSelectedFilter('none'); // Reset filter
            };
            reader.readAsDataURL(file);
        }
    };

    const applyFilterToImage = (imageDataUrl: string, filterCss: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (filterCss === 'none' || !filterCss) {
                resolve(imageDataUrl);
                return;
            }
    
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Important for canvas operations
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error("Could not get canvas context"));
                }
    
                ctx.filter = filterCss;
                ctx.drawImage(img, 0, 0);
                
                resolve(canvas.toDataURL('image/jpeg', 0.95)); // Use JPEG for smaller size
            };
            img.onerror = () => reject(new Error("Failed to load image for filtering."));
            img.src = imageDataUrl;
        });
    };

    const handleGenerateClick = async () => {
        if (!uploadedImage) return;
    
        setIsLoading(true);
        setAppState('generating');
        
        let imageToSend = uploadedImage;
        try {
            const selectedFilterObject = FILTERS.find(f => f.value === selectedFilter);
            const filterCssToApply = selectedFilterObject ? selectedFilterObject.css : 'none';
            imageToSend = await applyFilterToImage(uploadedImage, filterCssToApply);
        } catch (filterError) {
            console.error("Failed to apply filter:", filterError);
            alert(t.alerts.filterError);
            // imageToSend remains the original uploadedImage
        }
    
        const initialImages: Record<string, GeneratedImage> = {};
        DECADES.forEach(decade => {
            initialImages[decade] = { status: 'pending' };
        });
        setGeneratedImages(initialImages);
    
        const concurrencyLimit = 2; // Process two decades at a time
        const decadesQueue = [...DECADES];
    
        const processDecade = async (decade: string) => {
            try {
                const prompt = t.generatePrompt(decade);
                const resultUrl = await generateDecadeImage(imageToSend, prompt);
                setGeneratedImages(prev => ({
                    ...prev,
                    [decade]: { status: 'done', url: resultUrl },
                }));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
                setGeneratedImages(prev => ({
                    ...prev,
                    [decade]: { status: 'error', error: errorMessage },
                }));
                console.error(`Failed to generate image for ${decade}:`, err);
            }
        };
    
        const workers = Array(concurrencyLimit).fill(null).map(async () => {
            while (decadesQueue.length > 0) {
                const decade = decadesQueue.shift();
                if (decade) {
                    await processDecade(decade);
                }
            }
        });
    
        await Promise.all(workers);
    
        setIsLoading(false);
        setAppState('results-shown');
    };

    const handleRegenerateDecade = async (decade: string) => {
        if (!uploadedImage) return;

        if (generatedImages[decade]?.status === 'pending') {
            return;
        }
        
        setGeneratedImages(prev => ({ ...prev, [decade]: { status: 'pending' } }));

        try {
            const prompt = t.generatePrompt(decade);
            const resultUrl = await generateDecadeImage(uploadedImage, prompt);
            setGeneratedImages(prev => ({
                ...prev,
                [decade]: { status: 'done', url: resultUrl },
            }));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setGeneratedImages(prev => ({
                ...prev,
                [decade]: { status: 'error', error: errorMessage },
            }));
            console.error(`Failed to regenerate image for ${decade}:`, err);
        }
    };
    
    const handleReset = () => {
        setUploadedImage(null);
        setGeneratedImages({});
        setAppState('idle');
        setSelectedFilter('none');
    };

    const handleDownloadIndividualImage = async (decade: string) => {
        const image = generatedImages[decade];
        if (image?.status === 'done' && image.url) {
            try {
                const watermarkedImageUrl = await applyWatermark(image.url);
                const link = document.createElement('a');
                link.href = watermarkedImageUrl;
                link.download = `past-forward-${decade}-ehabgm.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("Failed to apply watermark:", error);
                const link = document.createElement('a');
                link.href = image.url;
                link.download = `past-forward-${decade}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    };

    const handleDownloadAlbum = async () => {
        setIsDownloading(true);
        try {
            const imageData = Object.entries(generatedImages)
                .filter((entry): entry is [string, { status: 'done'; url: string }] => {
                    const image = entry[1] as GeneratedImage;
                    return image.status === 'done' && !!image.url;
                })
                .reduce((acc, [decade, image]) => {
                    acc[decade] = image.url;
                    return acc;
                }, {} as Record<string, string>);

            if (Object.keys(imageData).length < DECADES.length) {
                alert(t.alerts.waitAllImages);
                return;
            }

            const albumDataUrl = await createAlbumPage(imageData, {
                header: t.album.header,
                subheader: t.album.subheader
            });

            const link = document.createElement('a');
            link.href = albumDataUrl;
            link.download = 'past-forward-album.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Failed to create or download album:", error);
            alert(t.alerts.albumError);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <main className="bg-black text-neutral-200 min-h-screen w-full flex flex-col items-center justify-center p-4 pb-24 overflow-x-hidden relative animated-grid">
            
            <div className="z-10 flex flex-col items-center justify-center w-full h-full flex-1 min-h-0">
                <header className="text-center my-10 flex flex-col items-center">
                    <Logo language={language} className="w-64 h-auto cursor-pointer" onClick={() => appState !== 'idle' && handleReset()} />
                    <p className="font-permanent-marker text-neutral-300 mt-2 text-xl tracking-wide">{t.subtitle}</p>
                </header>

                {appState === 'idle' && (
                     <div className="w-full max-w-5xl mx-auto">
                        {/* Hero Section */}
                        <div className="relative flex flex-col items-center justify-center w-full mb-16">
                            <motion.div
                                 initial={{ opacity: 0, y: 100, rotate: 15 }}
                                 animate={{ opacity: 1, y: 0, rotate: 0 }}
                                 transition={{ delay: 0.5, duration: 0.8, type: 'spring', stiffness: 100, damping: 15 }}
                                 className="flex flex-col items-center"
                            >
                                <label htmlFor="file-upload" className="cursor-pointer group transform hover:scale-105 transition-transform duration-300">
                                     <PolaroidCard 
                                         caption={t.polaroid.clickToStart}
                                         status="done"
                                         placeholderCaption={t.polaroid.uploadPlaceholder}
                                     />
                                </label>
                                <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                                <p className="mt-8 font-permanent-marker text-neutral-400 text-center max-w-xs text-lg">{t.uploadInstructions}</p>
                                <p className="mt-4 text-neutral-500 text-center max-w-xs text-sm">{t.freeMessage}</p>
                            </motion.div>
                        </div>
              
                        {/* How It Works Section */}
                        <div className="mb-16">
                            <h2 className="text-4xl font-caveat text-center text-yellow-400 mb-8">{t.howItWorks.title}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                                {/* Step 1 */}
                                <div className="text-center flex flex-col items-center">
                                    <div className="bg-yellow-400/20 p-4 rounded-full mb-4 border-2 border-yellow-400/50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    </div>
                                    <h3 className="font-permanent-marker text-xl text-neutral-100">{t.howItWorks.step1}</h3>
                                    <p className="text-neutral-400 mt-2">{t.howItWorks.step1desc}</p>
                                </div>
                                {/* Step 2 */}
                                <div className="text-center flex flex-col items-center">
                                    <div className="bg-yellow-400/20 p-4 rounded-full mb-4 border-2 border-yellow-400/50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </div>
                                    <h3 className="font-permanent-marker text-xl text-neutral-100">{t.howItWorks.step2}</h3>
                                    <p className="text-neutral-400 mt-2">{t.howItWorks.step2desc}</p>
                                </div>
                                {/* Step 3 */}
                                <div className="text-center flex flex-col items-center">
                                   <div className="bg-yellow-400/20 p-4 rounded-full mb-4 border-2 border-yellow-400/50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                                    </div>
                                    <h3 className="font-permanent-marker text-xl text-neutral-100">{t.howItWorks.step3}</h3>
                                    <p className="text-neutral-400 mt-2">{t.howItWorks.step3desc}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Example Section */}
                        <div className="mb-16">
                            <h2 className="text-4xl font-caveat text-center text-yellow-400 mb-2">{t.exampleSection.title}</h2>
                            <p className="text-center text-neutral-400 mb-8 max-w-2xl mx-auto">{t.exampleSection.description}</p>
                            <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
                                 <PolaroidCard imageUrl={EXAMPLE_IMAGE_URL} caption={t.exampleSection.before} status="done" loading="eager" isUploadCard={true} />
                                 <PolaroidCard imageUrl={EXAMPLE_IMAGE_URL} caption={t.exampleSection.after1950} status="done" filterCss="sepia(0.6) contrast(1.1) brightness(0.9)" loading="lazy" isUploadCard={true}/>
                                 <PolaroidCard imageUrl={EXAMPLE_IMAGE_URL} caption={t.exampleSection.after1970} status="done" filterCss="sepia(0.8) contrast(0.9) brightness(0.8) hue-rotate(-20deg)" loading="lazy" isUploadCard={true} />
                                 <PolaroidCard imageUrl={EXAMPLE_IMAGE_URL} caption={t.exampleSection.after1990} status="done" filterCss="grayscale(0.5) contrast(1.2) brightness(1.1)" loading="lazy" isUploadCard={true} />
                            </div>
                        </div>
                    </div>
                )}

                {appState === 'image-uploaded' && uploadedImage && (
                    <div className="flex flex-col items-center gap-6">
                         <PolaroidCard 
                            imageUrl={uploadedImage} 
                            caption={t.polaroid.yourPhoto} 
                            status="done"
                            filterCss={FILTERS.find(f => f.value === selectedFilter)?.css}
                            isUploadCard={true}
                            loading="eager"
                         />
                        <div className="flex flex-col items-center gap-4 my-2">
                            <h3 className="font-permanent-marker text-neutral-300 text-lg tracking-wide">{t.filterTitle}</h3>
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                                {FILTERS.map(filter => (
                                    <button
                                        key={filter.value}
                                        onClick={() => setSelectedFilter(filter.value)}
                                        className={cn(
                                            "py-2 px-4 rounded-sm text-sm sm:text-base font-permanent-marker transition-all duration-200 transform hover:scale-105",
                                            selectedFilter === filter.value
                                                ? "bg-yellow-400 text-black shadow-md hover:bg-yellow-300"
                                                : "bg-white/10 text-white hover:bg-white/20"
                                        )}
                                    >
                                        {t.filters[filter.nameKey as keyof typeof t.filters]}
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div className="flex items-center gap-4 mt-2">
                            <button onClick={handleReset} className={secondaryButtonClasses}>
                                {t.buttons.differentPhoto}
                            </button>
                            <button onClick={handleGenerateClick} className={primaryButtonClasses}>
                                {t.buttons.generate}
                            </button>
                         </div>
                    </div>
                )}

                {(appState === 'generating' || appState === 'results-shown') && (
                     <>
                        {isMobile ? (
                            <div className="w-full max-w-sm flex-1 overflow-y-auto mt-4 space-y-8 p-4">
                                {DECADES.map((decade) => (
                                    <div key={decade} className="flex justify-center">
                                         <PolaroidCard
                                            caption={decade}
                                            status={generatedImages[decade]?.status || 'pending'}
                                            imageUrl={generatedImages[decade]?.url}
                                            error={generatedImages[decade]?.error}
                                            onShake={handleRegenerateDecade}
                                            onDownload={handleDownloadIndividualImage}
                                            isMobile={isMobile}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div ref={dragAreaRef} className="relative w-full max-w-5xl h-[600px] mt-4">
                                {DECADES.map((decade, index) => {
                                    const { top, left, rotate } = POSITIONS[index];
                                    return (
                                        <motion.div
                                            key={decade}
                                            className="absolute cursor-grab active:cursor-grabbing"
                                            style={{ top, left }}
                                            initial={{ opacity: 0, scale: 0.5, y: 100, rotate: 0 }}
                                            animate={{ opacity: 1, scale: 1, y: 0, rotate: `${rotate}deg` }}
                                            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.15 }}
                                        >
                                            <PolaroidCard 
                                                dragConstraintsRef={dragAreaRef}
                                                caption={decade}
                                                status={generatedImages[decade]?.status || 'pending'}
                                                imageUrl={generatedImages[decade]?.url}
                                                error={generatedImages[decade]?.error}
                                                onShake={handleRegenerateDecade}
                                                onDownload={handleDownloadIndividualImage}
                                                isMobile={isMobile}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                         <div className="h-20 mt-4 flex items-center justify-center">
                            {appState === 'results-shown' && (
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <button 
                                        onClick={handleDownloadAlbum} 
                                        disabled={isDownloading} 
                                        className={`${primaryButtonClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {isDownloading ? t.buttons.creatingAlbum : t.buttons.downloadAlbum}
                                    </button>
                                    <button onClick={handleReset} className={secondaryButtonClasses}>
                                        {t.buttons.startOver}
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            <Footer 
                language={language}
                setLanguage={setLanguage}
                onShowPrompts={() => setIsPromptModalOpen(true)} 
            />
            {isPromptModalOpen && <PromptModal language={language} onClose={() => setIsPromptModalOpen(false)} />}
        </main>
    );
}

export default App;