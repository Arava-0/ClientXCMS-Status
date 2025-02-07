const cron = require('node-cron');
const { ActivityType } = require("discord.js");
const { getRandomInt } = require('../Utils/math');
const { showInfo } = require('../Utils/customInformations');

async function updatePresence(client, message)
{
    await client.user.setPresence({
        activities: [
            {
                name: `${message}`,
                type: ActivityType.Custom
            }
        ],
        status: 'dnd',
        afk: false
    });
}

async function launchPresenceService(client)
{
    const messages = client.config.presence;

    await updatePresence(client, messages.length > 0 ? messages[0] : "Aucun message de présence configuré.");

    cron.schedule('0 */5 * * * *', async () => {
        let rdmNumber = getRandomInt(0, messages.length - 1);
        await updatePresence(client, messages[rdmNumber]);
    })

    showInfo("PRESENCE", "Service de présence démarré !");
}

module.exports = {
    launchPresenceService
}
