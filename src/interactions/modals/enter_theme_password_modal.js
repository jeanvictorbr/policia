import bcrypt from 'bcrypt';
import { prisma } from '../../utils/database.js';
import { createThemeManagementDashboard } from '../../utils/uiBuilder.js'; // Importa nosso novo dashboard

export default {
    key: 'enter_theme_password_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true }); // Defer para dar tempo de carregar

        const submittedPassword = interaction.fields.getTextInputValue('password');
        const config = await prisma.guildConfig.findUnique({
            where: { guild_id: interaction.guild.id },
            select: { theme_config_password: true }
        });

        if (!config || !config.theme_config_password) {
            return interaction.editReply({ content: '⚠️ Nenhuma senha encontrada. Clique no cadeado para criar uma.' });
        }

        const isMatch = bcrypt.compareSync(submittedPassword, config.theme_config_password);

        if (isMatch) {
            // SUCESSO! Mostra o dashboard de gerenciamento de temas.
            const themeDashboard = await createThemeManagementDashboard(interaction.guild.id);
            await interaction.editReply(themeDashboard);
        } else {
            await interaction.editReply({ content: '❌ Senha incorreta.' });
        }
    }
};