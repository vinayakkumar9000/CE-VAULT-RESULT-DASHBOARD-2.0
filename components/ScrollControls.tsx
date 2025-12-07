import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

const ScrollControls = () => {
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            // Check if content is scrollable (content height > window height)
            setIsScrollable(docHeight > windowHeight);

            // Determine if user is at the bottom (with a small buffer of 50px)
            if (scrollTop + windowHeight >= docHeight - 50) {
                setIsAtBottom(true);
            } else {
                setIsAtBottom(false);
            }
        };

        // Listen for scroll and resize events to update state
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        
        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    };

    // Don't render anything if the page isn't scrollable
    if (!isScrollable) return null;

    return (
        <div className="fixed bottom-24 right-4 md:right-8 z-40 flex flex-col gap-3 pointer-events-none md:pointer-events-auto transition-all duration-300">
            {/* Scroll to Bottom Button - Shows when NOT at bottom */}
            <div 
                className={`transition-all duration-500 transform ${!isAtBottom ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            >
                <button
                    onClick={scrollToBottom}
                    className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white shadow-lg hover:bg-white/20 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                    title="Go to Bottom"
                >
                    <ArrowDown size={20} className="group-hover:translate-y-0.5 transition-transform" />
                </button>
            </div>

            {/* Scroll to Top Button - Shows ONLY when at bottom */}
            <div 
                className={`transition-all duration-500 transform ${isAtBottom ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'} -mt-[52px]`}
            >
                <button
                    onClick={scrollToTop}
                    className="p-3 bg-blue-600/80 backdrop-blur-xl border border-blue-400/50 rounded-full text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500/90 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                    title="Go to Top"
                >
                    <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default ScrollControls;