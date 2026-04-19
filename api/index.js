const https = require('https');

export default async function handler(req, res) {
    // 1. Setup Headers for Browser/CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 2. Get Data from URL (GET) or Body (POST)
    const data = req.method === 'POST' ? req.body : req.query;

    // 3. Set Variables (Exact match to your documentation)
    const model = data.model || "Seedance 1.5 Pro";
    const prompt = data.prompt || "A dramatic sunrise over mountains, camera slowly rising";
    const aspect_ratio = data.ratio || data.aspect_ratio || "16:9";
    const resolution = data.res || data.resolution || "720p";
    
    // Duration Validation logic
    let duration = parseInt(data.duration);
    if (model === "Seedance 1.5 Pro") {
        if (![4, 8, 12].includes(duration)) duration = 8;
    } else {
        if (![5, 10].includes(duration)) duration = 5;
    }

    // 4. Build Exact JSON Payload
    const payload = JSON.stringify({
        "prompt": String(prompt),
        "model": String(model),
        "duration": Number(duration),
        "resolution": String(resolution),
        "aspect_ratio": String(aspect_ratio),
        ...(data.image || data.image_url ? { "image_url": String(data.image || data.image_url) } : {})
    });

    // 5. Send Request using Native HTTPS (More stable on Vercel)
    const options = {
        hostname: 'zecora0.serv00.net',
        path: '/ai/Seedance.php',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 50000 // 50 seconds
    };

    const request = https.request(options, (response) => {
        let responseData = '';
        response.on('data', (chunk) => { responseData += chunk; });
        response.on('end', () => {
            try {
                const result = JSON.parse(responseData);
                
                // Add your credit
                result.developer = "Developed by Ramzan Ahsan";

                // Direct Redirect Feature
                if (data.direct && result.success && result.data && result.data.video_url) {
                    res.writeHead(302, { Location: result.data.video_url });
                    return res.end();
                }

                res.status(200).json(result);
            } catch (e) {
                res.status(500).json({ 
                    success: false, 
                    error: "Seedance Server returned non-JSON response",
                    raw: responseData,
                    developer: "Developed by Ramzan Ahsan"
                });
            }
        });
    });

    request.on('error', (error) => {
        res.status(500).json({ success: false, error: error.message });
    });

    request.write(payload);
    request.end();
}
