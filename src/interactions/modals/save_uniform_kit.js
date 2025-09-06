import { prisma } from '../../utils/database.js';
import { createUniformsDashboard } from '../../utils/uiBuilder.js';

export default {
    key: 'save_uniform_kit',
    async execute(interaction) {
        await interaction.deferUpdate();

        const name = interaction.fields.getTextInputValue('kit_name');
        const codes = interaction.fields.getTextInputValue('kit_codes');

        try {
            await prisma.uniformKit.create({
                data: {
                    name: name,
                    codes: codes,
                    guild_id: interaction.guild.id,
                }
            });

            const updatedDashboard = await createUniformsDashboard(interaction.guild.id);
            await interaction.message.edit(updatedDashboard);

            await interaction.followUp({ content: `✅ O kit de fardamento **${name}** foi criado com sucesso!`, ephemeral: true });

        } catch (error) {
            console.error('Erro ao criar kit de fardamento:', error);
            await interaction.followUp({ content: '❌ Ocorreu um erro ao criar o kit.', ephemeral: true });
        }
    }
};