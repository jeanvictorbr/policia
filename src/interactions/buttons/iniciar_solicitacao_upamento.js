// O código deste arquivo é essencialmente o mesmo da função "execute" do antigo comando
// src/commands/solicitar_upamento.js. Ele verifica se o usuário é um oficial
// e, se for, abre o modal de solicitação.

import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { prisma } from '../../utils/database.js';

export default {
    key: 'iniciar_solicitacao_upamento',
    async execute(interaction) {
        const officer = await prisma.officer.findUnique({
            where: { discord_id_guild_id: { discord_id: interaction.user.id, guild_id: interaction.guild.id } }
        });

        if (!officer) {
            return interaction.reply({ content: '❌ Você não é um oficial registrado e não pode solicitar promoções.', ephemeral: true });
        }

        const modal = new ModalBuilder().setCustomId('promotion_request_modal').setTitle('Solicitação de Promoção');
        const currentRankInput = new TextInputBuilder().setCustomId('current_rank').setLabel('Sua Patente Atual').setStyle(TextInputStyle.Short).setValue(officer.rank).setRequired(true);
        const requestedRankInput = new TextInputBuilder().setCustomId('requested_rank').setLabel('Patente Almejada').setPlaceholder('Ex: Oficial II, Sargento I, etc.').setStyle(TextInputStyle.Short).setRequired(true);
        const reasonInput = new TextInputBuilder().setCustomId('reason').setLabel('Justificativa').setPlaceholder('Descreva seus méritos e por que você merece esta promoção.').setStyle(TextInputStyle.Paragraph).setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(currentRankInput),
            new ActionRowBuilder().addComponents(requestedRankInput),
            new ActionRowBuilder().addComponents(reasonInput)
        );

        await interaction.showModal(modal);
    }
};