import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { prisma } from '../../utils/database.js';

export default {
    key: 'select_theme_to_delete',
    async execute(interaction) {
        const themeId = parseInt(interaction.values[0]);
        const theme = await prisma.garrisonTheme.findUnique({ where: { id: themeId } });

        if (!theme) {
            return interaction.update({ content: '❌ Tema não encontrado.', components: [] });
        }

        const confirmationRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`confirm_delete_theme:${theme.id}`).setLabel('Sim, Deletar').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('cancel_delete').setLabel('Cancelar').setStyle(ButtonStyle.Secondary)
        );

        await interaction.update({ content: `Você tem certeza que deseja deletar permanentemente o tema **${theme.name}**? Esta ação não pode ser desfeita.`, components: [confirmationRow] });
    }
};