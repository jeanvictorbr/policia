import { prisma } from '../../utils/database.js';
import { createThemeManagementDashboard } from '../../utils/uiBuilder.js';

export default {
    key: 'save_garrison_theme',
    async execute(interaction) {
        await interaction.deferUpdate();

        try {
            const name = interaction.fields.getTextInputValue('theme_name');
            const nickname = interaction.fields.getTextInputValue('theme_nickname');
            const color = interaction.fields.getTextInputValue('theme_color');
            const banner = interaction.fields.getTextInputValue('theme_banner');

            // Salva o novo tema no banco de dados, associado a este servidor
            await prisma.garrisonTheme.create({
                data: {
                    guild_id: interaction.guild.id,
                    name: name,
                    bot_nickname: nickname,
                    embed_color: color || null,
                    main_panel_banner_url: banner || null,
                }
            });

            // Atualiza o dashboard para mostrar o novo tema na lista
            const updatedDashboard = await createThemeManagementDashboard(interaction.guild.id);
            await interaction.message.edit(updatedDashboard);

            // Envia uma confirmação temporária
            await interaction.followUp({ content: `✅ Tema **${name}** criado com sucesso!`, ephemeral: true });

        } catch (error) {
            // Trata o erro caso um tema com o mesmo nome já exista
            if (error.code === 'P2002') {
                await interaction.followUp({ content: `❌ Já existe um tema com este nome. Por favor, escolha outro.`, ephemeral: true });
            } else {
                console.error("Erro ao criar tema:", error);
                await interaction.followUp({ content: '❌ Ocorreu um erro ao criar o tema.', ephemeral: true });
            }
        }
    }
};