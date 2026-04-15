import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Search...' }: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    const [draft, setDraft] = useState(value);

    useEffect(() => setDraft(value), [value]);

    useEffect(() => {
        const id = setTimeout(() => {
            if (draft !== value) onChange(draft);
        }, 400);
        return () => clearTimeout(id);
    }, [draft, onChange, value]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
                type="text"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder={placeholder}
                className="pl-9 pr-3 py-2 w-full sm:w-64 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all placeholder:text-gray-400"
            />
        </div>
    );
}
