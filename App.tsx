import React, { useState, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ScrollControls from './components/ScrollControls';
import { getStudentByRoll } from './services/studentService';
import { Student } from './types';

const Result = lazy(() => import('./pages/Result'));
const Profile = lazy(() => import('./pages/Profile'));
const ChatBot = lazy(() => import('./components/ChatBot'));

const App = () => {
    // Simple state-based routing for a single-page feel
    const [activeTab, setActiveTab] = useState('home');
    const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

    const handleSearch = (rollNo: string) => {
        const student = getStudentByRoll(rollNo);
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
            <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/50"></div></div>}>
                {renderContent()}
            </Suspense>
            {activeTab !== 'home' && (
                <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            )}
            <ScrollControls />
            <Suspense fallback={null}>
                <ChatBot />
            </Suspense>
        </div>
    );
};

export default App;