const { ChatInputCommandInteraction, SlashCommandBuilder, Client, InteractionContextType, PermissionFlagsBits } = require('discord.js');
const Core = require('../../../Core');

module.exports = {

    type: "command",
    userCooldown: null,
    serverCooldown: 3000,
    globalCooldown: null,
    noDeferred: false,
    ephemeral: true,
    isOnPrivateGuild: null,

    data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Permets de configurer le channel où sera mis à jour le status de ClientXCMS.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addChannelOption(
        option => option
        .setName('channel')
        .setDescription('Le channel où sera mis à jour le status de ClientXCMS.')
        .setRequired(false)
    ),

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let startingTimestamp = Date.now();
        await interaction.editReply(`Sauvegarde de la configuration... (0/2)`);
        await Core.sleep(500)

        let success = true;
        let channelId = interaction.options.getChannel('channel')?.value ?? interaction.channelId;
        let message = await client.channels.cache
            .get(channelId)
            .send("Initialisation...")
            .catch(() => {
                interaction.editReply(`Une erreur est survenue lors de l'envoi du message dans <#${channelId}>.`);
                success = false;
            });
        if (!success) return;
        await interaction.editReply(`Sauvegarde de la configuration... (1/2) - Message envoyé !`);

        let currentConfig = await Core.getConfigFile("datas");
        if (Core.isNullOrUndefined(currentConfig))
            currentConfig = {};

        currentConfig.channelId = channelId;
        currentConfig.messageId = message.id;

        client.cache.clientXCMSConfig = currentConfig;
        await Core.updateConfig("datas", currentConfig);

        await Core.sleep(3000 - (Date.now() - startingTimestamp));
        await interaction.editReply(`Sauvegarde de la configuration... (2/2) - Sauvegarde terminée.`);
    }
}
