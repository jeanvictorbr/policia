import { prisma } from '../../utils/database.js';
import { createThemeManagementDashboard } from '../../utils/uiBuilder.js';

export default {
    key: 'update_garrison_theme',
    async execute(interaction) {
        await interaction.deferUpdate();
        const themeId = parseInt(interaction.customId.split(':')[1]);

        try {
            const name = interaction.fields.getTextInputValue('theme_name');
            const nickname = interaction.fields.getTextInputValue('theme_nickname');
            const color = interaction.fields.getTextInputValue('theme_color');
            const banner = interaction.fields.getTextInputValue('theme_banner');

            await prisma.garrisonTheme.update({
                where: { id: themeId },
                data: {
                    name: name,
                    bot_nickname: nickname,
                    embed_color: color || null,
                    main_panel_banner_url: banner || null,
                }
            });

            // Atualiza o dashboard para mostrar a mudança
            const updatedDashboard = await createThemeManagementDashboard(interaction.guild.id);
            await interaction.message.edit(updatedDashboard);

            await interaction.followUp({ content: `✅ Tema **${name}** atualizado com sucesso!`, ephemeral: true });

        } catch (error) {
            console.error("Erro ao atualizar tema:", error);
            await interaction.followUp({ content: '❌ Ocorreu um erro ao atualizar o tema.', ephemeral: true });
        }
    }
};