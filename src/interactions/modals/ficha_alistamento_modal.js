import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { prisma } from '../../utils/database.js';

export default {
    key: 'ficha_alistamento_modal',
    async execute(interaction) {
        // Pega as configurações do banco de dados
        const config = await prisma.guildConfig.findUnique({
            where: { guild_id: interaction.guild.id }
        });

        if (!config || !config.analysis_channel_id) {
            return interaction.reply({ content: '❌ O canal de análise de alistamentos não foi configurado. Contate um administrador.', ephemeral: true });
        }

        const analysisChannel = await interaction.guild.channels.fetch(config.analysis_channel_id);
        if (!analysisChannel) {
            return interaction.reply({ content: '❌ O canal de análise configurado não foi encontrado. Contate um administrador.', ephemeral: true });
        }

        // Pega as respostas do formulário
        const nome = interaction.fields.getTextInputValue('form_nome_idade');
        const idFivem = interaction.fields.getTextInputValue('form_id_fivem');
        const motivacao = interaction.fields.getTextInputValue('form_motivacao');

        // Cria a Embed rica para análise
        const applicationEmbed = new EmbedBuilder()
            .setColor(0xFFA500) // Laranja para "Pendente"
            .setTitle('📝 Nova Ficha de Alistamento Recebida')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`**Candidato:** <@${interaction.user.id}>`)
            .addFields(
                { name: '👤 Nome e Idade', value: `\`\`\`${nome}\`\`\`` },
                { name: '🆔 ID FiveM', value: `\`\`\`${idFivem}\`\`\`` },
                { name: '💡 Motivação', value: `\`\`\`${motivacao}\`\`\`` },
                { name: 'Status', value: '`⏳ PENDENTE DE ANÁLISE`' }
            )
            .setTimestamp()
            .setFooter({ text: `ID do Candidato: ${interaction.user.id}` });

        const decisionButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`aprovar_alistamento:${interaction.user.id}`) // ID dinâmico com o ID do candidato
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
            components: [decisionButtons]
        });

        await interaction.reply({ content: '✅ Sua ficha foi enviada com sucesso para análise! Entraremos em contato em breve.', ephemeral: true });
    }
};