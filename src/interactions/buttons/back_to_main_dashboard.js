import { createMainDashboard } from '../../utils/uiBuilder.js';

export default {
    key: 'back_to_main_dashboard',
    async execute(interaction) {
        // Apenas chama a mesma função do comando principal para recriar o dashboard
        const dashboard = createMainDashboard();
        await interaction.update(dashboard);
    }
};