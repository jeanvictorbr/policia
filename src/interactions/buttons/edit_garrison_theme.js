import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { prisma } from '../../utils/database.js';

export default {
    key: 'edit_garrison_theme',
    async execute(interaction) {
        const themes = await prisma.garrisonTheme.findMany({
            where: { guild_id: interaction.guild.id }
        });

        if (themes.length === 0) {
            return interaction.reply({ content: 'Não há temas para editar.', ephemeral: true });
        }

        const options = themes.map(theme => ({
            label: theme.name,
            value: theme.id.toString(),
            emoji: '🎨'
        }));

        const menu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select_theme_to_edit')
                    .setPlaceholder('Selecione o tema que deseja editar...')
                    .addOptions(options)
            );

        await interaction.reply({ content: 'Por favor, selecione o tema que deseja editar:', components: [menu], ephemeral: true });
    }
};