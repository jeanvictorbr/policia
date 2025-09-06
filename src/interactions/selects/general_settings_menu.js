import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    key: 'general_settings_menu',
    async execute(interaction) {
        const selectedValue = interaction.values[0];

        if (selectedValue === 'set_channels') {
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('📺 Configuração de Canais')
                .setDescription('Qual tipo de canal você deseja configurar?');

            const menu = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('channel_type_select')
                        .setPlaceholder('Selecione o tipo de canal...')
                        .addOptions(
                            { label: 'Canal de Alistamento', value: 'recruitment_channel_id' },
                            { label: 'Canal de Análises de Fichas', value: 'analysis_channel_id' },
                            { label: 'Canal de Promoções', value: 'promotions_channel_id' },
                            { label: 'Canal de Relatórios de Ação', value: 'reports_channel_id' }
                        )
                );
            
            const backButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('config_gerais')
                        .setLabel('Voltar')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('⬅️')
                );

            await interaction.update({ embeds: [embed], components: [menu, backButton] });
        }
    }
};