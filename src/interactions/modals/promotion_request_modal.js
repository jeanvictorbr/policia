import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { prisma } from '../../utils/database.js';

export default {
    key: 'promotion_request_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const config = await prisma.guildConfig.findUnique({ where: { guild_id: interaction.guild.id } });
        if (!config || !config.promotion_request_channel_id) {
            return interaction.editReply({ content: '❌ O canal para solicitações de promoção não foi configurado.' });
        }
        const requestChannel = await interaction.guild.channels.fetch(config.promotion_request_channel_id).catch(() => null);
        if (!requestChannel) {
            return interaction.editReply({ content: '❌ O canal configurado para solicitações de promoção não foi encontrado.' });
        }

        const currentRank = interaction.fields.getTextInputValue('current_rank');
        const requestedRank = interaction.fields.getTextInputValue('requested_rank');
        const reason = interaction.fields.getTextInputValue('reason');

        // 1. Salva a solicitação no banco de dados
        const officer = await prisma.officer.findUnique({ where: { discord_id_guild_id: { discord_id: interaction.user.id, guild_id: interaction.guild.id } } });
        
        const promotionRequest = await prisma.promotionRequest.create({
            data: {
                requester_db_id: officer.db_id,
                guild_id: interaction.guild.id,
                current_rank: currentRank,
                requested_rank: requestedRank,
                reason: reason,
            }
        });

        // 2. Monta a embed de análise para o Alto Comando
        const requestEmbed = new EmbedBuilder()
            .setColor(0xFFA500) // Laranja = Pendente
            .setTitle('⬆️ Nova Solicitação de Promoção')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`**Oficial:** <@${interaction.user.id}>`)
            .addFields(
                { name: 'Patente Atual', value: `\`${currentRank}\``, inline: true },
                { name: 'Patente Almejada', value: `\`${requestedRank}\``, inline: true },
                { name: 'Justificativa', value: `\`\`\`${reason}\`\`\`` },
                { name: 'Status', value: '`⏳ PENDENTE`' }
            )
            .setTimestamp()
            .setFooter({ text: `ID da Solicitação: ${promotionRequest.id}` });
            
        const actionButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId(`approve_promotion:${promotionRequest.id}`).setLabel('Aprovar').setStyle(ButtonStyle.Success).setEmoji('✅'),
                new ButtonBuilder().setCustomId(`deny_promotion:${promotionRequest.id}`).setLabel('Recusar').setStyle(ButtonStyle.Danger).setEmoji('❌')
            );
        
        // 3. Envia para o canal de análise
        await requestChannel.send({ embeds: [requestEmbed], components: [actionButtons] });

        await interaction.editReply({ content: '✅ Sua solicitação de promoção foi enviada para análise!' });
    }
};