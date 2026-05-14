const VISIBILITY_COLORS = {
    'private': 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    'public': 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    'archived': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    'internal': 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
};

export default function VisibilityBadge({ visibility = 'public' }) {
    return (
        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${VISIBILITY_COLORS[visibility]}`}>
            {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
        </span>
    );
}