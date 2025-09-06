import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } from 'discord.js';
import { prisma } from '../utils/database.js';

export const data = new SlashCommandBuilder()
    .setName('solicitar_upamento')
    .setDescription('Inicia uma solicitação de promoção para análise do Alto Comando.');

export async function execute(interaction) {
    // 1. Verifica se o usuário é um oficial registrado no banco de dados
    const officer = await prisma.officer.findUnique({
        where: { discord_id_guild_id: { discord_id: interaction.user.id, guild_id: interaction.guild.id } }
    });

    if (!officer) {
        return interaction.reply({ content: '❌ Você não é um oficial registrado em nosso sistema e não pode solicitar promoções.', ephemeral: true });
    }

    // 2. Cria e exibe o formulário (Modal)
    const modal = new ModalBuilder()
        .setCustomId('promotion_request_modal')
        .setTitle('Solicitação de Promoção');

    const currentRankInput = new TextInputBuilder()
        .setCustomId('current_rank')
        .setLabel('Sua Patente Atual')
        .setStyle(TextInputStyle.Short)
        .setValue(officer.rank) // Preenche automaticamente com a patente do banco de dados
        .setRequired(true);

    const requestedRankInput = new TextInputBuilder()
        .setCustomId('requested_rank')
        .setLabel('Patente Almejada')
        .setPlaceholder('Ex: Oficial II, Sargento I, etc.')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const reasonInput = new TextInputBuilder()
        .setCustomId('reason')
        .setLabel('Justificativa')
        .setPlaceholder('Descreva seus méritos, ações notáveis e por que você merece esta promoção.')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(currentRankInput),
        new ActionRowBuilder().addComponents(requestedRankInput),
        new ActionRowBuilder().addComponents(reasonInput)
    );

    await interaction.showModal(modal);
}