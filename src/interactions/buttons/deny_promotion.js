import { EmbedBuilder } from 'discord.js';
import { prisma } from '../../utils/database.js';

export default {
    key: 'deny_promotion',
    async execute(interaction, args) {
        const requestId = parseInt(args[0]);
        await interaction.deferUpdate();

        const promotionRequest = await prisma.promotionRequest.update({
            where: { id: requestId },
            data: {
                status: 'DENIED',
                reviewer_id: interaction.user.id,
                reviewed_at: new Date(),
            },
            include: { requester: true }
        });
        
        const finalEmbed = EmbedBuilder.from(interaction.message.embeds[0])
            .setColor(0xFF0000) // Vermelho
            .spliceFields(-1, 1, { name: 'Status', value: `\`❌ RECUSADO por ${interaction.user.tag}\`` });

        await interaction.message.edit({ embeds: [finalEmbed], components: [] });
        
        const member = await interaction.guild.members.fetch(promotionRequest.requester.discord_id).catch(() => null);
        if (member) {
            await member.send(`Sua solicitação de promoção para **${promotionRequest.requested_rank}** no servidor **${interaction.guild.name}** foi **RECUSADA**.`).catch();
        }
    }
};