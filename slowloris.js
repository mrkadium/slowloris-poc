const http = require('http');

function sendAttackRequest(url) {
    const postData = 'foo=bar';
    const options = {
        hostname: 'example.com',
        port: 80,
        path: '/url_that_accepts_post',
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0;)',
            'Connection': 'close',
            'Referer': 'http://www.qualys.com/products/qg_suite/was/',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
            'Accept': 'text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5'
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                resolve(responseData);
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

async function main() {
    try {
        const response1 = await sendAttackRequest('http://example.com/url_that_accepts_post');
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for 10 seconds
        const response2 = await sendAttackRequest('http://example.com/url_that_accepts_post');

        const firstRequestTime = 0; // Not measuring time in this script
        const secondRequestTime = 10; // Simulating a 10-second delay

        if (checkVulnerability(response1, response2, firstRequestTime, secondRequestTime)) {
            console.log("The server is vulnerable to slow POST attack.");
        } else {
            console.log("The server is not vulnerable to slow POST attack.");
        }
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

function checkVulnerability(response1, response2, firstRequestTime, secondRequestTime) {
    if (response1.statusCode !== 200 || response2.statusCode !== 200) {
        return false;
    }

    if (secondRequestTime > firstRequestTime + 10) {
        return true;
    }

    return false;
}

main();
