import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } from 'discord.js';

export default {
    key: 'set_config',
    async execute(interaction, args) {
        const configType = args[0]; // ex: 'analysis_channel_id' ou 'recruiter_role_id'

        let selectMenu;
        let placeholder;

        if (configType.includes('_channel_id')) {
            placeholder = 'Selecione o canal desejado...';
            selectMenu = new ChannelSelectMenuBuilder()
                .setCustomId(`save_config:${configType}`)
                .setPlaceholder(placeholder)
                .addChannelTypes(ChannelType.GuildText);
        } else if (configType.includes('_role_id')) {
            placeholder = 'Selecione o cargo desejado...';
            selectMenu = new RoleSelectMenuBuilder()
                .setCustomId(`save_config:${configType}`)
                .setPlaceholder(placeholder);
        } else {
            return interaction.reply({ content: 'Tipo de configuração desconhecido.', ephemeral: true });
        }

        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.reply({ content: `Por favor, use o menu abaixo para definir a configuração de **${configType}**.`, components: [row], ephemeral: true });
    }
};