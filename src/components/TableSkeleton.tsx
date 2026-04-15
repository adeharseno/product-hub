const widths = [65, 80, 55, 70, 45, 75];

export default function TableSkeleton({ rows = 5 }: { rows?: number }) {
	return (
		<div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
			<div className="grid grid-cols-6 gap-4 px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
				{widths.map((w, i) => (
					<div key={i} className="h-3 rounded-full bg-gray-200 animate-skeleton" style={{ width: `${w}%` }} />
				))}
			</div>
			{Array.from({ length: rows }).map((_, i) => (
				<div key={i} className="grid grid-cols-6 gap-4 items-center px-5 py-4 border-b border-gray-50 last:border-b-0">
					<div className="w-9 h-9 rounded-lg bg-gray-100 animate-skeleton" />
					<div className="h-3.5 rounded-full bg-gray-100 animate-skeleton" style={{ width: '75%' }} />
					<div className="h-3 rounded-full bg-gray-100 animate-skeleton" style={{ width: '60%' }} />
					<div className="h-3 rounded-full bg-gray-100 animate-skeleton ml-auto" style={{ width: '50%' }} />
					<div className="h-3 rounded-full bg-gray-100 animate-skeleton ml-auto" style={{ width: '40%' }} />
					<div className="flex justify-end gap-2">
						<div className="w-7 h-7 rounded-lg bg-gray-100 animate-skeleton" />
						<div className="w-7 h-7 rounded-lg bg-gray-100 animate-skeleton" />
						<div className="w-7 h-7 rounded-lg bg-gray-100 animate-skeleton" />
					</div>
				</div>
			))}
		</div>
	);
}
