export default function SummaryDashboard({ total, alertsEnabled, alertsDisabled, configEnabled, configDisabled }) {
    return (
        <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-center">
                <span className="block text-3xl font-bold text-slate-800 dark:text-slate-100">{total}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Total repositories</span>
            </div>
            <div className="flex-1 bg-white dark:bg-slate-800 border border-green-500 rounded-lg px-4 py-3 text-center">
                <span className="block text-3xl font-bold text-green-600 dark:text-green-500">{alertsEnabled}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">With Dependabot Alerts</span>
            </div>
            <div className="flex-1 bg-white dark:bg-slate-800 border border-red-500 rounded-lg px-4 py-3 text-center">
                <span className="block text-3xl font-bold text-red-600 dark:text-red-500">{alertsDisabled}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Without Dependabot Alerts</span>
            </div>
            <div className="flex-1 bg-white dark:bg-slate-800 border border-green-500 rounded-lg px-4 py-3 text-center">
                <span className="block text-3xl font-bold text-green-600 dark:text-green-500">{configEnabled}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">With Dependabot Config</span>
            </div>
            <div className="flex-1 bg-white dark:bg-slate-800 border border-red-500 rounded-lg px-4 py-3 text-center">
                <span className="block text-3xl font-bold text-red-600 dark:text-red-500">{configDisabled}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Without Dependabot Config</span>
            </div>
        </div>
    );
}