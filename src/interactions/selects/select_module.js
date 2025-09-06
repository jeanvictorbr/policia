import { createGeneralConfigDashboard, createRecruitmentDashboard, createUniformsDashboard } from '../../utils/uiBuilder.js';

export default {
    key: 'select_module',
    async execute(interaction) {
        await interaction.deferUpdate();
        const selectedModule = interaction.values[0];

        let dashboard;
        switch (selectedModule) {
            case 'module_general':
                dashboard = await createGeneralConfigDashboard(interaction.guild.id);
                break;
            case 'module_recruitment':
                dashboard = await createRecruitmentDashboard(interaction.guild.id);
                break;
            case 'module_uniforms': // << NOVO CASE
                dashboard = await createUniformsDashboard(interaction.guild.id);
                break;
            case 'module_promotions':
                dashboard = { content: `O dashboard para o módulo **Promoções** será construído em breve!`, embeds: [], components: [] };
                break;
            default:
                dashboard = { content: 'Módulo não encontrado.', ephemeral: true };
        }
        
        await interaction.editReply(dashboard);
    }
};