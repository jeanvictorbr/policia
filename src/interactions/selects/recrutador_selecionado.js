import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default {
    key: 'recrutador_selecionado',
    async execute(interaction) {
        const recruiterId = interaction.values[0]; // ID do recrutador selecionado

        const modal = new ModalBuilder()
            // Passamos o ID do recrutador no customId do modal para a próxima etapa
            .setCustomId(`ficha_alistamento_modal:${recruiterId}`)
            .setTitle('Formulário de Alistamento');

        const nomeInput = new TextInputBuilder()
            .setCustomId('form_nome_fivem')
            .setLabel('Seu Nome no FiveM')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const idInput = new TextInputBuilder()
            .setCustomId('form_id_fivem')
            .setLabel('Seu ID no Servidor FiveM')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nomeInput),
            new ActionRowBuilder().addComponents(idInput)
        );

        await interaction.showModal(modal);
    }
};