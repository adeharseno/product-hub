import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Menu, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
        toast.success('Logged out');
        navigate('/login', { replace: true });
    };

    return (
        <header className="h-14 bg-white border-b border-gray-200/80 flex items-center justify-between px-4 lg:px-6">
            <button
                onClick={onToggleSidebar}
                className="lg:hidden p-1.5 rounded-lg  transition-colors cursor-pointer"
                aria-label="Toggle sidebar"
            >
                <Menu className="w-5 h-5 text-gray-500" />
            </button>

            <div className="flex-1" />

            {user && (
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((o) => !o)}
                        className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg  transition-colors cursor-pointer"
                    >
                        <img
                            src={user.image}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-7 h-7 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                            {user.firstName} {user.lastName}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                        <div className="animate-dropdown absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl border border-gray-200 shadow-lg shadow-gray-200/50 py-1.5 z-50">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 cursor-pointer"
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
