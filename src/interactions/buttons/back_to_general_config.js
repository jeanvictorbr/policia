import { createGeneralConfigDashboard } from '../../utils/uiBuilder.js';

export default {
    key: 'back_to_general_config',
    async execute(interaction) {
        await interaction.deferUpdate();
        const dashboard = await createGeneralConfigDashboard(interaction.guild.id);
        await interaction.editReply(dashboard);
    }
};