const parseLinkNext = (linkHeader) => {
    if (!linkHeader) return null;
    const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
    return match ? match[1] : null;
};

export const getHeaders = (token) => {
    return {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    };
};

export const checkDependabotAlerts = async (org, repoName, token) => {
    const headers = getHeaders(token);
    let config = false;
    for (const ext of ["yml", "yaml"]) {
        const response = await fetch(
            `https://api.github.com/repos/${org}/${repoName}/contents/.github/dependabot.${ext}`,
            { headers }
        );
        if (response.status === 200) { config = true; break; }
    }

    // 2. Open Dependabot alerts — si el endpoint responde 200, las alertas están habilitadas
    const counts = { critical: 0, high: 0, medium: 0, low: 0, total: 0 };
    let alertsEnabled = true;
    try {
        let url = `https://api.github.com/repos/${org}/${repoName}/dependabot/alerts?state=open&per_page=100`;
        while (url) {
            const response = await fetch(url, { headers });
            if (response.status === 403 || response.status === 404) { alertsEnabled = false; break; }
            if (!response.ok) { alertsEnabled = false; break; }
            const data = await response.json();
            if (!data.length) break;
            data.forEach(a => {
                const sev = a.security_advisory?.severity?.toLowerCase();
                if (sev in counts) counts[sev]++;
                counts.total++;
            });
            url = parseLinkNext(response.headers.get("Link"));
        }
    } catch (_) { alertsEnabled = false; }

    return { config, alertsEnabled, counts };
};

export const fetchAllRepos = async (org, token) => {
    const headers = getHeaders(token);
    try {
        let all = [], page = 1;
        while (true) {
            const response = await fetch(
                `https://api.github.com/orgs/${org}/repos?per_page=100&page=${page}&sort=full_name`,
                { headers }
            );
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const data = await response.json();
            if (!data.length) break;
            all = all.concat(data);
            page++;
        }
        return all;
    } catch (error) {
        throw new Error(`Error fetching all repositories: ${error.message}`);
    }
};

const escapeCSVField = (value) => {
    const str = value == null ? "" : String(value);
    return `"${str.replace(/"/g, '""')}"`;
};

export const exportCSV = (repositories, org) => {
    const rows = [["Name", "URL", "Description", "Programming Language", "Updated At", "Created At", "Visibility", "Private", "Archived", "Dependabot.yml config", "Dependabot alerts enabled", "Alerts count"]];
    repositories.forEach(repository => rows.push([
        repository.name, repository.url, repository.description, repository.language, 
        repository.updated_at, repository.created_at, repository.visibility, repository.private ? "YES" : "NO", 
        repository.archived ? "YES" : "NO", repository.config ? "YES" : "NO", repository.alerts ? "YES" : "NO", 
        repository.alerts ? repository.alertsCount.total : "N/A"
    ]));
    const csv = rows.map(row => row.map(escapeCSVField).join(",")).join("\n");
    console.log('csv', csv);
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dependabot-${org}.csv`;
    a.click();
};