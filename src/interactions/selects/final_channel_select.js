// Importando nosso novo cliente Prisma
import { prisma } from '../../utils/database.js';

export default {
    key: 'final_channel_select',
    async execute(interaction) {
        if (!interaction.guild) return;

        const selectedChannelId = interaction.values[0];
        const channelTypeToUpdate = interaction.customId.split(':')[1];

        try {
            // A mágica do Prisma: um comando "upsert" limpo e seguro
            await prisma.guildConfig.upsert({
                where: { guild_id: interaction.guild.id }, // Onde procurar
                update: { [channelTypeToUpdate]: selectedChannelId }, // O que fazer se encontrar
                create: { // O que fazer se NÃO encontrar
                    guild_id: interaction.guild.id,
                    [channelTypeToUpdate]: selectedChannelId,
                },
            });

            const channelName = interaction.guild.channels.cache.get(selectedChannelId)?.name;
            await interaction.update({ content: `✅ Configuração salva com sucesso! O canal #${channelName} foi definido.`, embeds: [], components: [] });

        } catch (error) {
            console.error("Erro ao salvar com o Prisma:", error);
            await interaction.update({ content: '❌ Ocorreu um erro ao salvar a configuração. Verifique os logs.', embeds: [], components: [] });
            return;
        }
    }
};