import { useState, type ReactNode } from 'react';

export default function Tooltip({ label, children }: { label: string; children: ReactNode }) {
	const [visible, setVisible] = useState(false);

	return (
		<div
			className="relative inline-flex"
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
		>
			{children}
			{visible && (
				<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-[11px] font-medium text-white bg-gray-900 rounded-md whitespace-nowrap pointer-events-none animate-dropdown">
					{label}
				</div>
			)}
		</div>
	);
}
