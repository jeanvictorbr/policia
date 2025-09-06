import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default {
    key: 'iniciar_alistamento',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('ficha_alistamento_modal')
            .setTitle('Formulário de Alistamento');

        const nomeInput = new TextInputBuilder()
            .setCustomId('form_nome_fivem')
            .setLabel('Seu Nome no FiveM')
            .setPlaceholder('Ex: John Carter')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const idInput = new TextInputBuilder()
            .setCustomId('form_id_fivem')
            .setLabel('Seu ID no Servidor FiveM')
            .setPlaceholder('Ex: 123')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nomeInput),
            new ActionRowBuilder().addComponents(idInput)
        );

        await interaction.showModal(modal);
    }
};