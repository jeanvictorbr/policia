import { prisma } from '../../utils/database.js';
import { createGeneralConfigDashboard } from '../../utils/uiBuilder.js';

export default {
    key: 'save_config',
    async execute(interaction) {
        await interaction.deferUpdate(); // Confirma o recebimento da interação

        const configType = interaction.customId.split(':')[1];
        const selectedValue = interaction.values[0];

        try {
            await prisma.guildConfig.update({
                where: { guild_id: interaction.guild.id },
                data: { [configType]: selectedValue }
            });

            // 1. Recria e atualiza o dashboard principal para refletir a mudança
            const updatedDashboard = await createGeneralConfigDashboard(interaction.guild.id);
            // .message.interaction.message é uma forma de pegar a mensagem original do painel
            await interaction.message.interaction.message.edit(updatedDashboard);

            // 2. Envia a confirmação ephemereal SEM fechar o painel
            await interaction.followUp({ content: '✅ Configuração atualizada com sucesso!', ephemeral: true });
            
            // 3. Deleta a mensagem com o menu de seleção
            await interaction.deleteReply();

        } catch (error) {
            console.error('Erro ao salvar configuração:', error);
            await interaction.followUp({ content: '❌ Ocorreu um erro ao salvar a configuração.', ephemeral: true });
        }
    }
};