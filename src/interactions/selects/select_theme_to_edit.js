import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { prisma } from '../../utils/database.js';

export default {
    key: 'select_theme_to_edit',
    async execute(interaction) {
        const themeId = parseInt(interaction.values[0]);
        const theme = await prisma.garrisonTheme.findUnique({
            where: { id: themeId }
        });

        if (!theme) {
            return interaction.reply({ content: '❌ Tema não encontrado.', ephemeral: true });
        }

        const modal = new ModalBuilder()
            .setCustomId(`update_garrison_theme:${theme.id}`) // Passa o ID do tema para o handler do modal
            .setTitle(`Editando Tema: ${theme.name}`);

        const nameInput = new TextInputBuilder().setCustomId('theme_name').setLabel("Nome do Tema").setStyle(TextInputStyle.Short).setValue(theme.name).setRequired(true);
        const nicknameInput = new TextInputBuilder().setCustomId('theme_nickname').setLabel("Apelido do Bot").setStyle(TextInputStyle.Short).setValue(theme.bot_nickname || '').setRequired(true);
        const colorInput = new TextInputBuilder().setCustomId('theme_color').setLabel("Cor das Embeds (Hex: #000000)").setStyle(TextInputStyle.Short).setValue(theme.embed_color || '').setRequired(false);
        const bannerInput = new TextInputBuilder().setCustomId('theme_banner').setLabel("URL do Banner Principal").setStyle(TextInputStyle.Short).setValue(theme.main_panel_banner_url || '').setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(nicknameInput),
            new ActionRowBuilder().addComponents(colorInput),
            new ActionRowBuilder().addComponents(bannerInput)
        );

        await interaction.showModal(modal);
    }
};