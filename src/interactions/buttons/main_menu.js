import { createMainMenu } from '../../utils/panel_utils.js';

export default {
    key: 'main_menu',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        const mainMenu = createMainMenu();
        await interaction.update(mainMenu);
    }
};