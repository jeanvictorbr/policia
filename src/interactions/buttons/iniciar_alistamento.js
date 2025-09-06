import { EmbedBuilder, ActionRowBuilder, UserSelectMenuBuilder } from 'discord.js';
import { prisma } from '../../utils/database.js';

export default {
    key: 'iniciar_alistamento',
    async execute(interaction) {
        const config = await prisma.guildConfig.findUnique({
            where: { guild_id: interaction.guild.id }
        });

        if (!config || !config.recruiter_role_id) {
            return interaction.reply({ content: '❌ O sistema de recrutamento não foi configurado corretamente (cargo de recrutador não definido).', flags: [ 64 ] });
        }

        const recruiterRole = await interaction.guild.roles.fetch(config.recruiter_role_id);
        if (!recruiterRole) {
            return interaction.reply({ content: '❌ O cargo de recrutador configurado não foi encontrado no servidor.', flags: [ 64 ] });
        }

        // Pega todos os membros com o cargo de recrutador ou um cargo superior
        const allMembers = await interaction.guild.members.fetch();
        const recruiters = allMembers.filter(member => 
            !member.user.bot && member.roles.highest.position >= recruiterRole.position
        );

        if (recruiters.size === 0) {
            return interaction.reply({ content: '❌ Nenhum recrutador disponível foi encontrado no momento.', flags: [ 64 ] });
        }

        const embed = new EmbedBuilder()
            .setColor(0x2B2D31)
            .setTitle('Seleção de Recrutador')
            .setDescription('Antes de prosseguir, por favor, selecione na lista abaixo o recrutador que lhe atendeu ou indicou o alistamento.');
        
        const recruiterSelectMenu = new ActionRowBuilder()
            .addComponents(
                new UserSelectMenuBuilder()
                    .setCustomId('recrutador_selecionado')
                    .setPlaceholder('Clique para selecionar um recrutador...')
                    .setMinValues(1)
                    .setMaxValues(1)
                    // Adiciona os recrutadores encontrados como opções
                    .setUsers(recruiters.map(member => member.id).slice(0, 25)) // Limite de 25 opções
            );

        await interaction.reply({ embeds: [embed], components: [recruiterSelectMenu], ephemeral: true });
    }
};