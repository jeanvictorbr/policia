import { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';

export default {
    key: 'select_garrison_theme',
    async execute(interaction) {
        // Por enquanto, usaremos temas pré-definidos. No futuro, eles virão do banco de dados.
        const presetThemes = [
            { label: 'Padrão PoliceFlow', value: 'theme_default', emoji: '🛡️' },
            { label: 'BOPE - Rio de Janeiro', value: 'theme_bope_rj', emoji: '💀' },
            { label: 'ROTA - São Paulo', value: 'theme_rota_sp', emoji: '⚡' },
            { label: 'PMERJ - Padrão', value: 'theme_pmerj', emoji: '🚓' },
            { label: 'PMSP - Padrão', value: 'theme_pmsp', emoji: '🚓' },
        ];

        const embed = new EmbedBuilder()
            .setTitle('🎨 Seleção de Guarnição (Tema)')
            .setDescription('Escolha um tema pré-definido para aplicar ao bot. Isso alterará o apelido do bot e, futuramente, cores e imagens de todos os painéis.');

        const menu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('apply_garrison_theme')
                    .setPlaceholder('Selecione um tema...')
                    .addOptions(presetThemes)
            );

        await interaction.reply({ embeds: [embed], components: [menu], ephemeral: true });
    }
};