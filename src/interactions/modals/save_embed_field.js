import { prisma } from '../../utils/database.js';
import { createRecruitmentEmbedEditor } from '../../utils/uiBuilder.js';

export default {
    key: 'save_embed_field',
    async execute(interaction) {
        await interaction.deferUpdate();
        const fieldToUpdate = interaction.customId.split(':')[1];
        const newValue = interaction.fields.getTextInputValue('new_value');

        await prisma.guildConfig.upsert({
            where: { guild_id: interaction.guild.id },
            update: { [fieldToUpdate]: newValue },
            create: { guild_id: interaction.guild.id, [fieldToUpdate]: newValue }
        });

        // Recria o painel de edição, que agora pegará os novos dados do banco
        const updatedEditor = await createRecruitmentEmbedEditor(interaction.guild.id);
        
        // Edita a mensagem para mostrar o painel atualizado com a nova preview
        await interaction.editReply(updatedEditor);
    }
};