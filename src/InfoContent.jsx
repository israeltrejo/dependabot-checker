export default function InfoContent() {
    return (
        <div className="flex flex-col gap-2 mb-3">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
                Verify if your GitHub repositories have Dependabot alerts and config enabled.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
                Write your GitHub organization name and your GitHub personal access token (classic). You can create one <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 no-underline font-medium hover:underline">here</a>.
            </p>
        </div>
    );
}