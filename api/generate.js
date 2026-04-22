export default async function handler(req, res) {
    // Collect settings from either URL params or POST body
    const prompt = req.query.prompt || req.body?.prompt || "A cinematic sunset";
    const model = req.query.model || req.body?.model || "Seedance 1.5 Pro";
    const ratio = req.query.ratio || req.body?.ratio || "16:9";
    const duration = req.query.duration || req.body?.duration || 8;
    const resolution = req.query.resolution || req.body?.resolution || "720p";

    try {
        const apiResponse = await fetch('https://zecora0.serv00.net/ai/Seedance.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                model: model,
                duration: parseInt(duration),
                resolution: resolution,
                aspect_ratio: ratio
            })
        });

        const data = await apiResponse.json();

        res.status(200).json({
            success: true,
            developed_by: "Ramzan Ahsan",
            result: data
        });
    } catch (error) {
        res.status(500).json({ 
            error: "API Connection Failed", 
            developer: "Ramzan Ahsan" 
        });
    }
}
