import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } from 'discord.js';

export default {
    key: 'set_config',
    async execute(interaction, args) {
        const configType = args[0]; // ex: 'analysis_channel_id'

        // A MUDANÇA PRINCIPAL ESTÁ AQUI:
        // Criamos um ID dinâmico que inclui o tipo de config, o ID da mensagem do dashboard e o ID do canal
        const dynamicCustomId = `save_config:${configType}:${interaction.message.id}:${interaction.channel.id}`;

        let selectMenu;
        let placeholder;

        if (configType.includes('_channel_id')) {
            placeholder = 'Selecione o canal desejado...';
            selectMenu = new ChannelSelectMenuBuilder()
                .setCustomId(dynamicCustomId) // Usa o novo ID dinâmico
                .setPlaceholder(placeholder)
                .addChannelTypes(ChannelType.GuildText);
        } else if (configType.includes('_role_id')) {
            placeholder = 'Selecione o cargo desejado...';
            selectMenu = new RoleSelectMenuBuilder()
                .setCustomId(dynamicCustomId) // Usa o novo ID dinâmico
                .setPlaceholder(placeholder);
        } else {
            return interaction.reply({ content: 'Tipo de configuração desconhecido.', ephemeral: true });
        }

        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.reply({ content: `Por favor, use o menu abaixo para definir a configuração.`, components: [row], ephemeral: true });
    }
};