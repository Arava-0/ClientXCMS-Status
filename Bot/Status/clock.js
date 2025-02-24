const cron = require('node-cron');
const Core = require('../../Core');
const { fetchClientXCMSStatusDatas } = require('./fetchClientXCMSStatus');
const { updateClientXCMSStatusMessage } = require('./updateClientXCMSStatus');

async function launchClientXStatusService(client)
{
    if (Core.isNullOrUndefined(client.cache.clientXCMSConfig))
        client.cache.clientXCMSConfig = await Core.getConfigFile("datas");

    let history = [];
    cron.schedule('0 * * * * *', async () => {
        let config = client.cache.clientXCMSConfig;
        // console.log(config);

        if (Core.isNullOrUndefined(config) || Core.isNullOrUndefined(config.channelId) || Core.isNullOrUndefined(config.messageId))
            return;

        let startingTimestamp = Date.now();
        let datas = await fetchClientXCMSStatusDatas(client);
        let delay = Date.now() - startingTimestamp;

        if (Core.isNullOrUndefined(datas))
            return;

        if (history.length >= 5)
            history.shift();
        history.push(datas);

        Object.keys(datas).forEach(key => {
            let data = datas[key];
            data.history = history.map(history => {
                let domain = history.find(h => h.name == data.name);
                return (domain ? (domain.ping == -1 ? '🔴' : (domain.ping > 5000 ? '🟡' : '🟢')) : '🟢')
            }).join('');
        })

        console.log(datas);

        await Core.sleep(Core.secondes(30) - delay);
        try {
            await updateClientXCMSStatusMessage(client, config.channelId, config.messageId, datas);
        } catch (error) {
            if (error.message == "ERR_CHANNEL_NOT_FOUND")
                await removeChannelFromConfig(client);
            if (error.message == "ERR_MESSAGE_NOT_FOUND")
                await removeMessageFromConfig(client);
        }
    })

    Core.showInfo("CLIENTXCMS Status", "Service de statut démarré !");
}

async function removeChannelFromConfig(client) {
    let config = client.cache.clientXCMSConfig;

    if (Core.isNullOrUndefined(config))
        return;

    config.channelId = null;
    config.messageId = null;

    client.cache.clientXCMSConfig = config;
    await Core.updateConfig("datas", config);
}

async function removeMessageFromConfig(client) {
    let config = client.cache.clientXCMSConfig;

    if (Core.isNullOrUndefined(config))
        return;

    config.messageId = null;

    client.cache.clientXCMSConfig = config;
    await Core.updateConfig("datas", config);
}

module.exports = {
    launchClientXStatusService
}
