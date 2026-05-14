export default function Form({ onSubmit, organization, token, setOrganization, setToken, disabled }) {
    return (
        <div className="flex sm:flex-row flex-col gap-2.5 mb-5">
            <input
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Organization name"
                value={organization}
                onChange={e => setOrganization(e.target.value)}
            />
            <input
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                type="password"
                placeholder="GitHub Personal Access Token"
                value={token}
                onChange={e => setToken(e.target.value)}
            />
            <button
                className={`px-5 py-2 rounded-lg bg-blue-500 text-white border-none font-semibold text-sm transition-all ${disabled ? " opacity-60 cursor-not-allowed" : " cursor-pointer hover:bg-blue-600"}`}
                onClick={onSubmit}
                disabled={disabled}
            >
                Analyze
            </button>
        </div>
    );
}