import { EmbedBuilder } from 'discord.js';

export default {
    key: 'recusar_alistamento',
    async execute(interaction, args) {
        const [candidateId] = args;
        const member = await interaction.guild.members.fetch(candidateId).catch(() => null);

        const finalEmbed = EmbedBuilder.from(interaction.message.embeds[0])
            .setColor(0xFF0000) // Vermelho
            .spliceFields(-1, 1, { name: 'Status', value: `\`❌ RECUSADO por ${interaction.user.tag}\`` });

        await interaction.message.edit({ embeds: [finalEmbed], components: [] });

        if (member) {
            await member.send(`Lamentamos informar que sua ficha no servidor **${interaction.guild.name}** foi **RECUSADA**.`).catch();
        }

        await interaction.reply({ content: 'Candidato recusado.', ephemeral: true });
    }
};