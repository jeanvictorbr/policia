import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default {
    key: 'create_garrison_theme',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('save_garrison_theme')
            .setTitle('Criar Novo Tema de Guarnição');

        const nameInput = new TextInputBuilder().setCustomId('theme_name').setLabel("Nome do Tema (Ex: BOPE - RJ)").setStyle(TextInputStyle.Short).setRequired(true);
        const nicknameInput = new TextInputBuilder().setCustomId('theme_nickname').setLabel("Apelido do Bot (Ex: BOPE | Gestão)").setStyle(TextInputStyle.Short).setRequired(true);
        const colorInput = new TextInputBuilder().setCustomId('theme_color').setLabel("Cor das Embeds (Hex: #000000)").setStyle(TextInputStyle.Short).setRequired(false);
        const bannerInput = new TextInputBuilder().setCustomId('theme_banner').setLabel("URL do Banner Principal").setStyle(TextInputStyle.Short).setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(nicknameInput),
            new ActionRowBuilder().addComponents(colorInput),
            new ActionRowBuilder().addComponents(bannerInput)
        );

        await interaction.showModal(modal);
    }
};