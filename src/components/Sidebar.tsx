import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

const NAV_ITEMS = [
    { to: '/', label: 'Home', end: true },
    { to: '/products', label: 'Products', end: true },
] as const;

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
      isActive
        ? 'bg-indigo-50 text-indigo-600'
        : 'text-gray-500'
    }`;

    return (
        <>
            {isOpen && (
                <div
                className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-20 lg:hidden transition-opacity"
                onClick={onClose}
                />
            )}

            <aside
                className={`fixed lg:static inset-y-0 left-0 z-30 w-56 bg-white border-r border-gray-200/80 flex flex-col transition-transform duration-200 ease-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200/80">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 tracking-tight">ProductHub</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV_ITEMS.map(({ to, label, end }) => (
                        <NavLink key={to} to={to} end={end} className={linkClass} onClick={onClose}>
                        {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
}
