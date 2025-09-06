import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { prisma } from './database.js';

// Função auxiliar para formatar os valores (Canal ou Cargo) de forma elegante
const formatValue = (value, type = 'channel') => {
    if (!value) return '`⚫ Não definido`';
    return type === 'channel' ? `\`✅\` <#${value}>` : `\`✅\` <@&${value}>`;
};

// --- Dashboard Principal (Chamado pelo /painel_config) ---
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

// --- Dashboard do Módulo de CONFIGURAÇÕES GERAIS ---
export async function createGeneralConfigDashboard(guildId) {
    const config = await prisma.guildConfig.findUnique({ where: { guild_id: guildId } }) || {};
    const activeTheme = config.active_theme_id 
        ? await prisma.garrisonTheme.findUnique({ where: { id: config.active_theme_id } }) 
        : null;

    const embed = new EmbedBuilder()
        .setColor(0x99AAB5)
        .setTitle('🛠️ Módulo de Configurações Gerais')
        .setDescription('Configure opções globais que afetam a aparência e o comportamento geral do bot.')
        .addFields(
            { name: '🎨 Tema da Guarnição Ativo', value: activeTheme ? `\`${activeTheme.name}\`` : '`Padrão`', inline: false },
        )
        .setFooter({ text: 'PoliceFlow • Dashboard de Módulo' });
        
    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('select_garrison_theme').setLabel('Definir Guarnição').setStyle(ButtonStyle.Secondary).setEmoji('🎨'),
        new ButtonBuilder().setCustomId('configure_garrison_themes').setLabel('Configurar Temas').setStyle(ButtonStyle.Secondary).setEmoji('🔐')
    );
    const backButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('view_modules').setLabel('Voltar para Módulos').setStyle(ButtonStyle.Secondary).setEmoji('⬅️')
    );
    
    return { embeds: [embed], components: [row1, backButton] };
}

// --- Dashboard do Módulo de ALISTAMENTO ---
export async function createRecruitmentDashboard(guildId) {
    const config = await prisma.guildConfig.findUnique({ where: { guild_id: guildId } }) || {};

    const embed = new EmbedBuilder()
        .setColor(0x1E90FF)
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

// --- Dashboard do Módulo de PROMOÇÕES (UPAMENTO) ---
export async function createPromotionsDashboard(guildId) {
    const config = await prisma.guildConfig.findUnique({ where: { guild_id: guildId } }) || {};

    const embed = new EmbedBuilder()
        .setColor(0xFFD700)
        .setTitle('⭐ Módulo de Promoções (Upamento)')
        .setDescription('Configure os canais e cargos para o sistema de solicitação de promoções.')
        .addFields(
            { name: 'Canal de Solicitações', value: formatValue(config.promotion_request_channel_id, 'channel'), inline: false },
            { name: 'Canal de Logs de Promoção', value: formatValue(config.promotions_channel_id, 'channel'), inline: false },
            { name: 'Cargo que Aprova Promoções', value: formatValue(config.promotion_approval_role_id, 'role'), inline: false }
        )
        .setFooter({ text: 'PoliceFlow • Dashboard de Módulo' });

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`set_config:promotion_request_channel_id`).setLabel('Canal de Solicitações').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`set_config:promotions_channel_id`).setLabel('Canal de Logs').setStyle(ButtonStyle.Secondary)
    );
    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`set_config:promotion_approval_role_id`).setLabel('Cargo de Aprovação').setStyle(ButtonStyle.Secondary)
    );
    const backButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('view_modules').setLabel('Voltar para Módulos').setStyle(ButtonStyle.Secondary).setEmoji('⬅️')
    );

    return { embeds: [embed], components: [row1, row2, backButton] };
}

// --- Dashboard do Módulo de FARDAMENTOS ---
export async function createUniformsDashboard(guildId) {
    const kits = await prisma.uniformKit.findMany({
        where: { guild_id: guildId },
        orderBy: { name: 'asc' }
    });

    let kitList = kits.map((kit, index) => `\`${index + 1}.\` **${kit.name}**`).join('\n');
    if (kits.length === 0) {
        kitList = '> *Nenhum kit de fardamento foi criado ainda.*';
    }

    const embed = new EmbedBuilder()
        .setColor(0x718093)
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
// --- Dashboard de GERENCIAMENTO DE TEMAS (Protegido por Senha) ---
export async function createThemeManagementDashboard(guildId) {
    const themes = await prisma.garrisonTheme.findMany({
        where: { guild_id: guildId },
        orderBy: { name: 'asc' }
    });

    let themeList = themes.map(theme => {
        return `🎨 **${theme.name}** (\`${theme.bot_nickname}\`)`;
    }).join('\n');

    if (themes.length === 0) {
        themeList = '> *Nenhum tema customizado foi criado ainda.*';
    }

    const embed = new EmbedBuilder()
        .setColor(0x5865F2) // Cor "Blurple" do Discord
        .setTitle('🔐 Painel de Gerenciamento de Temas')
        .setDescription('Crie, edite ou delete os temas de guarnição para seu servidor. As alterações aqui são salvas permanentemente no banco de dados.')
        .addFields({ name: 'Temas Criados', value: themeList });

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('create_garrison_theme').setLabel('Criar Tema').setStyle(ButtonStyle.Success).setEmoji('➕'),
        new ButtonBuilder().setCustomId('edit_garrison_theme').setLabel('Editar Tema').setStyle(ButtonStyle.Primary).setEmoji('✏️'),
        new ButtonBuilder().setCustomId('delete_garrison_theme').setLabel('Deletar Tema').setStyle(ButtonStyle.Danger).setEmoji('🗑️')
    );
    const backButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('back_to_general_config').setLabel('Voltar').setStyle(ButtonStyle.Secondary).setEmoji('⬅️')
    );

    return { embeds: [embed], components: [row1, backButton], flags: [ 64 ] }; // Ephemeral
}