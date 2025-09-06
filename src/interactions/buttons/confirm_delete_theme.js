import { prisma } from '../../utils/database.js';
import { createThemeManagementDashboard } from '../../utils/uiBuilder.js';

export default {
    key: 'confirm_delete_theme',
    async execute(interaction, args) {
        await interaction.deferUpdate();
        const themeId = parseInt(args[0]);

        try {
            const deletedTheme = await prisma.garrisonTheme.delete({ where: { id: themeId } });
            
            // Aqui precisamos encontrar a mensagem original do dashboard para editá-la
            const mainDashboardMessage = await interaction.channel.messages.fetch(interaction.message.reference.messageId);
            const updatedDashboard = await createThemeManagementDashboard(interaction.guild.id);
            await mainDashboardMessage.edit(updatedDashboard);

            // Deleta a mensagem de confirmação
            await interaction.deleteReply();
            
        } catch (error) {
            console.error('Erro ao deletar tema:', error);
            await interaction.followUp({ content: '❌ Ocorreu um erro ao deletar o tema.', ephemeral: true });
        }
    }
};