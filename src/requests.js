export const getHeaders = (token) => {
    return {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    };
};

export const checkDependabot = async (org, repoName, token) => {
    const headers = getHeaders(token);
    try {
        const response= await fetch(
        `https://api.github.com/repos/${org}/${repoName}/contents/.github/dependabot.yml`,
        { headers }
    );
    if (response.status === 200) return { config: true, alerts: null };
    if (response.status === 404) {
        const newResponse = await fetch(
            `https://api.github.com/repos/${org}/${repoName}/contents/.github/dependabot.yaml`,
            { headers }
        );
        if (newResponse.status === 200) return { config: true, alerts: null };
    }
    const alertsResponse = await fetch(
        `https://api.github.com/repos/${org}/${repoName}/vulnerability-alerts`,
        { headers: { ...headers, Accept: "application/vnd.github+json" } }
        );
        return { config: false, alerts: alertsResponse.status === 204 };
    } catch (error) {
        throw new Error(`Error checking Dependabot configuration: ${error.message}`);
    }
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
    const rows = [["Name", "URL", "Description", "Programming Language", "Updated At", "Created At", "Visibility", "Is Private?", "Is Archived?", "Has dependabot.yml config?", "Has vulnerability alerts enabled?"]];
    repositories.forEach(repository => rows.push([
        repository.name, repository.url, repository.description, repository.language, repository.updated_at, repository.created_at, repository.visibility, repository.private ? "YES" : "NO", repository.archived ? "YES" : "NO", repository.config ? "YES" : "NO", repository.alerts ? "YES" : "NO"
    ]));
    const csv = rows.map(row => row.map(escapeCSVField).join(",")).join("\n");
    console.log('csv', csv);
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dependabot-${org}.csv`;
    a.click();
};