import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function createMainMenu() {
    const mainEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Painel de Configuração | PoliceFlow')
        .setDescription('Bem-vindo ao centro de controle do PoliceFlow.\n\nUse os botões abaixo para gerenciar todos os módulos da sua facção de forma intuitiva e visual.')
        .setTimestamp()
        .setFooter({ text: 'PoliceFlow • Painel Administrativo' });

    // A CORREÇÃO ESTÁ AQUI: Removemos o <ButtonBuilder>
    const mainRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('config_gerais')
                .setLabel('Config. Gerais')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⚙️'),
            new ButtonBuilder()
                .setCustomId('config_alistamento')
                .setLabel('Alistamento')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('📝'),
            new ButtonBuilder()
                .setCustomId('config_cursos')
                .setLabel('Cursos')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🎓'),
        );
    
    return { embeds: [mainEmbed], components: [mainRow], ephemeral: true };
}