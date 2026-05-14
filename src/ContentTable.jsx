import VisibilityBadge from "./VisibilityBadge";
import Badge from "./Badge";
import { ArchiveBadge } from "./ArchiveBadge";

const HEADERS = ["Repository", "Description", "Visibility", "Private", "Dependabot.yml config?", "Dependabot alerts enabled?", "Programming language"];

export default function ContentTable({ items }) {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0">
                    <tr className="bg-slate-100 dark:bg-slate-800">
                        {HEADERS.map(header => (
                            <th key={header} className="px-3.5 py-2.5 text-left text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 whitespace-nowrap text-xs">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>   
                <tbody>
                    {items.map(item => (
                        <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                            <td className="px-3.5 py-3 align-middle">
                                <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 no-underline font-medium hover:underline">
                                    {item.name}
                                </a>
                                {item.archived && (
                                    <ArchiveBadge />
                                )}
                            </td>
                            <td className="px-3.5 py-3 align-middle text-slate-600 dark:text-slate-300">{item.description}</td>
                            <td className="px-3.5 py-3 align-middle text-slate-600 dark:text-slate-300"><VisibilityBadge visibility={item.visibility} /></td>
                            <td className="px-3.5 py-3 align-middle text-slate-600 dark:text-slate-300"><Badge value={item.private} /></td>
                            <td className="px-3.5 py-3 align-middle"><Badge value={item.config} /></td>
                            <td className="px-3.5 py-3 align-middle"><Badge value={item.alerts} /></td>
                            <td className="px-3.5 py-3 align-middle text-slate-600 dark:text-slate-300">{item.language}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}