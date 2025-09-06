import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { prisma } from './database.js';

// Função que constrói o Dashboard Principal
export function createMainDashboard() {
    const mainDashboard = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('Dashboard de Gerenciamento | PoliceFlow')
        .setDescription('Bem-vindo ao centro de controle. A partir daqui, você pode gerenciar todos os aspectos da sua facção de forma visual e intuitiva.')
        .addFields({
            name: 'Navegação',
            value: '> Clique no botão `Módulos` para acessar e configurar todas as funcionalidades do bot.'
        })
        .setTimestamp()
        .setFooter({ text: 'PoliceFlow - By Ze piqueno' });

    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('view_modules')
                .setLabel('Módulos')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⚙️')
        );
    
    return { embeds: [mainDashboard], components: [actionRow], flags: [ 64 ] }; // 64 = Ephemeral
}


// Função que constrói o Dashboard de Configurações Gerais (já existente)
export async function createGeneralConfigDashboard(guildId) {
    const config = await prisma.guildConfig.findUnique({
        where: { guild_id: guildId },
    }) || {}; // Adiciona um objeto vazio para evitar erros se config for nulo

    const formatValue = (value, type = 'channel') => {
        if (!value) return '`Não definido`';
        return type === 'channel' ? `<#${value}>` : `<@&${value}>`;
    };

    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('🛠️ Dashboard de Configurações Gerais')
        .setDescription('Veja e altere as configurações essenciais do bot para este servidor. As alterações são refletidas em tempo real.')
        .addFields(
            { name: 'Canal de Análises', value: formatValue(config.analysis_channel_id, 'channel'), inline: true },
            { name: 'Cargo de Recrutador', value: formatValue(config.recruiter_role_id, 'role'), inline: true },
            { name: 'Cargo de Aluno/Recruta', value: formatValue(config.recruit_role_id, 'role'), inline: true },
        )
        .setFooter({ text: 'PoliceFlow - By Ze piqueno' });

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`set_config:analysis_channel_id`).setLabel('Canal de Análises').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`set_config:recruiter_role_id`).setLabel('Cargo Recrutador').setStyle(ButtonStyle.Secondary)
    );
    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`set_config:recruit_role_id`).setLabel('Cargo Aluno').setStyle(ButtonStyle.Secondary)
    );
    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('view_modules').setLabel('Voltar para Módulos').setStyle(ButtonStyle.Secondary).setEmoji('⬅️')
    );

    return { embeds: [embed], components: [row1, row2, row3] };
}