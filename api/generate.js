export default async function handler(req, res) {
    // 1. Get data from either Browser URL (?prompt=...) or a POST request
    const prompt = req.query.prompt || req.body?.prompt || "A cinematic sunset";
    const model = req.query.model || req.body?.model || "Seedance 1.5 Pro";
    const ratio = req.query.ratio || req.body?.ratio || "16:9";
    const duration = req.query.duration || req.body?.duration || 8;

    try {
        const apiResponse = await fetch('https://zecora0.serv00.net/ai/Seedance.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                model: model,
                duration: parseInt(duration),
                resolution: "720p",
                aspect_ratio: ratio
            })
        });

        const data = await apiResponse.json();

        // 2. Send the response back to your browser screen
        res.status(200).json({
            success: true,
            developed_by: "Ramzan Ahsan",
            result: data
        });
    } catch (error) {
        res.status(500).json({ 
            error: "API Connection Failed", 
            details: error.message,
            developer: "Ramzan Ahsan"
        });
    }
}
