// Proxy TMDB — garde la clé API côté serveur, jamais exposée au client.
const TMDB_BASE = "https://api.themoviedb.org/3";

export default async function handler(req, res) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "TMDB_API_KEY manquante dans les variables d'environnement Vercel." });
  }

  const { action, query, id, season } = req.query;

  try {
    let url;

    if (action === "search") {
      if (!query) return res.status(400).json({ error: "Paramètre 'query' manquant." });
      url = `${TMDB_BASE}/search/tv?api_key=${apiKey}&language=fr-FR&query=${encodeURIComponent(query)}`;
    } else if (action === "details") {
      if (!id) return res.status(400).json({ error: "Paramètre 'id' manquant." });
      url = `${TMDB_BASE}/tv/${id}?api_key=${apiKey}&language=fr-FR`;
    } else if (action === "season") {
      if (!id || !season) return res.status(400).json({ error: "Paramètres 'id' et 'season' requis." });
      url = `${TMDB_BASE}/tv/${id}/season/${season}?api_key=${apiKey}&language=fr-FR`;
    } else {
      return res.status(400).json({ error: "Action inconnue. Utilise search, details ou season." });
    }

    const tmdbRes = await fetch(url);
    const data = await tmdbRes.json();

    if (!tmdbRes.ok) {
      return res.status(tmdbRes.status).json({ error: data.status_message || "Erreur TMDB" });
    }

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
