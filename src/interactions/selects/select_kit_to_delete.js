import { prisma } from '../../utils/database.js';
import { createUniformsDashboard } from '../../utils/uiBuilder.js';

export default {
    key: 'select_kit_to_delete',
    async execute(interaction) {
        await interaction.deferUpdate();

        const kitIdToDelete = parseInt(interaction.values[0]);

        try {
            const deletedKit = await prisma.uniformKit.delete({
                where: { id: kitIdToDelete }
            });

            const originalDashboardMessage = await interaction.channel.messages.fetch(interaction.message.reference.messageId);
            const updatedDashboard = await createUniformsDashboard(interaction.guild.id);
            await originalDashboardMessage.edit(updatedDashboard);

            await interaction.followUp({ content: `✅ O kit de fardamento **${deletedKit.name}** foi deletado com sucesso!`, ephemeral: true });
            
            // Deleta a mensagem do menu de seleção
            await interaction.deleteReply();

        } catch (error) {
            console.error('Erro ao deletar kit:', error);
            await interaction.followUp({ content: '❌ Ocorreu um erro ao deletar o kit.', ephemeral: true });
        }
    }
};