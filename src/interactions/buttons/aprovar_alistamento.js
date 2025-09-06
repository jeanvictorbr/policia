import { EmbedBuilder, MessageFlags } from 'discord.js';
import { prisma } from '../../utils/database.js';

export default {
    key: 'aprovar_alistamento',
    async execute(interaction, args) {
        const [candidateId, nomeFivem, idFivem] = args;

        try {
            await interaction.deferReply({ ephemeral: true });

            const config = await prisma.guildConfig.findUnique({ where: { guild_id: interaction.guild.id } });
            if (!config || !config.recruit_role_id) {
                return interaction.editReply({ content: '❌ O cargo de "aluno/recruta" padrão não foi configurado.' });
            }

            const member = await interaction.guild.members.fetch(candidateId).catch(() => null);
            if (!member) {
                return interaction.editReply({ content: '❌ O candidato não foi encontrado neste servidor.' });
            }

            // Descobre qual cargo foi selecionado no menu
            const roleSelectRow = interaction.message.components[0];
            const selectedRoleId = roleSelectRow.components[0].values?.[0] || config.recruit_role_id;
            
            const roleConfig = await prisma.roleConfig.findUnique({ where: { role_id: selectedRoleId } });
            if (!roleConfig) {
                return interaction.editReply({ content: `❌ A TAG para o cargo <@&${selectedRoleId}> não foi configurada.` });
            }
            
            // 1. Altera o Nickname
            const newNickname = `[${roleConfig.tag}] ${nomeFivem} [${idFivem}]`;
            await member.setNickname(newNickname);
            
            // 2. Atribui o cargo
            await member.roles.add(selectedRoleId);

            // 3. Salva no banco de dados
            await prisma.officer.create({
                data: {
                    discord_id: candidateId,
                    guild_id: interaction.guild.id,
                    name_fivem: nomeFivem,
                    id_fivem: idFivem,
                    rank: roleConfig.name,
                }
            });

            // 4. Edita a mensagem original
            const finalEmbed = EmbedBuilder.from(interaction.message.embeds[0])
                .setColor(0x00FF00) // Verde
                .spliceFields(-1, 1, { name: 'Status', value: `\`✅ APROVADO por ${interaction.user.tag}\`` });
            
            await interaction.message.edit({ embeds: [finalEmbed], components: [] });

            // 5. Envia DM para o candidato
            await member.send(`🎉 Parabéns! Sua ficha no servidor **${interaction.guild.name}** foi **APROVADA**. Apresente-se para iniciar seu treinamento.`).catch();

            await interaction.editReply({ content: '✅ Candidato aprovado e configurado com sucesso!' });

        } catch (error) {
            console.error(error);
            if (error.code === 50013) { // Missing Permissions
                return interaction.editReply({ content: '❌ Erro: Não tenho permissão para gerenciar cargos ou apelidos deste usuário.' });
            }
            return interaction.editReply({ content: '❌ Ocorreu um erro inesperado.' });
        }
    }
};