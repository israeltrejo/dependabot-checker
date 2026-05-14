const FILTERS = ["all", "alertsEnabled", "alertsDisabled", "configEnabled", "configDisabled"];

const FILTER_LABELS = {
    all: "All",
    alertsEnabled: "✅ Alerts enabled",
    alertsDisabled: "❌ Alerts disabled",
    configEnabled: "✅ Config enabled",
    configDisabled: "❌ Config disabled",
};

export default function Toolbar({ currentFilter, setFilter, downloadAction, repositories, organization }) {
    return (
        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <div className="flex gap-1.5">
                {FILTERS.map(filter => (
                    <button
                        key={filter}
                        className={`px-3 py-1 rounded-md border cursor-pointer text-sm transition-colors ${currentFilter === filter
                            ? "bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-950 dark:border-blue-500 dark:text-blue-200"
                            : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                        }`}
                        onClick={() => setFilter(filter)}
                    >
                        {FILTER_LABELS[filter]}
                    </button>
                ))}
            </div>
            <button
                className="px-3.5 py-1 rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 cursor-pointer text-sm transition-colors"
                onClick={() => downloadAction(repositories, organization)}
            >
                ⬇ Download Results
            </button>
        </div>
    );
}