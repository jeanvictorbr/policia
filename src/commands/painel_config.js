import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('painel_config')
    .setDescription('Abre o dashboard de gerenciamento do PoliceFlow.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
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

    await interaction.reply({
        embeds: [mainDashboard],
        components: [actionRow],
        flags: [ 64 ] // Ephemeral
    });
}