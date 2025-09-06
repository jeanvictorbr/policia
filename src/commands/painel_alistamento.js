import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('painel_alistamento')
    .setDescription('Posta o painel de alistamento público no canal atual.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
    const recruitmentEmbed = new EmbedBuilder()
        .setColor(0x2B2D31) // Cor escura, quase preta
        .setTitle('CENTRAL DE ALISTAMENTO')
        .setDescription('> Deseja fazer parte da nossa corporação? Inicie seu processo de alistamento e mostre seu valor.')
        .setImage('https://i.imgur.com/your-banner-image.png') // **TROQUE ESTE LINK!**
        .addFields({
            name: 'Como Proceder?',
            value: 'Clique no botão `Iniciar Alistamento` abaixo para abrir o formulário. O preenchimento é rápido e sua ficha será enviada diretamente ao Comando para análise.'
        })
        .setFooter({ text: 'PoliceFlow • Sistema de Recrutamento', iconURL: interaction.guild.iconURL() });

    const recruitmentButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('iniciar_alistamento')
                .setLabel('Iniciar Alistamento')
                .setStyle(ButtonStyle.Secondary) // Estilo "preto"
                .setEmoji('📝')
        );

    await interaction.channel.send({ embeds: [recruitmentEmbed], components: [recruitmentButton] });
    await interaction.reply({ content: '✅ Painel de alistamento postado com sucesso!', ephemeral: true });
}