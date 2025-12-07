import React, { useState } from 'react';
import { GlassCard, GlassButton, GlassInput } from '../components/GlassComponents';
import { Upload, Users, Image as ImageIcon, Wand2, Download, Sparkles } from 'lucide-react';
import { generateStudentAvatar } from '../services/geminiService';
import { ImageResolution } from '../types';

const Dashboard = () => {
    const [prompt, setPrompt] = useState('');
    const [resolution, setResolution] = useState<ImageResolution>('1K');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateImage = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        const imgUrl = await generateStudentAvatar(prompt, resolution);
        setGeneratedImage(imgUrl);
        setIsGenerating(false);
    };

    return (
        <div className="p-6 md:p-10 pb-24 max-w-7xl mx-auto space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="flex flex-col items-center justify-center py-10 border-dashed border-2 border-white/20 bg-transparent hover:bg-white/5 cursor-pointer">
                    <Upload size={40} className="text-gray-400 mb-4" />
                    <p className="text-lg font-medium">Upload Results CSV</p>
                    <p className="text-xs text-gray-500 mt-2">Drag and drop or click to browse</p>
                </GlassCard>
                
                <GlassCard className="flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-blue-400">
                            <Users size={20} /> <span className="font-semibold">Total Students</span>
                        </div>
                        <p className="text-4xl font-bold">1,245</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Pass Rate</span>
                            <span className="text-green-400">92%</span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="flex flex-col justify-between">
                     <div>
                        <div className="flex items-center gap-2 mb-2 text-purple-400">
                            <Wand2 size={20} /> <span className="font-semibold">AI Requests</span>
                        </div>
                        <p className="text-4xl font-bold">856</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>API Status</span>
                            <span className="text-green-400">Healthy</span>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Image Generation Section */}
            <GlassCard className="border-t-4 border-t-pink-500">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-500/20 rounded-lg text-pink-300">
                        <ImageIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Studio Gen - Nano Banana Pro</h2>
                        <p className="text-sm text-gray-400">Generate high-fidelity student avatars or campus assets.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Prompt Description</label>
                            <textarea 
                                className="glass-input w-full rounded-xl p-4 min-h-[120px] resize-none"
                                placeholder="E.g., A futuristic student studying holograms in a glass library..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Resolution</label>
                            <div className="flex gap-2">
                                {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                                    <button
                                        key={res}
                                        onClick={() => setResolution(res)}
                                        className={`px-4 py-2 rounded-lg border transition-all ${
                                            resolution === res 
                                            ? 'bg-pink-500/20 border-pink-500 text-pink-200 shadow-lg shadow-pink-500/20' 
                                            : 'border-white/10 hover:bg-white/5 text-gray-400'
                                        }`}
                                    >
                                        {res}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <GlassButton 
                            onClick={handleGenerateImage} 
                            disabled={isGenerating || !prompt}
                            className="w-full justify-center bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none"
                        >
                            {isGenerating ? (
                                <span className="flex items-center gap-2">
                                    <Wand2 className="animate-spin" size={18} /> Generating...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Sparkles size={18} /> Generate Asset
                                </span>
                            )}
                        </GlassButton>
                    </div>

                    <div className="flex items-center justify-center bg-black/20 rounded-2xl min-h-[300px] border border-white/10 relative overflow-hidden group">
                        {generatedImage ? (
                            <>
                                <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <GlassButton onClick={() => window.open(generatedImage)} variant="secondary">
                                        View Full
                                    </GlassButton>
                                    <GlassButton variant="primary">
                                        <Download size={18} /> Save
                                    </GlassButton>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-500">
                                <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                                <p>Preview Area</p>
                            </div>
                        )}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default Dashboard;