const BADGE_COLORS = {
    green: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    red: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300',
    slate: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500',
};

export default function Badge({ value }) {
    const hasValue = value !== null && value !== undefined;
    const text = hasValue ? (value ? 'YES' : 'NO') : "N/A";
    const color = BADGE_COLORS[hasValue ? (value ? 'green' : 'red') : 'slate'];
    return (
        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${color}`}>
            {text}
        </span>
    );
}