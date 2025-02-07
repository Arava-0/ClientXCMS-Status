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
    .setName("info")
    .setDescription("Permets de configurer les domaines de ClientXCMS.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addSubcommand(subcommand =>
        subcommand
        .setName('add')
        .setDescription('Ajoute un domaine à la liste des domaines de ClientXCMS.')
        .addStringOption(
            option => option
            .setName('name')
            .setDescription('Le nom du domaine.')
            .setRequired(true)
        )
        .addStringOption(
            option => option
            .setName('url')
            .setDescription('L\'url du domaine.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('remove')
        .setDescription('Supprime un domaine de la liste des domaines de ClientXCMS.')
        .addStringOption(
            option => option
            .setName('name')
            .setDescription('Le nom du domaine.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('list')
        .setDescription('Affiche la liste des domaines de ClientXCMS.')
    ),

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let command = interaction.options.getSubcommand();

        if (command == "add") {
            let name = interaction.options.getString('name');
            let url = interaction.options.getString('url');

            let currentConfig = await Core.getConfigFile("datas");
            if (Core.isNullOrUndefined(currentConfig))
                currentConfig = {};

            if (Core.isNullOrUndefined(currentConfig.domains))
                currentConfig.domains = [];

            currentConfig.domains.push({ name: name, url: url });
            client.cache.clientXCMSConfig = currentConfig;
            await Core.updateConfig("datas", currentConfig);

            await interaction.editReply(`Le domaine [${name}](${url}) a bien été ajouté à la liste des domaines de ClientXCMS.`);
        }

        if (command == "remove") {
            let name = interaction.options.getString('name');

            let currentConfig = await Core.getConfigFile("datas");
            if (Core.isNullOrUndefined(currentConfig))
                currentConfig = {};

            if (Core.isNullOrUndefined(currentConfig.domains))
                currentConfig.domains = [];

            let domain = currentConfig.domains.find(d => d.name == name);
            if (Core.isNullOrUndefined(domain))
                return await interaction.reply(`Le domaine \`${name}\` n'existe pas dans la liste des domaines de ClientXCMS.`);

            currentConfig.domains = currentConfig.domains.filter(d => d.name != name);
            client.cache.clientXCMSConfig = currentConfig;
            await Core.updateConfig("datas", currentConfig);

            await interaction.editReply(`Le domaine \`${name}\` a bien été supprimé de la liste des domaines de ClientXCMS.`);
        }

        if (command == "list") {
            let currentConfig = await Core.getConfigFile("datas");
            if (Core.isNullOrUndefined(currentConfig))
                currentConfig = {};

            if (Core.isNullOrUndefined(currentConfig.domains))
                currentConfig.domains = [];

            let message = `Liste des domaines de ClientXCMS :\n`;
            currentConfig.domains.forEach(domain => {
                message += `> - [${domain.name}](${domain.url})\n`;
            });

            await interaction.editReply(message);
        }
    }
}
