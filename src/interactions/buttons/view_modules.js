import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    key: 'view_modules',
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x2B2D31)
            .setTitle('Seleção de Módulos')
            .setDescription('Escolha no menu abaixo qual módulo você deseja visualizar ou configurar.');

        const menu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select_module')
                    .setPlaceholder('Selecione um módulo...')
                    .addOptions(
                        { label: 'Configurações Gerais', value: 'module_general', emoji: '🛠️' },
                        { label: 'Alistamento', value: 'module_recruitment', emoji: '📝' },
                        // Adicionaremos mais módulos aqui no futuro
                    )
            );

        const backButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back_to_main_dashboard') // Precisaremos de um handler para este
                    .setLabel('Voltar')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⬅️')
            );

        await interaction.update({ embeds: [embed], components: [menu, backButton] });
    }
};