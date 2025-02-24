const { exec } = require("child_process");

async function ping(domain) {
    return new Promise((resolve, reject) => {
        exec(`ping -c 1 ${domain} | awk -F'/' 'END {print $5}'`, (error, stdout, stderr) => {
            if (error) {
                reject(`Erreur: ${stderr || error.message}`);
                return;
            }
            resolve(parseFloat(stdout.trim()) + " ms");
        });
    });
}

module.exports = {
    ping
}
