import { createRecruitmentEmbedEditor } from '../../utils/uiBuilder.js';

export default {
    key: 'customize_recruitment_panel',
    async execute(interaction) {
        await interaction.deferUpdate();
        const editorPanel = await createRecruitmentEmbedEditor(interaction.guild.id);
        await interaction.editReply(editorPanel);
    }
};