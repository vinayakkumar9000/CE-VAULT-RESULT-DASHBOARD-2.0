import React, { useEffect, useState, useRef } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

const ScrollControls = () => {
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const liveRegionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check for prefers-reduced-motion
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(motionQuery.matches);
        
        const handleMotionChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };
        
        motionQuery.addEventListener('change', handleMotionChange);

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            // Check if content is scrollable (content height > window height)
            setIsScrollable(docHeight > windowHeight);

            // Determine if user is at the bottom (with buffer of 120px for smooth UX)
            if (scrollTop + windowHeight >= docHeight - 120) {
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

        // Keyboard navigation
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Home') {
                e.preventDefault();
                scrollToTop();
            } else if (e.key === 'End') {
                e.preventDefault();
                scrollToBottom();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            window.removeEventListener('keydown', handleKeyPress);
            motionQuery.removeEventListener('change', handleMotionChange);
        };
    }, []);

    const announceScroll = (message: string) => {
        if (liveRegionRef.current) {
            liveRegionRef.current.textContent = message;
            setTimeout(() => {
                if (liveRegionRef.current) {
                    liveRegionRef.current.textContent = '';
                }
            }, 1000);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ 
            top: 0, 
            behavior: prefersReducedMotion ? 'auto' : 'smooth' 
        });
        announceScroll('Moved to top');
    };

    const scrollToBottom = () => {
        window.scrollTo({ 
            top: document.documentElement.scrollHeight, 
            behavior: prefersReducedMotion ? 'auto' : 'smooth' 
        });
        announceScroll('Moved to bottom');
    };

    const handleButtonKeyPress = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    };

    // Don't render anything if the page isn't scrollable
    if (!isScrollable) return null;

    const transitionClass = prefersReducedMotion ? '' : 'transition-all duration-500';

    return (
        <>
            {/* Live region for screen reader announcements */}
            <div 
                ref={liveRegionRef}
                className="sr-only" 
                role="status" 
                aria-live="polite" 
                aria-atomic="true"
            />
            
            <div 
                className="fixed z-40 flex flex-col"
                style={{
                    bottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
                    left: 'max(1rem, env(safe-area-inset-left, 1rem))'
                }}
            >
                {/* Scroll to Bottom Button - Shows when NOT at bottom */}
                <div 
                    className={`${transitionClass} transform ${!isAtBottom ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                >
                    <button
                        onClick={scrollToBottom}
                        onKeyDown={(e) => handleButtonKeyPress(e, scrollToBottom)}
                        className={`
                            w-14 h-14 md:w-[72px] md:h-[72px] min-w-[44px] min-h-[44px]
                            bg-white/10 backdrop-blur-xl border border-white/20 rounded-full 
                            text-white shadow-lg hover:bg-white/20 hover:scale-110 
                            ${prefersReducedMotion ? '' : 'transition-all duration-300'}
                            flex items-center justify-center group
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent
                        `}
                        aria-label="Scroll to bottom"
                        title="Scroll to bottom"
                        tabIndex={0}
                    >
                        <ArrowDown size={20} className={`${prefersReducedMotion ? '' : 'group-hover:translate-y-0.5 transition-transform'}`} />
                    </button>
                </div>

                {/* Scroll to Top Button - Shows ONLY when at bottom */}
                <div 
                    className={`${transitionClass} transform ${isAtBottom ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'} ${!isAtBottom ? '-mt-14 md:-mt-[72px]' : ''}`}
                >
                    <button
                        onClick={scrollToTop}
                        onKeyDown={(e) => handleButtonKeyPress(e, scrollToTop)}
                        className={`
                            w-14 h-14 md:w-[72px] md:h-[72px] min-w-[44px] min-h-[44px]
                            bg-blue-600/80 backdrop-blur-xl border border-blue-400/50 rounded-full 
                            text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500/90 hover:scale-110 
                            ${prefersReducedMotion ? '' : 'transition-all duration-300'}
                            flex items-center justify-center group
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent
                        `}
                        aria-label="Scroll to top"
                        title="Scroll to top"
                        tabIndex={0}
                    >
                        <ArrowUp size={20} className={`${prefersReducedMotion ? '' : 'group-hover:-translate-y-0.5 transition-transform'}`} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ScrollControls;