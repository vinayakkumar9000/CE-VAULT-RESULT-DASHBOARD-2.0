import React from 'react';
import { Student } from '../types';

interface StudentCreditCardProps {
    student: Student;
    onClick?: () => void;
}

export const StudentCreditCard: React.FC<StudentCreditCardProps> = ({ student, onClick }) => {
    const result = student.results[0]; // Assuming latest
    const isCarry = result.remarks.includes('Carry');
    
    // Formatting Registration Number like: 127 15 24 001 (3-2-2-3)
    const formattedReg = student.regNumber.replace(/^(\d{3})(\d{2})(\d{2})(\d{3})$/, '$1 $2 $3 $4');

    // Extract last 3 digits for Roll Number display (e.g. 211271524001 -> 1)
    const displayRoll = parseInt(student.rollNumber.slice(-3), 10);

    return (
        <div 
            onClick={onClick}
            className={`
                relative w-full aspect-[1.586/1] rounded-[24px] overflow-hidden 
                transition-all duration-300 hover:scale-[1.02] cursor-pointer group shadow-2xl
                select-none font-['Space_Mono'] h-full
            `}
        >
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                 {/* Top half is glass */}
                <div className="absolute top-0 left-0 w-full h-[55%] bg-white/10 backdrop-blur-md z-10 border-b border-white/10"></div>
                {/* Bottom half is gradient color based on status */}
                <div className={`absolute top-[55%] left-0 w-full h-[45%] z-0 
                    ${isCarry ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'}
                `}></div>
                
                {/* Decorative orbs */}
                <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-purple-400/30 rounded-full blur-[40px] z-20"></div>
                <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 bg-blue-400/30 rounded-full blur-[40px] z-20"></div>
            </div>

            {/* Content Layer */}
            <div className="relative z-30 h-full flex flex-col justify-between p-6 text-white">
                
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-80 font-sans font-bold">
                            {student.course}
                        </div>
                    </div>
                </div>

                {/* Main Number (Registration Number) */}
                <div className="mt-2">
                    <div className="text-xl md:text-2xl lg:text-3xl tracking-widest drop-shadow-md">
                        {formattedReg}
                    </div>
                    <div className="text-[10px] opacity-60 mt-1 font-sans flex flex-col gap-0.5">
                        <div className="flex gap-4">
                            <span>ROLL NO: {displayRoll}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="flex justify-between items-end mt-4">
                    <div>
                        <div className="text-[9px] uppercase opacity-70 mb-1 font-sans">STUDENT NAME</div>
                        <div className="text-sm md:text-lg font-bold tracking-wide uppercase truncate max-w-[280px]">
                            {student.name}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Holographic overlay effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-40"></div>
        </div>
    );
};