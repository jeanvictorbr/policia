import { prisma } from '../../utils/database.js';
import { createGeneralConfigDashboard, createRecruitmentDashboard, createPromotionsDashboard } from '../../utils/uiBuilder.js';

export default {
    key: 'save_config',
    async execute(interaction) {
        // Agora respondemos à interação IMEDIATAMENTE para evitar o erro 'InteractionNotReplied'
        await interaction.deferUpdate();

        // A MUDANÇA PRINCIPAL ESTÁ AQUI:
        // Lemos todas as informações que passamos pelo customId
        const [key, configType, messageId, channelId] = interaction.customId.split(':');
        const selectedValue = interaction.values[0];

        try {
            await prisma.guildConfig.upsert({
                where: { guild_id: interaction.guild.id },
                update: { [configType]: selectedValue },
                create: {
                    guild_id: interaction.guild.id,
                    [configType]: selectedValue
                }
            });

            // Buscamos o canal e a mensagem original do dashboard de forma 100% confiável
            const channel = await interaction.guild.channels.fetch(channelId);
            const originalDashboardMessage = await channel.messages.fetch(messageId);

            // Determina qual dashboard precisa ser recarregado
            let updatedDashboard;
            if (['analysis_channel_id', 'recruiter_role_id', 'recruit_role_id'].includes(configType)) {
                updatedDashboard = await createRecruitmentDashboard(interaction.guild.id);
            } else if (['promotion_request_channel_id', 'promotions_channel_id', 'promotion_approval_role_id'].includes(configType)) {
                updatedDashboard = await createPromotionsDashboard(interaction.guild.id);
            } else {
                updatedDashboard = await createGeneralConfigDashboard(interaction.guild.id);
            }
            
            // Edita a mensagem original com segurança
            await originalDashboardMessage.edit(updatedDashboard);

            // Envia a confirmação como um followup
            await interaction.followUp({ content: '✅ Configuração atualizada com sucesso!', ephemeral: true });
            
            // Deleta a mensagem temporária que continha o menu de seleção
            await interaction.deleteReply();

        } catch (error) {
            console.error('Erro ao salvar configuração:', error);
            await interaction.followUp({ content: '❌ Ocorreu um erro ao salvar a configuração.', ephemeral: true });
        }
    }
};