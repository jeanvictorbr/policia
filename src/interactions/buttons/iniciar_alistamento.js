import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default {
    key: 'iniciar_alistamento',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('ficha_alistamento_modal')
            .setTitle('Formulário de Alistamento');

        // Crie as perguntas do seu formulário
        const nomeInput = new TextInputBuilder()
            .setCustomId('form_nome_idade')
            .setLabel('Qual seu nome e idade? (Ex: João, 25)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const idInput = new TextInputBuilder()
            .setCustomId('form_id_fivem')
            .setLabel('Qual seu ID no FiveM?')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const motivacaoInput = new TextInputBuilder()
            .setCustomId('form_motivacao')
            .setLabel('Por que deseja se juntar à nossa facção?')
            .setStyle(TextInputStyle.Paragraph) // Para respostas longas
            .setRequired(true);

        // Adiciona os campos ao modal em 'ActionRows'
        modal.addComponents(
            new ActionRowBuilder().addComponents(nomeInput),
            new ActionRowBuilder().addComponents(idInput),
            new ActionRowBuilder().addComponents(motivacaoInput)
        );

        await interaction.showModal(modal);
    }
};