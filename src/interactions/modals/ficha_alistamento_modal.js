import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder } from 'discord.js';
import { prisma } from '../../utils/database.js';

export default {
    key: 'ficha_alistamento_modal',
    async execute(interaction) {
        // ... (código para buscar config e analysisChannel continua o mesmo) ...
        const config = await prisma.guildConfig.findUnique({ where: { guild_id: interaction.guild.id } });
        if (!config || !config.analysis_channel_id) return interaction.reply({ content: '❌ Canal de análise não configurado.', ephemeral: true });
        const analysisChannel = await interaction.guild.channels.fetch(config.analysis_channel_id);
        if (!analysisChannel) return interaction.reply({ content: '❌ Canal de análise não encontrado.', ephemeral: true });
        
        // Pega o ID do recrutador que passamos pelo customId
        const recruiterId = interaction.customId.split(':')[1];
        
        const nomeFivem = interaction.fields.getTextInputValue('form_nome_fivem');
        const idFivem = interaction.fields.getTextInputValue('form_id_fivem');

        const applicationEmbed = new EmbedBuilder()
            .setColor(0xFFA500)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.user.displayAvatarURL()) // << THUMBNAIL DO CANDIDATO
            .setTitle('Nova Ficha de Alistamento para Análise')
            .setImage('https://i.imgur.com/your-analysis-banner.png') // << IMAGEM DA EMBED - TROQUE O LINK!
            .addFields(
                { name: '👤 Candidato', value: `<@${interaction.user.id}>`, inline: true },
                { name: '👮 Recrutador', value: `<@${recruiterId}>`, inline: true },
                { name: '📝 Nome (FiveM)', value: `\`\`\`${nomeFivem}\`\`\`` },
                { name: '🆔 ID (FiveM)', value: `\`\`\`${idFivem}\`\`\`` },
                { name: 'Status', value: '`⏳ PENDENTE`' }
            )
            .setTimestamp()
             // << RODAPÉ CUSTOMIZADO COM GIF
            .setFooter({ text: 'PoliceFlow - By Ze piqueno', iconURL: 'https://i.imgur.com/aF9E2c0.gif' });

        // Componentes para a decisão do admin (continua o mesmo)
        const roleSelectRow = new ActionRowBuilder().addComponents( new RoleSelectMenuBuilder().setCustomId(`aprovar_cargo_select:${interaction.user.id}`).setPlaceholder('Opcional: Selecione um cargo inicial') );
        const decisionButtons = new ActionRowBuilder().addComponents( new ButtonBuilder().setCustomId(`aprovar_alistamento:${interaction.user.id}:${nomeFivem}:${idFivem}`).setLabel('Aprovar').setStyle(ButtonStyle.Success).setEmoji('✅'), new ButtonBuilder().setCustomId(`recusar_alistamento:${interaction.user.id}`).setLabel('Recusar').setStyle(ButtonStyle.Danger).setEmoji('❌') );

        await analysisChannel.send({ embeds: [applicationEmbed], components: [roleSelectRow, decisionButtons] });
        await interaction.reply({ content: '✅ Sua ficha foi enviada com sucesso!', ephemeral: true });
    }
};