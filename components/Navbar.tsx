import React from 'react';
import { Home, User, BarChart2 } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'results', icon: BarChart2, label: 'Results' },
        { id: 'profile', icon: User, label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] md:w-auto z-50">
            <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-2 md:gap-6 shadow-2xl">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col md:flex-row items-center gap-2 px-4 py-2 rounded-full transition-all ${
                            activeTab === item.id 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <item.icon size={20} />
                        <span className="text-xs md:text-sm font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;