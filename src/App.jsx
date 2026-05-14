import { useState } from "react";
import { fetchAllRepos, checkDependabot, exportCSV } from "./requests";
import Toggle from "./Toggle";
import SummaryDashboard from "./SummaryDashboard";
import Toolbar from "./Toolbar";
import ContentTable from "./ContentTable";
import ProgressBar from "./ProgressBar";
import Form from "./Form";

const STATUS = { idle: "idle", loading: "loading", done: "done", error: "error" };

export default function App() {
  const [org, setOrg] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState(STATUS.idle);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [dark, setDark] = useState(true);

  async function run() {
    if (!org || !token) return;
    setStatus(STATUS.loading);
    setRepos([]);
    setError("");
    try {
      const allRepos = await fetchAllRepos(org, token);
      console.log('allRepos',allRepos);
      setProgress({ current: 0, total: allRepos.length });
      const results = [];
      for (let i = 0; i < allRepos.length; i++) {
        const repo = allRepos[i];
        const dep = await checkDependabot(org, repo.name, token);
        results.push({
          name: repo.name,
          private: repo.private,
          archived: repo.archived,
          url: repo.html_url,
          config: dep.config,
          alerts: dep.alerts,
          description: repo.description,
          language: repo.language,
          updated_at: new Date(repo.updated_at).toLocaleDateString(),
          created_at: new Date(repo.created_at).toLocaleDateString(),
          visibility: repo.visibility,
        });
        setProgress({ current: i + 1, total: allRepos.length });
        setRepos([...results]);
      }
      setStatus(STATUS.done);
    } catch (e) {
      setError(e.message);
      setStatus(STATUS.error);
    }
  }

  const filtered = repos.filter(r => {
    if (filter === "enabled") return r.config || r.alerts;
    if (filter === "disabled") return !r.config && !r.alerts;
    return true;
  });

  const enabledCount = repos.filter(r => r.config || r.alerts).length;
  const disabledCount = repos.filter(r => !r.config && !r.alerts).length;

  return (
    <div className={`${dark ? "dark" : ""} w-full p-6 min-h-screen bg-slate-200 dark:bg-slate-900`}>
      <div className="font-sans mx-auto p-6 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 bg-slate-50 dark:text-slate-200 dark:bg-slate-950 min-h-screen">

        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-2xl font-semibold">🔍 Dependabot Checker</h2>
          <Toggle 
            value={dark} 
            onChange={() => setDark(d => !d)} 
            label="Dark Mode" 
          />
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-5 text-sm">
          Verify if your GitHub repositories have Dependabot enabled.
        </p>

        <Form onSubmit={run} organization={org} token={token} setOrganization={setOrg} setToken={setToken} disabled={status === STATUS.loading || !org || !token} />

        <ProgressBar enabled={status === STATUS.loading} total={progress.total} current={progress.current} />

        {/* Error */}
        {status === STATUS.error && (
          <div className="bg-red-50 border border-red-400 dark:bg-red-950 dark:border-red-500 rounded-lg px-3.5 py-2.5 mb-4 text-red-600 dark:text-red-300 text-sm">
            ❌ {error}
          </div>
        )}

        {repos.length > 0 && (
          <>
            <SummaryDashboard total={repos.length} enabled={enabledCount} disabled={disabledCount} />

            <Toolbar currentFilter={filter} setFilter={setFilter} downloadAction={exportCSV} repositories={repos} organization={org} />

            <ContentTable items={filtered} />
          </>
        )}
      </div>
    </div>
  );
}
