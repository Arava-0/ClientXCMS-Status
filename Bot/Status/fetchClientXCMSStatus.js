const Core = require("../../Core");
const axios = require('axios');

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
    try {
        const startTime = Date.now();
        await axios.get(domainUrl, { timeout: ACTIVE_DELAY });
        const endTime = Date.now();

        return {
            domain: domainUrl,
            status: 'online',
            ping: endTime - startTime
        };
    } catch (error) {
        const NEW_MAX_DELAY = ACTIVE_DELAY - (Date.now() - startTime);
        if (NEW_MAX_DELAY < 5000) return {
            domain: domainUrl,
            status: 'offline',
            ping: -1
        };

        return pingDomain(domainUrl, MAX_DELAY_PING, NEW_MAX_DELAY);
    }
}

module.exports = {
    fetchClientXCMSStatusDatas
}
