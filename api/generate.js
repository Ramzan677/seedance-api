// api/generate.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const response = await fetch('https://zecora0.serv00.net/ai/Seedance.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        // Return the full data to the frontend
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'API Connection Failed' });
    }
}
