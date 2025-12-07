import React, { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface PercentileInfoProps {
    sgpa: number | 'N/A';
    batchSgpas: number[];
}

interface PercentileCalculation {
    percentile: number | null;
    count_leq: number | null;
    total_students: number;
    error?: string;
}

const calculatePercentile = (sgpa: number | 'N/A', batchSgpas: number[]): PercentileCalculation => {
    // Handle missing SGPA
    if (sgpa === 'N/A' || sgpa === null || typeof sgpa !== 'number' || isNaN(sgpa)) {
        return {
            percentile: null,
            count_leq: null,
            total_students: 0,
            error: 'NO_SGPA'
        };
    }

    // Handle missing or empty batch data
    if (!batchSgpas || batchSgpas.length === 0) {
        return {
            percentile: null,
            count_leq: null,
            total_students: 0,
            error: 'NO_BATCH_DATA'
        };
    }

    const total_students = batchSgpas.length;
    
    // Count students with SGPA <= this student's SGPA (includes ties)
    const count_leq = batchSgpas.filter(s => s <= sgpa).length;

    // Validate counts
    if (count_leq < 0 || count_leq > total_students) {
        return {
            percentile: null,
            count_leq: null,
            total_students,
            error: 'INVALID_COUNTS'
        };
    }

    // Calculate percentile using industry-standard formula
    const percentile = (count_leq / total_students) * 100;
    
    // Round to 2 decimals and clamp to [0, 100]
    const roundedPercentile = Math.max(0, Math.min(100, Math.round(percentile * 100) / 100));

    return {
        percentile: roundedPercentile,
        count_leq,
        total_students
    };
};

export const PercentileInfo: React.FC<PercentileInfoProps> = ({ sgpa, batchSgpas }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [showCalculation, setShowCalculation] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const calculation = calculatePercentile(sgpa, batchSgpas);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                tooltipRef.current && 
                buttonRef.current &&
                !tooltipRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setShowTooltip(false);
                setShowCalculation(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowTooltip(false);
                setShowCalculation(false);
            }
        };

        if (showTooltip) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [showTooltip]);

    const getErrorMessage = () => {
        switch (calculation.error) {
            case 'NO_SGPA':
                return 'SGPA missing — cannot compute percentile.';
            case 'NO_BATCH_DATA':
                return 'Not enough batch data to compute percentile.';
            case 'INVALID_COUNTS':
                return 'Calculation error — contact admin.';
            default:
                return 'Unable to compute percentile.';
        }
    };

    const displayValue = calculation.percentile !== null 
        ? calculation.percentile.toFixed(2) 
        : '—';

    return (
        <div className="relative inline-flex items-center gap-2">
            <span className="text-4xl font-bold text-yellow-300">
                {displayValue}
                {calculation.percentile !== null && <span className="text-lg font-normal">%</span>}
            </span>
            
            <button
                ref={buttonRef}
                onClick={() => setShowTooltip(!showTooltip)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setShowTooltip(!showTooltip);
                    }
                }}
                className="w-4 h-4 flex items-center justify-center text-yellow-400/60 hover:text-yellow-300 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-transparent rounded-full"
                aria-label="Percentile information, opens explanation"
                aria-describedby={showTooltip ? 'percentile-tooltip' : undefined}
                tabIndex={0}
            >
                <Info size={16} />
            </button>

            {/* Tooltip/Modal */}
            {showTooltip && (
                <div 
                    ref={tooltipRef}
                    id="percentile-tooltip"
                    role="dialog"
                    aria-labelledby="percentile-tooltip-title"
                    className="absolute z-50 top-full mt-2 left-0 md:left-auto md:right-0 w-screen max-w-[90vw] md:max-w-md bg-[#0f1021] border border-yellow-500/30 rounded-xl shadow-2xl p-4 animate-fade-in"
                    tabIndex={-1}
                >
                    <button
                        onClick={() => {
                            setShowTooltip(false);
                            setShowCalculation(false);
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                        aria-label="Close tooltip"
                    >
                        <X size={16} />
                    </button>

                    <h4 id="percentile-tooltip-title" className="font-bold text-white text-sm mb-3">
                        How percentile is calculated
                    </h4>

                    {calculation.error ? (
                        <div className="text-sm text-gray-300 mb-2">
                            <p className="text-red-300">{getErrorMessage()}</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-xs text-gray-300 mb-3 space-y-2">
                                <p className="font-mono bg-white/5 p-2 rounded border border-white/10">
                                    Percentile = (Count of students with SGPA ≤ your SGPA ÷ Total students) × 100
                                </p>
                                
                                <p className="text-gray-400">
                                    <strong>Example:</strong> count_leq = {calculation.count_leq}, 
                                    total_students = {calculation.total_students} 
                                    → ({calculation.count_leq} / {calculation.total_students}) × 100 
                                    = {calculation.percentile?.toFixed(2)}%
                                </p>
                            </div>

                            <button
                                onClick={() => setShowCalculation(!showCalculation)}
                                className="text-xs text-blue-300 hover:text-blue-200 underline transition-colors mb-2"
                            >
                                {showCalculation ? 'Hide' : 'Show'} class calculation
                            </button>

                            {showCalculation && (
                                <div className="mt-2 bg-white/5 rounded p-3 border border-white/10">
                                    <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{JSON.stringify(
    {
        count_leq: calculation.count_leq,
        total_students: calculation.total_students,
        percentile: calculation.percentile
    },
    null,
    2
)}
                                    </pre>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

// Utility function for programmatic use - returns percentile data with metadata
export const getPercentileData = (sgpa: number | 'N/A', batchSgpas: number[], rollNumber: string = '') => {
    const calculation = calculatePercentile(sgpa, batchSgpas);
    
    return {
        roll: rollNumber,
        sgpa: typeof sgpa === 'number' ? sgpa : null,
        count_leq: calculation.count_leq,
        total_students: calculation.total_students,
        percentile: calculation.percentile,
        formula: 'Percentile = (Count of students with SGPA ≤ x ÷ Total students) × 100',
        notes: calculation.error || null
    };
};
