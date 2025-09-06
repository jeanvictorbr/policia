import { prisma } from '../../utils/database.js';

export default {
    key: 'final_role_select', // Usaremos startsWith() para pegar o ID dinâmico
    async execute(interaction) {
        if (!interaction.guild) return;

        const selectedRoleId = interaction.values[0];
        const roleTypeToUpdate = interaction.customId.split(':')[1]; // Pega a coluna a ser atualizada

        try {
            await prisma.guildConfig.update({
                where: {
                    guild_id: interaction.guild.id,
                },
                data: {
                    [roleTypeToUpdate]: selectedRoleId,
                },
            });

            const role = await interaction.guild.roles.fetch(selectedRoleId);
            const roleLabel = roleTypeToUpdate === 'recruit_role_id' ? 'Aluno/Recruta' : 'Recrutador';

            await interaction.update({ 
                content: `✅ **Configuração salva!** O cargo **@${role.name}** foi definido como o novo *${roleLabel} Padrão*.`, 
                embeds: [], 
                components: [] 
            });

        } catch (error) {
            console.error("Erro ao salvar cargo no Prisma:", error);
            await interaction.update({ content: '❌ Ocorreu um erro ao salvar a configuração. Verifique os logs.', embeds: [], components: [] });
        }
    }
};