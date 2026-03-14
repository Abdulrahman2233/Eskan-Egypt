interface VerifiedBadgeProps {
	className?: string;
}

export default function VerifiedBadge({ className = "" }: VerifiedBadgeProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			className={className || "w-6 h-6"}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Background badge */}
			<g fill="#1f6cf0">
				<circle cx="12" cy="12" r="6.7" />
				<circle cx="12" cy="4.6" r="2.15" />
				<circle cx="15.7" cy="5.6" r="2.15" />
				<circle cx="18.4" cy="8.3" r="2.15" />
				<circle cx="19.4" cy="12" r="2.15" />
				<circle cx="18.4" cy="15.7" r="2.15" />
				<circle cx="15.7" cy="18.4" r="2.15" />
				<circle cx="12" cy="19.4" r="2.15" />
				<circle cx="8.3" cy="18.4" r="2.15" />
				<circle cx="5.6" cy="15.7" r="2.15" />
				<circle cx="4.6" cy="12" r="2.15" />
				<circle cx="5.6" cy="8.3" r="2.15" />
				<circle cx="8.3" cy="5.6" r="2.15" />
			</g>

			{/* Check mark */}
			<path
				d="M9.5 12.5l1.8 1.8 3.8-3.8"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
