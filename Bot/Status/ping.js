const { exec } = require("child_process");

function extractDomain(url) {
    try {
        let hostname = new URL(url).hostname;
        return (hostname);
    } catch (error) {
        return (null);
    }
}

async function ping(domain) {
    let domainName = extractDomain(domain);

    if (domainName === null)
        return -2;

    return new Promise((resolve, reject) => {
        exec(`ping -c 1 ${domainName} | awk -F'/' 'END {print $5}'`, (error, stdout, stderr) => {
            if (error)
                return resolve(-1)

            const stdoutValue = stdout.trim()
            const result = parseFloat(stdoutValue);
            if (isNaN(result))
                return resolve(-1);
            resolve(result);
        });
    });
}

module.exports = {
    ping
}
