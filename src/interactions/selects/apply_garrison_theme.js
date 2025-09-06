import { prisma } from '../../utils/database.js';

// Objeto com as configurações de cada tema pré-definido
const themes = {
    theme_default: { nickname: 'PoliceFlow' },
    theme_bope_rj: { nickname: 'BOPE | Gestão' },
    theme_rota_sp: { nickname: 'ROTA | Gestão' },
    theme_pmerj: { nickname: 'PMERJ | Gestão' },
    theme_pmsp: { nickname: 'PMSP | Gestão' },
};

export default {
    key: 'apply_garrison_theme',
    async execute(interaction) {
        const themeKey = interaction.values[0];
        const selectedTheme = themes[themeKey];

        if (!selectedTheme) {
            return interaction.update({ content: '❌ Tema inválido selecionado.', embeds: [], components: [] });
        }

        try {
            // Tenta alterar o apelido do bot
            await interaction.guild.members.me.setNickname(selectedTheme.nickname);

            // Futuramente, aqui salvaremos o tema ativo no banco de dados.
            // await prisma.guildConfig.update(...)

            await interaction.update({ content: `✅ Tema **${selectedTheme.nickname}** aplicado com sucesso! O apelido do bot foi alterado.`, embeds: [], components: [] });

        } catch (error) {
            console.error('Erro ao aplicar tema:', error);
            await interaction.update({ content: '❌ Não tenho permissão para alterar meu próprio apelido neste servidor.', embeds: [], components: [] });
        }
    }
};