// Este handler reutiliza a lógica do primeiro passo para recriar a tela anterior.
// Note que importamos a função de outro arquivo para não repetir código.
import { createRoleTypeSelection } from '../selects/general_settings_menu.js';

export default {
    key: 'back_to_role_type_select',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        const roleTypeSelection = createRoleTypeSelection();
        await interaction.update(roleTypeSelection);
    }
};