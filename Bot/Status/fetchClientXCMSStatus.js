const Core = require("../../Core");

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
    const startTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), MAX_DELAY_PING);

    try {
        const response = await fetch(domainUrl, {
            method: 'GET',
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.status === 200) {
            return {
                domain: domainUrl,
                status: 'online',
                ping: Date.now() - startTime
            }
        }
    } catch (e) {
        if (e.name === 'AbortError') {
            const NEW_MAX_DELAY = ACTIVE_DELAY - (Date.now() - startTime);
            if (NEW_MAX_DELAY < 5000) return {
                domain: domainUrl,
                status: 'offline',
                ping: -1
            };

            return await pingDomain(domainUrl, MAX_DELAY_PING, NEW_MAX_DELAY);
        }
        return {
            domain: domainUrl,
            status: 'offline',
            ping: -1
        }
    }
}

module.exports = {
    fetchClientXCMSStatusDatas
}
