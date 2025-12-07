import React, { useState } from 'react';
import { Search, Wand2, RefreshCw } from 'lucide-react';
import { GlassCard, GlassInput } from '../components/GlassComponents';
import { StudentCreditCard } from '../components/StudentCreditCard';
import { MOCK_STUDENTS } from '../mockData';
import { Student } from '../types';
import { generateStudentAvatar } from '../services/geminiService';

interface HomeProps {
    onSearch: (roll: string) => void;
}

const Home: React.FC<HomeProps> = ({ onSearch }) => {
    const [searchText, setSearchText] = useState('');
    const [bgImage, setBgImage] = useState<string>('');
    const [isGeneratingBg, setIsGeneratingBg] = useState(false);

    // Filter students based on search
    const filteredStudents = MOCK_STUDENTS.filter(s => 
        s.name.toLowerCase().includes(searchText.toLowerCase()) || 
        s.rollNumber.includes(searchText) ||
        s.regNumber.includes(searchText)
    );

    const handleGenerateBackground = async () => {
        setIsGeneratingBg(true);
        // Using Gemini Nano Banana Pro (gemini-3-pro-image-preview) via service
        const prompt = "A futuristic, high-tech abstract educational background with glassmorphism elements, deep blue and purple nebula themes, 4k resolution, smooth gradients, no text, cinematic lighting.";
        const url = await generateStudentAvatar(prompt, '4K'); // Reuse service
        if (url) {
            setBgImage(url);
        }
        setIsGeneratingBg(false);
    };

    return (
        <div 
            className="min-h-screen flex flex-col p-4 relative overflow-x-hidden transition-all duration-1000"
            style={{
                backgroundImage: bgImage ? `url(${bgImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Overlay if image is set to ensure readability */}
            {bgImage && <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>}

            {/* Header / Search Bar */}
            <div className="relative z-10 w-full max-w-7xl mx-auto pt-8 pb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-white tracking-tight">CE Result Vault</h1>
                    <p className="text-blue-200 text-sm">Semester Results 2025</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-96">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <GlassInput 
                            placeholder="Search name or roll..." 
                            className="pl-12 py-3 rounded-full bg-white/10 border-white/20 focus:bg-white/20"
                            value={searchText}
                            onChange={(e: any) => setSearchText(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleGenerateBackground}
                        disabled={isGeneratingBg}
                        className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all tooltip"
                        title="Generate AI Theme"
                    >
                        {isGeneratingBg ? <RefreshCw className="animate-spin" size={20}/> : <Wand2 size={20}/>}
                    </button>
                </div>
            </div>

            {/* Student Grid */}
            <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <StudentCreditCard 
                            key={student.id} 
                            student={student} 
                            onClick={() => onSearch(student.rollNumber)}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-gray-400">
                        No students found matching "{searchText}"
                    </div>
                )}
            </div>
            
            <div className="absolute bottom-4 left-0 w-full text-center text-xs text-white/30 z-10">
                Powered by Gemini Nano Banana Pro • Civil Engineering Department
            </div>
        </div>
    );
};

export default Home;