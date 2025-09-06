import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default {
    key: 'create_uniform_kit',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('save_uniform_kit')
            .setTitle('Criar Novo Kit de Fardamento');

        const nameInput = new TextInputBuilder()
            .setCustomId('kit_name')
            .setLabel('Nome do Kit')
            .setPlaceholder('Ex: Patrulha Padrão, Tático BOPE, etc.')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const codesInput = new TextInputBuilder()
            .setCustomId('kit_codes')
            .setLabel('Códigos/Nomes das Peças de Roupa')
            .setPlaceholder('Cole aqui todos os códigos ou nomes das peças que compõem este kit. Separe-os como preferir.')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(codesInput)
        );

        await interaction.showModal(modal);
    }
};