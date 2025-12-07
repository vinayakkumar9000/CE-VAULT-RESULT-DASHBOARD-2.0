import React, { lazy, Suspense } from 'react';

// Loading placeholder component
const ChartLoading = () => (
    <div className="glass-panel animate-pulse rounded-xl h-64 flex items-center justify-center">
        <div className="text-white/50">Loading chart...</div>
    </div>
);

// Lazy load chart components
const LazyPerformanceTrendChart = lazy(() => 
    import('recharts').then(module => {
        const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = module;
        return {
            default: ({ data }: { data: any[] }) => (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="semester" stroke="rgba(255,255,255,0.5)" tickFormatter={(val) => `Sem ${val}`} />
                        <YAxis domain={[0, 10]} stroke="rgba(255,255,255,0.5)" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(20, 20, 40, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="sgpa" stroke="#8884d8" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} name="SGPA" />
                        <Line type="monotone" dataKey="cgpa" stroke="#82ca9d" strokeWidth={3} dot={{ r: 6 }} name="CGPA" />
                    </LineChart>
                </ResponsiveContainer>
            )
        };
    })
);

const LazySubjectMarksChart = lazy(() =>
    import('recharts').then(module => {
        const { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } = module;
        return {
            default: ({ data }: { data: any[] }) => (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="code" stroke="rgba(255,255,255,0.5)" />
                        <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.5)" />
                        <Tooltip 
                             contentStyle={{ backgroundColor: 'rgba(20, 20, 40, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                             itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="obtainedMarks" fill="#6366f1" radius={[4, 4, 0, 0]} name="Obtained Marks" />
                        <Bar dataKey="maxMarks" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} name="Max Marks" />
                    </BarChart>
                </ResponsiveContainer>
            )
        };
    })
);

const LazySkillsRadarChart = lazy(() =>
    import('recharts').then(module => {
        const { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } = module;
        return {
            default: ({ data }: { data: any[] }) => {
                // Transform subject data to mock "skills" or just map subjects to axes
                const radarData = data.slice(0, 6).map(sub => ({
                    subject: sub.name.split(' ')[0], // First word for brevity
                    A: sub.obtainedMarks,
                    fullMark: 100,
                }));

                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.2)" />
                            <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.6)" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.2)" />
                            <Radar name="Student" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        </RadarChart>
                    </ResponsiveContainer>
                );
            }
        };
    })
);

// Export wrapped components with Suspense
export const PerformanceTrendChart = ({ data }: { data: any[] }) => (
    <Suspense fallback={<ChartLoading />}>
        <LazyPerformanceTrendChart data={data} />
    </Suspense>
);

export const SubjectMarksChart = ({ data }: { data: any[] }) => (
    <Suspense fallback={<ChartLoading />}>
        <LazySubjectMarksChart data={data} />
    </Suspense>
);

export const SkillsRadarChart = ({ data }: { data: any[] }) => (
    <Suspense fallback={<ChartLoading />}>
        <LazySkillsRadarChart data={data} />
    </Suspense>
);
