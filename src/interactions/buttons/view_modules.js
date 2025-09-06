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
                        { label: 'Configurações Gerais', value: 'module_general', emoji: '🛠️', description: 'Configure a aparência e opções globais do bot.' },
                        { label: 'Alistamento', value: 'module_recruitment', emoji: '📝', description: 'Configure canais, cargos e o fluxo de recrutamento.' },
                        { label: 'Fardamentos', value: 'module_uniforms', emoji: '👕', description: 'Crie e gerencie os kits de fardas da facção.' },
                        { label: 'Promoções (Upamento)', value: 'module_promotions', emoji: '⭐', description: 'Configure o sistema de solicitação de promoção.' }
                    )
            );

        const backButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back_to_main_dashboard')
                    .setLabel('Voltar')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⬅️')
            );

        await interaction.update({ embeds: [embed], components: [menu, backButton] });
    }
};