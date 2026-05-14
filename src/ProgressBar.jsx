export default function ProgressBar({ enabled, total, current }) {
    if (!enabled) {
        return null;
    }
    
    return (
        <div className="mb-4">
            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                <div
                    className="h-full bg-blue-600 transition-[width] duration-300"
                    style={{ width: `${total ? (current / total) * 100 : 0}%` }}
                />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 m-0">
                {current} / {total} repositories checked
            </p>
        </div>
    );
}