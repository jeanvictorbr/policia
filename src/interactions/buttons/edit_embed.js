import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { prisma } from '../../utils/database.js';

export default {
    key: 'edit_embed',
    async execute(interaction, args) {
        const fieldToEdit = args[0]; // ex: 'recruitment_embed_title'

        const config = await prisma.guildConfig.findUnique({ where: { guild_id: interaction.guild.id } });

        const modal = new ModalBuilder()
            .setCustomId(`save_embed_field:${fieldToEdit}`)
            .setTitle(`Editando: ${fieldToEdit}`);

        const textInput = new TextInputBuilder()
            .setCustomId('new_value')
            .setLabel('Novo Valor')
            .setStyle(fieldToEdit.includes('description') ? TextInputStyle.Paragraph : TextInputStyle.Short)
            .setValue(config[fieldToEdit] || '') // Pré-preenche com o valor atual
            .setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(textInput));
        await interaction.showModal(modal);
    }
};