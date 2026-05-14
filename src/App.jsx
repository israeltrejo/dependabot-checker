import { useState } from "react";
import { fetchAllRepos, checkDependabotAlerts, exportCSV } from "./requests";
import Toggle from "./Toggle";
import SummaryDashboard from "./SummaryDashboard";
import Toolbar from "./Toolbar";
import ContentTable from "./ContentTable";
import ProgressBar from "./ProgressBar";
import Form from "./Form";
import InfoContent from "./InfoContent";

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
        const dep = await checkDependabotAlerts(org, repo.name, token);
        results.push({
          name: repo.name,
          private: repo.private,
          archived: repo.archived,
          url: repo.html_url,
          config: dep.config,
          alerts: dep.alertsEnabled,
          description: repo.description,
          alertsCount: dep.counts,
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
    if (filter === "alertsEnabled") return r.alerts;
    if (filter === "alertsDisabled") return !r.alerts;
    if (filter === "configEnabled") return r.config;
    if (filter === "configDisabled") return !r.config;
    return true;
  });

  const alertsEnabledCount = repos.filter(r => r.alerts).length;
  const alertsDisabledCount = repos.filter(r => !r.alerts).length;
  const configEnabledCount = repos.filter(r => r.config).length;
  const configDisabledCount = repos.filter(r => !r.config).length;

  return (
    <div className={`${dark ? "dark" : ""} w-full p-6 min-h-screen bg-slate-200 dark:bg-slate-900 overflow-y-hidden min-h-screen max-h-screen`}>
      <div className="font-sans mx-auto p-6 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 bg-slate-50 dark:text-slate-200 dark:bg-slate-950 max-h-[calc(100vh-48px)] overflow-y-hidden h-full">
        <div className="flex flex-col gap-4 h-full overflow-y-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">🔍 Dependabot Checker</h2>
            </div>
            <Toggle
              className="whitespace-nowrap"
              value={dark}
              onChange={() => setDark(d => !d)}
              label="Dark Mode"
            />
          </div>
          <InfoContent />


          <Form onSubmit={run} organization={org} token={token} setOrganization={setOrg} setToken={setToken} disabled={status === STATUS.loading || !org || !token} />

          <ProgressBar enabled={status === STATUS.loading} total={progress.total} current={progress.current} />

          {/* Error */}
          {status === STATUS.error && (
            <div className="bg-red-50 border border-red-400 dark:bg-red-950 dark:border-red-500 rounded-lg px-3.5 py-2.5 mb-4 text-red-600 dark:text-red-300 text-sm">
              ❌ {error}
            </div>
          )}

          {repos.length > 0 && (
            <div className="flex flex-col gap-2 mb-2">
              <SummaryDashboard
                total={repos.length}
                alertsEnabled={alertsEnabledCount}
                alertsDisabled={alertsDisabledCount}
                configEnabled={configEnabledCount}
                configDisabled={configDisabledCount}
                repos={repos}
              />

              <Toolbar currentFilter={filter} setFilter={setFilter} downloadAction={exportCSV} repositories={repos} organization={org} />
            </div>
          )}
        </div>

        {repos.length > 0 && (
          <ContentTable items={filtered} loading={status === STATUS.loading} />
        )}
      </div>
    </div>
  );
}
