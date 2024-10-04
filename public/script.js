document.getElementById('wafForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = document.getElementById('url').value;
    
    try {
        const response = await fetch(`http://localhost:3000/detect-waf?url=${encodeURIComponent(url)}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        document.getElementById('result').innerText = JSON.stringify(result, null, 2);
        
    } catch (error) {
        console.error(error);
        document.getElementById('result').innerText = 'Error detecting WAF';
    }
});
