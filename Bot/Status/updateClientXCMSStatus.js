const { EmbedBuilder } = require("discord.js");
const Core = require("../../Core");

async function updateClientXCMSStatusMessage(client, channelID, messageID, datas)
{
    let channel = client.channels.cache.get(channelID);
    if (Core.isNullOrUndefined(channel)) throw new Error(`ERR_CHANNEL_NOT_FOUND`);

    let message = await channel.messages.fetch(messageID).catch(() => {
        throw new Error(`ERR_MESSAGE_NOT_FOUND`);
    });

    let description = "";

    Object.keys(datas).forEach(key => {
        let data = datas[key];
        description += `> - ${data.status == "online" ? "🟢" : "🔴"} **[${data.name}](${data.domain})** : ${data.ping}ms\n`;
    })

    const embed = new EmbedBuilder()
        .setTitle(`**STATUS ClientXCMS**`)
        .setDescription(description)
        .setColor("#2867fa")
        .setFooter({
            text: `Mis à jour à ${new Date().toLocaleTimeString()}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true })
        })

    await message.edit({
        content: "",
        embeds: [embed]
    });
}

module.exports = {
    updateClientXCMSStatusMessage
}
