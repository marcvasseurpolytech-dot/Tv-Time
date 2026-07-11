// Stocke les séries suivies (et la progression) dans un Gist GitHub privé.
// Même logique de "state partagé via Gist" que bornes-polytech.
const GIST_FILENAME = "series-tracker.json";

async function readGist(token, gistId) {
  const r = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (!r.ok) throw new Error(`Lecture Gist échouée (${r.status})`);
  const gist = await r.json();
  const file = gist.files[GIST_FILENAME];
  if (!file) return { shows: [] };
  try {
    return JSON.parse(file.content);
  } catch {
    return { shows: [] };
  }
}

async function writeGist(token, gistId, data) {
  const r = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: "PATCH",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: { content: JSON.stringify(data, null, 2) },
      },
    }),
  });
  if (!r.ok) throw new Error(`Écriture Gist échouée (${r.status})`);
  return r.json();
}

export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const gistId = process.env.GIST_ID;

  if (!token || !gistId) {
    return res.status(500).json({ error: "GITHUB_TOKEN ou GIST_ID manquant dans les variables d'environnement Vercel." });
  }

  try {
    if (req.method === "GET") {
      const data = await readGist(token, gistId);
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || !Array.isArray(body.shows)) {
        return res.status(400).json({ error: "Corps invalide, attendu { shows: [...] }" });
      }
      await writeGist(token, gistId, body);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Méthode non supportée." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
