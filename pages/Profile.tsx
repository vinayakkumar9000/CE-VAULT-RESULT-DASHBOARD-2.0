import React from 'react';
import { Student } from '../types';
import { GlassCard } from '../components/GlassComponents';
import { PerformanceTrendChart, SkillsRadarChart } from '../components/Charts';
import { Mail, Phone, BookOpen, Calendar, ShieldCheck } from 'lucide-react';

interface ProfileProps {
    student: Student;
}

const Profile: React.FC<ProfileProps> = ({ student }) => {
    // Prepare data for charts
    const trendData = student.results.map(r => ({
        semester: r.semester,
        sgpa: r.sgpa,
        cgpa: r.cgpa
    }));

    const latestResult = student.results[student.results.length - 1];

    // Extract simplified roll number
    const displayRoll = parseInt(student.rollNumber.slice(-3), 10);

    return (
        <div className="p-6 md:p-10 pb-24 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Profile Header */}
            <GlassCard className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>
                <div className="relative pt-12 flex flex-col md:flex-row items-end md:items-center gap-6">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-gray-700 to-black border-4 border-white/10 shadow-xl flex items-center justify-center overflow-hidden">
                         {student.avatarUrl ? (
                             <img src={student.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                         ) : (
                             <span className="text-4xl font-bold text-gray-500">{student.name.charAt(0)}</span>
                         )}
                    </div>
                    <div className="flex-1 pb-2">
                        <h1 className="text-3xl font-bold text-white">{student.name}</h1>
                        <p className="text-gray-300">Roll: {displayRoll} • {student.course}</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 pb-2">
                        <div className="flex items-center gap-2 text-gray-400 text-sm bg-black/20 px-3 py-1 rounded-full border border-white/5">
                            <Mail size={14} /> {student.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm bg-black/20 px-3 py-1 rounded-full border border-white/5">
                            <Phone size={14} /> {student.contact}
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <GlassCard className="p-4 flex items-center gap-4">
                     <div className="p-3 bg-blue-500/20 rounded-full text-blue-300"><BookOpen size={20}/></div>
                     <div>
                         <p className="text-xs text-gray-400">Current Sem</p>
                         <p className="text-xl font-bold">Sem {student.currentSemester}</p>
                     </div>
                 </GlassCard>
                 <GlassCard className="p-4 flex items-center gap-4">
                     <div className="p-3 bg-green-500/20 rounded-full text-green-300"><ShieldCheck size={20}/></div>
                     <div>
                         <p className="text-xs text-gray-400">CGPA</p>
                         <p className="text-xl font-bold">{latestResult.cgpa.toFixed(2)}</p>
                     </div>
                 </GlassCard>
                 <GlassCard className="p-4 flex items-center gap-4">
                     <div className="p-3 bg-purple-500/20 rounded-full text-purple-300"><Calendar size={20}/></div>
                     <div>
                         <p className="text-xs text-gray-400">Batch</p>
                         <p className="text-xl font-bold">2023-27</p>
                     </div>
                 </GlassCard>
                 <GlassCard className="p-4 flex items-center gap-4">
                     <div className="p-3 bg-red-500/20 rounded-full text-red-300"><ShieldCheck size={20}/></div>
                     <div>
                         <p className="text-xs text-gray-400">Active Backlogs</p>
                         <p className="text-xl font-bold">{student.results.reduce((acc, curr) => acc + curr.backlogCount, 0)}</p>
                     </div>
                 </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Academic Progress */}
                <GlassCard>
                    <h2 className="text-xl font-semibold mb-6">Academic Progression</h2>
                    <PerformanceTrendChart data={trendData} />
                </GlassCard>

                {/* Skills/Subject Spread */}
                <GlassCard>
                    <h2 className="text-xl font-semibold mb-6">Subject Proficiency (Latest Sem)</h2>
                    <SkillsRadarChart data={latestResult.subjects} />
                </GlassCard>
            </div>
        </div>
    );
};

export default Profile;