import React, { useState } from 'react';
import { Student, SemesterResult, AnalysisResult, Subject } from '../types';
import { GlassCard, Badge, GlassButton } from '../components/GlassComponents';
import { SubjectMarksChart } from '../components/Charts';
import { Sparkles, Download, Share2, AlertTriangle, CheckCircle, BrainCircuit, XCircle, BookOpen, X, Loader2 } from 'lucide-react';
import { analyzeStudentPerformance, getSubjectDetails } from '../services/geminiService';

interface ResultProps {
    student: Student;
}

const Result: React.FC<ResultProps> = ({ student }) => {
    const [selectedSem, setSelectedSem] = useState<number>(student.currentSemester);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    
    // States for "Learn More" functionality
    const [selectedWeakArea, setSelectedWeakArea] = useState<string | null>(null);
    const [weakAreaDetails, setWeakAreaDetails] = useState<string | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const currentResult: SemesterResult | undefined = student.results.find(r => r.semester === selectedSem);

    const handleAnalyze = async () => {
        setLoadingAnalysis(true);
        const result = await analyzeStudentPerformance(student, student.results.findIndex(r => r.semester === selectedSem));
        setAnalysis(result);
        setLoadingAnalysis(false);
    };

    const handleLearnMore = async (subject: string) => {
        setSelectedWeakArea(subject);
        setLoadingDetails(true);
        setWeakAreaDetails(null);
        
        const details = await getSubjectDetails(subject);
        
        setWeakAreaDetails(details);
        setLoadingDetails(false);
    };

    const closeLearnMore = () => {
        setSelectedWeakArea(null);
        setWeakAreaDetails(null);
    };

    if (!currentResult) return <div className="p-10 text-center text-white">Semester result not found.</div>;

    // Group subjects by category
    const groupedSubjects = currentResult.subjects.reduce((acc, subject) => {
        const cat = subject.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(subject);
        return acc;
    }, {} as Record<string, Subject[]>);

    // Extract simplified roll number
    const displayRoll = parseInt(student.rollNumber.slice(-3), 10);

    const isCarry = currentResult.remarks.toLowerCase().includes('carry');
    const isFail = currentResult.remarks.toLowerCase().includes('fail');

    return (
        <div className="p-4 md:p-8 pb-24 max-w-7xl mx-auto space-y-6 animate-fade-in text-white relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-1">{student.name}</h1>
                    <div className="flex gap-4 text-sm text-gray-300 font-mono">
                        <span>ROLL: {displayRoll}</span>
                        <span>REG: {student.regNumber}</span>
                    </div>
                    <p className="text-blue-300 mt-1">{student.course} | Session {currentResult.session}</p>
                </div>
                <div className="flex gap-2">
                     {/* Semester Selector */}
                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                        {student.results.map(r => (
                            <button
                                key={r.semester}
                                onClick={() => { setSelectedSem(r.semester); setAnalysis(null); }}
                                className={`px-4 py-2 rounded-lg text-sm transition-all ${selectedSem === r.semester ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Sem {r.semester}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <GlassCard className="text-center py-6">
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">SGPA</p>
                    <p className="text-4xl font-bold text-blue-400">{currentResult.sgpa}</p>
                </GlassCard>
                <GlassCard className="text-center py-6">
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Total Marks</p>
                    <p className="text-4xl font-bold text-purple-400">
                        {currentResult.totalMarks}
                        <span className="text-lg text-gray-500 font-normal">/{currentResult.maxTotalMarks}</span>
                    </p>
                </GlassCard>
                <GlassCard className="text-center py-6 bg-yellow-500/10 border-yellow-500/30">
                    <p className="text-yellow-200/80 text-xs uppercase tracking-widest mb-2">Percentile</p>
                    <p className="text-4xl font-bold text-yellow-300">
                        {currentResult.percentile}
                        {currentResult.percentile !== 'N/A' && <span className="text-lg font-normal">%</span>}
                    </p>
                </GlassCard>
                
                {/* Result Status Card with Highlight Logic */}
                <GlassCard className={`text-center py-6 transition-all duration-300 ${
                    isCarry ? 'bg-orange-500/20 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 
                    isFail ? 'bg-red-500/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : ''
                }`}>
                    <p className={`text-xs uppercase tracking-widest mb-2 ${isCarry ? 'text-orange-200' : isFail ? 'text-red-200' : 'text-gray-400'}`}>Result Status</p>
                    <div className="flex justify-center items-center gap-2">
                        {(isCarry || isFail) && <AlertTriangle size={18} className={isCarry ? 'text-orange-400' : 'text-red-400'} />}
                        <Badge 
                            type={isFail ? 'fail' : isCarry ? 'carry' : 'pass'} 
                            text={currentResult.remarks} 
                        />
                    </div>
                </GlassCard>

                <GlassCard className="text-center py-6">
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Published</p>
                    <p className="text-lg font-bold text-white mt-2">{currentResult.publishedDate}</p>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Detailed Table */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="p-0 overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                            <h2 className="text-lg font-semibold">Marks Statement</h2>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition"><Download size={18}/></button>
                                <button className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition"><Share2 size={18}/></button>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-black/20 text-xs uppercase text-gray-400">
                                    <tr>
                                        <th className="py-3 px-6 font-medium">Subject</th>
                                        <th className="py-3 px-4 font-medium text-center">Cred</th>
                                        <th className="py-3 px-4 font-medium text-center">Max</th>
                                        <th className="py-3 px-4 font-medium text-center">Obt</th>
                                        <th className="py-3 px-4 font-medium text-center">Grd</th>
                                        <th className="py-3 px-4 font-medium text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {Object.entries(groupedSubjects).map(([category, subjects]) => (
                                        <React.Fragment key={category}>
                                            <tr className="bg-white/5">
                                                <td colSpan={6} className="py-2 px-6 font-bold text-blue-200 text-xs uppercase tracking-wider">
                                                    {category} Papers
                                                </td>
                                            </tr>
                                            {subjects.map((sub, idx) => (
                                                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-3 px-6 text-white font-medium">{sub.name}</td>
                                                    <td className="py-3 px-4 text-center text-gray-400">{sub.credits}</td>
                                                    <td className="py-3 px-4 text-center text-gray-400">{sub.maxMarks}</td>
                                                    <td className="py-3 px-4 text-center font-bold text-white">{sub.obtainedMarks}</td>
                                                    <td className="py-3 px-4 text-center font-mono text-yellow-200">{sub.grade}</td>
                                                    <td className="py-3 px-4 text-center">
                                                        {sub.isBacklog ? (
                                                            <span className="text-red-400 flex items-center justify-center gap-1 text-xs font-bold"><AlertTriangle size={12}/> FAIL</span>
                                                        ) : (
                                                            <span className="text-green-400 flex items-center justify-center gap-1 text-xs font-bold"><CheckCircle size={12}/> PASS</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>

                {/* AI Sidebar */}
                <div className="space-y-6">
                    <GlassCard className="relative overflow-hidden border-blue-500/30">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <BrainCircuit size={80} className="text-blue-400" />
                        </div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Sparkles className="text-blue-400" size={20} /> AI Analysis
                        </h2>
                        
                        {!analysis && !loadingAnalysis && (
                            <div className="text-center py-8">
                                <p className="text-gray-400 mb-4 text-sm">Get personalized insights powered by Gemini.</p>
                                <GlassButton onClick={handleAnalyze} className="w-full justify-center">
                                    Analyze Performance
                                </GlassButton>
                            </div>
                        )}

                        {loadingAnalysis && (
                            <div className="py-10 flex flex-col items-center justify-center space-y-4">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-blue-300 animate-pulse text-sm">Gemini is thinking...</p>
                            </div>
                        )}

                        {analysis && (
                            <div className="space-y-4 animate-fade-in text-sm">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                    <h3 className="text-blue-300 font-semibold mb-2">Summary</h3>
                                    <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
                                </div>

                                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                    <h3 className="text-red-300 font-semibold mb-2">Focus Areas</h3>
                                    {analysis.weakAreas.length > 0 ? (
                                        <ul className="space-y-2">
                                            {analysis.weakAreas.map((area, i) => (
                                                <li key={i} className="flex flex-col gap-1 bg-white/5 p-2 rounded-lg">
                                                    <span className="text-gray-300">{area}</span>
                                                    <button 
                                                        onClick={() => handleLearnMore(area)}
                                                        className="text-xs text-blue-300 hover:text-blue-200 flex items-center gap-1 self-start transition-colors"
                                                    >
                                                        <BookOpen size={12} /> Learn More
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p className="text-gray-300">Great job! No weak areas detected.</p>}
                                </div>

                                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                    <h3 className="text-purple-300 font-semibold mb-2">Prediction</h3>
                                    <p className="text-gray-300">{analysis.prediction}</p>
                                </div>
                                
                                <GlassButton onClick={() => setAnalysis(null)} variant="secondary" className="w-full text-xs py-2 mt-2">
                                    Reset Analysis
                                </GlassButton>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>

            {/* Learn More Modal */}
            {selectedWeakArea && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <GlassCard className="w-full max-w-lg relative bg-[#0f1021] border-blue-500/30">
                        <button 
                            onClick={closeLearnMore}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                        
                        <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                            <BookOpen className="text-blue-400" size={24} /> 
                            Improve: {selectedWeakArea}
                        </h3>
                        <p className="text-xs text-blue-200 mb-6">AI Generated Study Plan</p>

                        {loadingDetails ? (
                            <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                                <p className="text-gray-400 text-sm animate-pulse">Gathering resources...</p>
                            </div>
                        ) : (
                            <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {weakAreaDetails}
                            </div>
                        )}
                    </GlassCard>
                </div>
            )}
        </div>
    );
};

export default Result;