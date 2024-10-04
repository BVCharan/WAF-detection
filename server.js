const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(express.static('public'));
// Middleware
app.use(cors());
app.use(express.json());

// Endpoint to detect WAF using WAFW00f
app.get('/detect-waf', async (req, res) => {
    const { url } = req.query;

    // Check if the URL is provided
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        // Execute WAFW00f command to detect WAF type
        exec(`wafw00f ${url}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing WAFW00f: ${error.message}`);
                return res.status(500).json({ error: 'Error executing WAFW00f' });
            }

            // Get the command output
            const output = stdout || stderr;

            // Log the full output for debugging
            console.log('WAFW00f output:', output);

            // Parse the output to get the detected WAF type (updated regex)
            const wafTypeMatch = output.match(/is behind a (.+)/i);
            const wafType = wafTypeMatch ? wafTypeMatch[1].trim() : 'No WAF detected or unknown type';

            res.json({
                message: 'WAF detected successfully',
                url: url,
                wafType: wafType, // Actual WAF type detected
                rawOutput: output // Full raw output (optional, for debugging)
            });
        });
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Error detecting WAF' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});