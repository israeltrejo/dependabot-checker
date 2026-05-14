const ALERT_COLORS = {
    critical: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    high: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    low: 'bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300',
    total: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
};

export default function AlertBadge ({ severity = 'total', count = 0, disabled = false }) {
    const label = disabled ? 'N/A' : `${count} ${severity.charAt(0).toUpperCase() + severity.slice(1)}`;
    return (
        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap flex items-center justify-center ${disabled ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' : ALERT_COLORS[severity]}`}>
            {label}
        </span>
    );
}