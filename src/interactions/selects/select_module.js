import { createGeneralConfigDashboard } from '../../utils/uiBuilder.js';

export default {
    key: 'select_module',
    async execute(interaction) {
        const selectedModule = interaction.values[0];

        switch (selectedModule) {
            case 'module_general':
                const dashboard = await createGeneralConfigDashboard(interaction.guild.id);
                await interaction.update(dashboard);
                break;
            case 'module_recruitment':
                // Futuramente, chamará o dashboard de alistamento
                await interaction.update({ content: 'Dashboard de Alistamento em breve!', embeds: [], components: [] });
                break;
            default:
                await interaction.reply({ content: 'Módulo não encontrado.', ephemeral: true });
        }
    }
};