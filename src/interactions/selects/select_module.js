import { createGeneralConfigDashboard, createRecruitmentDashboard } from '../../utils/uiBuilder.js';

export default {
    key: 'select_module',
    async execute(interaction) {
        const selectedModule = interaction.values[0];

        // Defer a resposta para dar tempo ao bot de processar
        await interaction.deferUpdate();

        let dashboard;
        switch (selectedModule) {
            case 'module_general':
                dashboard = await createGeneralConfigDashboard(interaction.guild.id);
                break;
            case 'module_recruitment':
                dashboard = await createRecruitmentDashboard(interaction.guild.id);
                break;
            // Placeholders para os futuros módulos
            case 'module_uniforms':
            case 'module_promotions':
                dashboard = { content: `O dashboard para o módulo **${selectedModule.split('_')[1]}** será construído em breve!`, embeds: [], components: [] };
                break;
            default:
                dashboard = { content: 'Módulo não encontrado.', ephemeral: true };
        }
        
        await interaction.editReply(dashboard);
    }
};