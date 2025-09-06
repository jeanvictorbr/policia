import { prisma } from '../../utils/database.js';
import { createGeneralConfigDashboard, createRecruitmentDashboard, createPromotionsDashboard } from '../../utils/uiBuilder.js';

export default {
    key: 'save_config',
    async execute(interaction) {
        // ... (código anterior) ...
        const configType = interaction.customId.split(':')[1];
        const selectedValue = interaction.values[0];
        
        try {
            // MUDANÇA AQUI: de 'update' para 'upsert'
            await prisma.guildConfig.upsert({
                where: { guild_id: interaction.guild.id },
                update: { [configType]: selectedValue },
                create: {
                    guild_id: interaction.guild.id,
                    [configType]: selectedValue
                }
            });

            // ... (resto da lógica para recarregar o dashboard e enviar o followUp)
            // Para encontrar o dashboard correto para recarregar, precisamos de uma pequena lógica
            let updatedDashboard;
            if (['analysis_channel_id', 'recruiter_role_id', 'recruit_role_id'].includes(configType)) {
                updatedDashboard = await createRecruitmentDashboard(interaction.guild.id);
            } else if (['promotion_request_channel_id', 'promotions_channel_id', 'promotion_approval_role_id'].includes(configType)) {
                updatedDashboard = await createPromotionsDashboard(interaction.guild.id);
            } else {
                updatedDashboard = await createGeneralConfigDashboard(interaction.guild.id);
            }
            
            await interaction.message.interaction.message.edit(updatedDashboard);
            await interaction.followUp({ content: '✅ Configuração atualizada com sucesso!', ephemeral: true });
            await interaction.deleteReply();

        } catch (error) {
            console.error('Erro ao salvar configuração:', error);
            await interaction.followUp({ content: '❌ Ocorreu um erro ao salvar a configuração.', ephemeral: true });
        }
    }
};