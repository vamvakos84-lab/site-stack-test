// Asks PubMed for the newest papers that match a search and writes them to
// src/data/publications.json. Run by the deploy workflow before every build.
// For a real center the search would be a list of authors plus the institution,
// for example: (Lastname AB[Author] OR ...) AND Institution[Affiliation]
import { writeFile } from 'node:fs/promises';

const QUERY = process.env.PUBMED_QUERY || 'neurogenomics[Title]';
const MAX = Number(process.env.PUBMED_MAX || 8);
const API = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const common = 'db=pubmed&retmode=json&tool=site-stack-test';

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'site-stack-test' } });
  if (!res.ok) throw new Error(`PubMed answered ${res.status}`);
  return res.json();
}

const search = await get(`${API}/esearch.fcgi?${common}&sort=pub_date&retmax=${MAX}&term=${encodeURIComponent(QUERY)}`);
const ids = search.esearchresult?.idlist ?? [];
let items = [];
if (ids.length) {
  const summary = await get(`${API}/esummary.fcgi?${common}&id=${ids.join(',')}`);
  items = ids.map((id) => {
    const r = summary.result[id];
    const authors = (r.authors ?? []).map((a) => a.name);
    return {
      pmid: id,
      title: r.title,
      authors: authors.length > 4 ? `${authors.slice(0, 3).join(', ')} and ${authors.length - 3} others` : authors.join(', '),
      journal: r.fulljournalname || r.source,
      date: r.pubdate,
    };
  });
}
const out = { query: QUERY, fetched: new Date().toISOString().slice(0, 10), total: Number(search.esearchresult?.count ?? 0), items };
await writeFile(new URL('../src/data/publications.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.log(`PubMed: ${items.length} of ${out.total} results written for "${QUERY}"`);
