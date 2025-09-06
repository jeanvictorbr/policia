import { prisma } from '../../utils/database.js';

export default {
    key: 'select_kit_to_delete',
    async execute(interaction) {
        const kitIdToDelete = parseInt(interaction.values[0]);

        try {
            const deletedKit = await prisma.uniformKit.delete({
                where: { id: kitIdToDelete }
            });

            // MUDANÇA AQUI: Remove a tentativa de editar o dashboard e apenas responde
            await interaction.update({ content: `✅ O kit de fardamento **${deletedKit.name}** foi deletado! A lista será atualizada da próxima vez que você abrir o dashboard.`, components: [] });

        } catch (error) {
            console.error('Erro ao deletar kit:', error);
            await interaction.update({ content: '❌ Ocorreu um erro ao deletar o kit.', components: [] });
        }
    }
};