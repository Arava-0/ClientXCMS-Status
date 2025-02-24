const Core = require("../../Core");
const { ping } = require("./ping");

async function fetchClientXCMSStatusDatas(client, MAX_DELAY_PING = 25000)
{
    let datas = client.cache.clientXCMSConfig;

    if (Core.isNullOrUndefined(datas))
        return null;
    if (Core.isNullOrUndefined(datas.domains))
        return null;

    const domainPromises = datas.domains.map(async (domain) => {
        let domainDatas = await pingDomain(domain.url, MAX_DELAY_PING);
        domainDatas.name = domain.name;
        return domainDatas;
    });

    const domainsDatas = await Promise.all(domainPromises);
    return domainsDatas;
}

async function pingDomain(domainUrl, MAX_DELAY_PING, ACTIVE_DELAY = MAX_DELAY_PING) {
    let startTime = Date.now();

    try {
        const pingResult = await ping(domainUrl);

        if (pingResult === -2)
            throw new Error('PingFailedInvalidDomain');
        if (pingResult === -1)
            throw new Error('PingFailedRetry');

        return {
            domain: domainUrl,
            status: 'online',
            ping: pingResult
        };
    } catch (error) {
        if (error.message === 'PingFailedInvalidDomain') {
            return {
                domain: domainUrl,
                status: 'invalid',
                ping: -1
            }
        }

        if (error.message === 'PingFailedRetry'){
            const NEW_MAX_DELAY = ACTIVE_DELAY - (Date.now() - startTime);
            if (NEW_MAX_DELAY < 5000) return {
                domain: domainUrl,
                status: 'offline',
                ping: -1
            }

            const TEMP_DELAY = Math.min(NEW_MAX_DELAY - 3500, 3500);
            await Core.sleep(TEMP_DELAY);
            return await pingDomain(domainUrl, MAX_DELAY_PING, NEW_MAX_DELAY - TEMP_DELAY);
        }
    }
}

module.exports = {
    fetchClientXCMSStatusDatas
}
