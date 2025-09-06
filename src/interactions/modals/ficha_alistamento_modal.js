import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder } from 'discord.js';
import { prisma } from '../../utils/database.js';

export default {
    key: 'ficha_alistamento_modal',
    async execute(interaction) {
        // ... (código para buscar config e analysisChannel continua o mesmo de antes) ...
        const config = await prisma.guildConfig.findUnique({ where: { guild_id: interaction.guild.id } });
        if (!config || !config.analysis_channel_id) return interaction.reply({ content: '❌ Canal de análise não configurado.', ephemeral: true });
        const analysisChannel = await interaction.guild.channels.fetch(config.analysis_channel_id);
        if (!analysisChannel) return interaction.reply({ content: '❌ Canal de análise não encontrado.', ephemeral: true });

        const nomeFivem = interaction.fields.getTextInputValue('form_nome_fivem');
        const idFivem = interaction.fields.getTextInputValue('form_id_fivem');

        const applicationEmbed = new EmbedBuilder()
            .setColor(0xFFA500)
            .setTitle('📝 Nova Ficha de Alistamento')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`**Candidato:** <@${interaction.user.id}>`)
            .addFields(
                { name: '👤 Nome (FiveM)', value: `\`\`\`${nomeFivem}\`\`\``, inline: true },
                { name: '🆔 ID (FiveM)', value: `\`\`\`${idFivem}\`\`\``, inline: true },
                { name: 'Status', value: '`⏳ PENDENTE`' }
            )
            .setTimestamp()
            .setFooter({ text: `ID do Candidato: ${interaction.user.id}` });

        // Componente de Seleção de Cargo
        const roleSelectRow = new ActionRowBuilder()
            .addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId(`aprovar_cargo_select:${interaction.user.id}`) // ID dinâmico
                    .setPlaceholder('Opcional: Selecione um cargo inicial')
            );
        
        // Componente dos botões de Ação
        const decisionButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`aprovar_alistamento:${interaction.user.id}:${nomeFivem}:${idFivem}`) // Passando os dados no ID
                    .setLabel('Aprovar')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('✅'),
                new ButtonBuilder()
                    .setCustomId(`recusar_alistamento:${interaction.user.id}`)
                    .setLabel('Recusar')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('❌')
            );

        await analysisChannel.send({
            embeds: [applicationEmbed],
            components: [roleSelectRow, decisionButtons] // Enviando ambos os componentes
        });

        await interaction.reply({ content: '✅ Sua ficha foi enviada com sucesso!', ephemeral: true });
    }
};