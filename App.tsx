import React, { useState } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Result from './pages/Result';
import Profile from './pages/Profile';
import ChatBot from './components/ChatBot';
import ScrollControls from './components/ScrollControls';
import { GENERATED_STUDENTS } from './generatedData';
import { Student } from './types';

const App = () => {
    // Simple state-based routing for a single-page feel
    const [activeTab, setActiveTab] = useState('home');
    const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

    const handleSearch = (rollNo: string) => {
        const student = GENERATED_STUDENTS.find(s => s.rollNumber.toLowerCase() === rollNo.toLowerCase());
        if (student) {
            setCurrentStudent(student);
            setActiveTab('results');
        } else {
            alert('Student not found! Please try a valid roll number.');
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <Home onSearch={handleSearch} />;
            case 'results':
                return currentStudent ? <Result student={currentStudent} /> : <div className="text-center p-20 text-gray-400">Please search for a student first.</div>;
            case 'profile':
                return currentStudent ? <Profile student={currentStudent} /> : <div className="text-center p-20 text-gray-400">Please search for a student first.</div>;
            default:
                return <Home onSearch={handleSearch} />;
        }
    };

    return (
        <div className="min-h-screen text-white pb-20">
            {renderContent()}
            {activeTab !== 'home' && (
                <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            )}
            <ScrollControls />
            <ChatBot />
            <Analytics />
            <SpeedInsights />
        </div>
    );
};

export default App;