const { EmbedBuilder } = require("discord.js");
const Core = require("../../Core");

async function updateClientXCMSStatusMessage(client, channelID, messageID, datas)
{
    let channel = client.channels.cache.get(channelID);
    if (Core.isNullOrUndefined(channel)) throw new Error(`ERR_CHANNEL_NOT_FOUND`);

    let message = await channel.messages.fetch(messageID).catch(() => {
        throw new Error(`ERR_MESSAGE_NOT_FOUND`);
    });

    await message.edit({
        content: `${client.config.emote.loading} **Mise à jour en cours...**`,
        embeds: []
    })

    const embed = new EmbedBuilder()
        .setTitle(`**📊 STATUS CLIENTXCMS - LIVE MONITORING**`)
        .setDescription(`> Surveillance en temps réel des infrastructures critiques`)
        .setColor(`#2867fa`)
        .setFooter({
            text: `Dernière mise à jour · ClientXCMS Monitoring`,
            iconURL: client.user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp();

    Object.keys(datas).forEach(key => {
        let data = datas[key];
        let emote = client.config.emote.status_ok;
        if (data.status == 'invalid') emote = client.config.emote.unavailable;
        if (data.status == 'offline') emote = client.config.emote.status_down;
        if (data.ping == -1) emote = client.config.emote.status_down;
        if (data.ping > 5000) emote = client.config.emote.status_degraded;

        embed.addFields(
            {
                name: `${emote} **${data.name}** ${emote}`,
                value: `\`\`\`yaml\n` +
                `Ping: ${data.ping}ms\n` +
                `Historique: ${data.history}\n` +
                `\`\`\``,
                inline: false
            }
        )
    });

    embed.addFields({
        name: `${client.config.emote.logo} **LÉGENDE DES STATUTS** ${client.config.emote.logo}`,
        value: `\`\`\`diff\n` +
        `+ 🟢 En ligne\n` +
        `! 🟡 Dégradé\n` +
        `- 🔴 Hors ligne\n` +
        `\`\`\``,
        inline: false
    })

    await Core.sleep(Core.secondes(1));
    await message.edit({
        content: "",
        embeds: [embed]
    });
}

module.exports = {
    updateClientXCMSStatusMessage
}
