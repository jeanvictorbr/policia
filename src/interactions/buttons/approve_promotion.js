import { EmbedBuilder } from 'discord.js';
import { prisma } from '../../utils/database.js';

export default {
    key: 'approve_promotion',
    async execute(interaction, args) {
        const requestId = parseInt(args[0]);
        await interaction.deferUpdate();

        // 1. Atualiza o status da solicitação no banco
        const promotionRequest = await prisma.promotionRequest.update({
            where: { id: requestId },
            data: {
                status: 'APPROVED',
                reviewer_id: interaction.user.id,
                reviewed_at: new Date(),
            },
            include: { requester: true } // Inclui os dados do oficial que pediu
        });

        // 2. Atualiza a patente do oficial no perfil dele
        await prisma.officer.update({
            where: { db_id: promotionRequest.requester.db_id },
            data: { rank: promotionRequest.requested_rank }
        });

        // 3. Edita a embed original para refletir a aprovação
        const finalEmbed = EmbedBuilder.from(interaction.message.embeds[0])
            .setColor(0x00FF00) // Verde
            .spliceFields(-1, 1, { name: 'Status', value: `\`✅ APROVADO por ${interaction.user.tag}\`` });
        
        await interaction.message.edit({ embeds: [finalEmbed], components: [] });

        // 4. Envia DM para o oficial
        const member = await interaction.guild.members.fetch(promotionRequest.requester.discord_id).catch(() => null);
        if (member) {
            await member.send(`⭐ Parabéns! Sua solicitação de promoção para **${promotionRequest.requested_rank}** no servidor **${interaction.guild.name}** foi **APROVADA**!`).catch();
        }
    }
};