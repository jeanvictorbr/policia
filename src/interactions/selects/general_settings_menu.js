import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

// Função para gerar a tela de seleção de tipo de cargo (para evitar repetir código)
function createRoleTypeSelection() {
    const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('🔗 Vinculação de Cargos')
        .setDescription('Selecione qual cargo funcional você deseja configurar. O bot usará essa informação para automatizar processos como recrutamento e promoções.');

    const menu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('role_type_select')
                .setPlaceholder('Selecione o tipo de cargo para configurar...')
                .addOptions(
                    {
                        label: 'Cargo de Aluno/Recruta',
                        description: 'Cargo padrão que um membro recebe ao ser aprovado no alistamento.',
                        value: 'recruit_role_id',
                        emoji: '🎓'
                    },
                    {
                        label: 'Cargo de Recrutador',
                        description: 'Membros com este cargo (ou superior) aparecerão na lista de recrutadores.',
                        value: 'recruiter_role_id',
                        emoji: '👮'
                    }
                )
        );
    
    const backButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('main_menu') // Botão para voltar ao menu principal do painel
                .setLabel('Voltar ao Menu Principal')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⬅️')
        );

    return { embeds: [embed], components: [menu, backButton], ephemeral: true };
}


export default {
    key: 'general_settings_menu',
    async execute(interaction) {
        const selectedValue = interaction.values[0];

        if (selectedValue === 'set_channels') {
            // Lógica de canais (já existente)
            // ... (o código anterior para 'set_channels' permanece aqui)
            const embed = new EmbedBuilder().setColor(0x0099FF).setTitle('📺 Configuração de Canais').setDescription('Qual tipo de canal você deseja configurar?');
            const menu = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('channel_type_select').setPlaceholder('Selecione o tipo de canal...').addOptions({ label: 'Canal de Alistamento', value: 'recruitment_channel_id' },{ label: 'Canal de Análises de Fichas', value: 'analysis_channel_id' },{ label: 'Canal de Promoções', value: 'promotions_channel_id' },{ label: 'Canal de Relatórios de Ação', value: 'reports_channel_id' }));
            const backButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('config_gerais').setLabel('Voltar').setStyle(ButtonStyle.Secondary).setEmoji('⬅️'));
            await interaction.update({ embeds: [embed], components: [menu, backButton] });

        } else if (selectedValue === 'link_roles') {
            const roleTypeSelection = createRoleTypeSelection();
            await interaction.update(roleTypeSelection);
        }
    }
};