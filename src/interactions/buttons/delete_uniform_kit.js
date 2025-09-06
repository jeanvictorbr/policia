import { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';
import { prisma } from '../../utils/database.js';

export default {
    key: 'delete_uniform_kit',
    async execute(interaction) {
        const kits = await prisma.uniformKit.findMany({
            where: { guild_id: interaction.guild.id }
        });

        if (kits.length === 0) {
            return interaction.reply({ content: 'Não há kits de fardamento para deletar.', ephemeral: true });
        }

        const options = kits.map(kit => ({
            label: kit.name,
            value: kit.id.toString(), // O valor precisa ser uma string
            emoji: '👕'
        }));

        const menu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select_kit_to_delete')
                    .setPlaceholder('Selecione o kit que deseja deletar...')
                    .addOptions(options)
            );

        await interaction.reply({ content: 'Por favor, selecione no menu abaixo o kit de fardamento que você deseja deletar.', components: [menu], ephemeral: true });
    }
};