import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { prisma } from './database.js';

// Função auxiliar para formatar os valores (Canal ou Cargo)
const formatValue = (value, type = 'channel') => {
    if (!value) return '`⚫ Não definido`';
    return type === 'channel' ? `\`✅\` <#${value}>` : `\`✅\` <@&${value}>`;
};

// --- Dashboard Principal (Chamado pelo /painel_config) ---
export function createMainDashboard() {
    // ... (este código continua o mesmo)
    const mainDashboard = new EmbedBuilder().setColor(0x2B2D31).setTitle('Dashboard de Gerenciamento | PoliceFlow').setDescription('Bem-vindo ao centro de controle. A partir daqui, você pode gerenciar todos os aspectos da sua facção de forma visual e intuitiva.').addFields({ name: 'Navegação', value: '> Clique no botão `Módulos` para acessar e configurar todas as funcionalidades do bot.' }).setTimestamp().setFooter({ text: 'PoliceFlow - By Ze piqueno' });
    const actionRow = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('view_modules').setLabel('Módulos').setStyle(ButtonStyle.Secondary).setEmoji('⚙️'));
    return { embeds: [mainDashboard], components: [actionRow], flags: [ 64 ] };
}

// --- Dashboard do Módulo de ALISTAMENTO ---
export async function createRecruitmentDashboard(guildId) {
    const config = await prisma.guildConfig.findUnique({ where: { guild_id: guildId } }) || {};

    const embed = new EmbedBuilder()
        .setColor(0x1E90FF) // Azul "Dodger Blue"
        .setTitle('📝 Módulo de Alistamento')
        .setDescription('Configure todos os aspectos do processo de recrutamento da sua facção. As alterações são refletidas em tempo real no dashboard.')
        .addFields(
            { name: 'Canal de Análises', value: formatValue(config.analysis_channel_id, 'channel'), inline: false },
            { name: 'Cargo de Recrutador', value: formatValue(config.recruiter_role_id, 'role'), inline: false },
            { name: 'Cargo de Aluno/Recruta Padrão', value: formatValue(config.recruit_role_id, 'role'), inline: false },
        )
        .setFooter({ text: 'PoliceFlow • Dashboard de Módulo' });

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`set_config:analysis_channel_id`).setLabel('Definir Canal de Análises').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`set_config:recruiter_role_id`).setLabel('Definir Cargo de Recrutador').setStyle(ButtonStyle.Secondary)
    );
    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`set_config:recruit_role_id`).setLabel('Definir Cargo de Aluno').setStyle(ButtonStyle.Secondary)
    );
    const backButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('view_modules').setLabel('Voltar para Módulos').setStyle(ButtonStyle.Secondary).setEmoji('⬅️')
    );

    return { embeds: [embed], components: [row1, row2, backButton] };
}

// --- Dashboard do Módulo de CONFIGURAÇÕES GERAIS ---
export async function createGeneralConfigDashboard(guildId) {
    const config = await prisma.guildConfig.findUnique({ where: { guild_id: guildId } }) || {};

    const embed = new EmbedBuilder()
        .setColor(0x99AAB5) // Cinza "Blurple"
        .setTitle('🛠️ Módulo de Configurações Gerais')
        .setDescription('Configure opções globais que afetam a aparência e o comportamento geral do bot.')
        .addFields(
            { name: '🖼️ Logotipo/Banner', value: config.logo_url ? `[Ver Imagem](${config.logo_url})` : '`⚫ Não definido`', inline: false },
        )
        .setFooter({ text: 'PoliceFlow • Dashboard de Módulo' });
        
    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`set_config_modal:logo_url`).setLabel('Definir Logotipo/Banner').setStyle(ButtonStyle.Secondary)
    );
    const backButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('view_modules').setLabel('Voltar para Módulos').setStyle(ButtonStyle.Secondary).setEmoji('⬅️')
    );
    
    return { embeds: [embed], components: [row1, backButton] };
}

// --- Dashboard do Módulo de FARDAMENTOS ---
export async function createUniformsDashboard(guildId) {
    const kits = await prisma.uniformKit.findMany({
        where: { guild_id: guildId },
        orderBy: { name: 'asc' }
    });

    let kitList = kits.map((kit, index) => {
        return `\`${index + 1}.\` **${kit.name}**`;
    }).join('\n');

    if (kits.length === 0) {
        kitList = '> *Nenhum kit de fardamento foi criado ainda.*';
    }

    const embed = new EmbedBuilder()
        .setColor(0x718093) // Um cinza elegante
        .setTitle('👕 Módulo de Fardamentos')
        .setDescription('Crie e gerencie os kits de fardas da sua facção. Os oficiais poderão visualizar os kits com o comando `/fardamentos`.')
        .addFields({ name: 'Kits Disponíveis', value: kitList })
        .setFooter({ text: 'PoliceFlow • Dashboard de Módulo' });

    const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('create_uniform_kit').setLabel('Criar Novo Kit').setStyle(ButtonStyle.Success).setEmoji('➕'),
        new ButtonBuilder().setCustomId('delete_uniform_kit').setLabel('Deletar Kit').setStyle(ButtonStyle.Danger).setEmoji('🗑️')
    );

    const backButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('view_modules').setLabel('Voltar para Módulos').setStyle(ButtonStyle.Secondary).setEmoji('⬅️')
    );

    return { embeds: [embed], components: [actionRow, backButton] };
}
// --- Dashboard do Módulo de PROMOÇÕES (UPAMENTO) ---
export async function createPromotionsDashboard(guildId) {
    const config = await prisma.guildConfig.findUnique({ where: { guild_id: guildId } }) || {};

    const formatValue = (value, type = 'channel') => {
        if (!value) return '`⚫ Não definido`';
        return type === 'channel' ? `\`✅\` <#${value}>` : `\`✅\` <@&${value}>`;
    };

    const embed = new EmbedBuilder()
        .setColor(0xFFD700) // Dourado
        .setTitle('⭐ Módulo de Promoções (Upamento)')
        .setDescription('Configure os canais e cargos para o sistema de solicitação de promoções.')
        .addFields(
            { name: 'Canal de Solicitações', value: formatValue(config.promotion_request_channel_id, 'channel'), inline: false },
            { name: 'Canal de Logs de Promoção', value: formatValue(config.promotions_channel_id, 'channel'), inline: false },
            { name: 'Cargo que Aprova Promoções', value: formatValue(config.promotion_approval_role_id, 'role'), inline: false }
        )
        .setFooter({ text: 'PoliceFlow • Dashboard de Módulo' });

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`set_config:promotion_request_channel_id`).setLabel('Definir Canal de Solicitações').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`set_config:promotions_channel_id`).setLabel('Definir Canal de Logs').setStyle(ButtonStyle.Secondary)
    );
    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`set_config:promotion_approval_role_id`).setLabel('Definir Cargo de Aprovação').setStyle(ButtonStyle.Secondary)
    );
    const backButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('view_modules').setLabel('Voltar para Módulos').setStyle(ButtonStyle.Secondary).setEmoji('⬅️')
    );

    return { embeds: [embed], components: [row1, row2, backButton] };
}