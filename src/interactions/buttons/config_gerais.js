import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    key: 'config_gerais',
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const settingsEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('⚙️ Configurações Gerais')
            .setDescription('Selecione uma categoria abaixo para configurar. As alterações são salvas automaticamente.')
            .setFooter({ text: 'PoliceFlow • Painel de Configurações' });

        const settingsMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('general_settings_menu')
                    .setPlaceholder('Selecione a categoria para configurar...')
                    .addOptions(
                        { label: 'Vincular Cargos', description: 'Vincule os cargos do Discord com a hierarquia do bot.', value: 'link_roles', emoji: '🔗' },
                        { label: 'Definir Canais', description: 'Defina os canais essenciais para o funcionamento do bot.', value: 'set_channels', emoji: '📺' },
                        { label: 'Logotipo/Banner', description: 'Defina uma imagem de banner para as embeds.', value: 'set_logo', emoji: '🖼️' }
                    )
            );

        const backButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('main_menu')
                    .setLabel('Voltar ao Menu Principal')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('⬅️')
            );
        
        await interaction.update({
            embeds: [settingsEmbed],
            components: [settingsMenu, backButton]
        });
    }
};