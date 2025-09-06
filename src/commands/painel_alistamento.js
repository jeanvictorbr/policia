import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('painel_alistamento')
    .setDescription('Posta o painel de alistamento público no canal atual.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
    const recruitmentEmbed = new EmbedBuilder()
        .setColor(0x005A9C) // Um azul policial, sóbrio e forte
        .setTitle('👮 CENTRAL DE ALISTAMENTO | POLICEFLOW')
        .setDescription('> Bem-vindo(a) ao nosso sistema de recrutamento automatizado. Leia os pré-requisitos com atenção e inicie sua jornada para se tornar um oficial da lei.')
        .setImage('https://i.imgur.com/your-banner-image.png') // **TROQUE ESTE LINK por um banner seu!**
        .addFields(
            { 
                name: '📜 Pré-Requisitos Essenciais', 
                value: '• Ser maior de 16 anos.\n• Possuir um microfone funcional.\n• Ter lido e concordado com todas as nossas `regras`.\n• Estar disposto(a) a seguir a hierarquia e os procedimentos.',
                inline: false 
            },
            { 
                name: '📋 Como Funciona o Processo?', 
                value: '1. Clique no botão **"Iniciar Alistamento"** abaixo.\n2. Um formulário aparecerá na sua tela.\n3. Preencha todas as perguntas com seriedade e honestidade.\n4. Após o envio, sua ficha será encaminhada para análise do Comando.',
                inline: false 
            },
            {
                name: '⏳ Prazo de Análise',
                value: 'Nossa equipe de recrutamento analisará sua ficha em até `48 horas`. Fique de olho nas suas mensagens diretas!',
                inline: true
            },
            {
                name: '❓ Dúvidas?',
                value: 'Procure um membro do `Alto Comando` no canal de dúvidas.',
                inline: true
            }
        )
        .setTimestamp()
        .setFooter({ text: 'Sistema de Alistamento FactionFlow', iconURL: interaction.guild.iconURL() });

    const recruitmentButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('iniciar_alistamento')
                .setLabel('Iniciar Alistamento')
                .setStyle(ButtonStyle.Success) // Verde para uma ação positiva
                .setEmoji('➡️')
        );

    await interaction.channel.send({
        embeds: [recruitmentEmbed],
        components: [recruitmentButton]
    });

    // Confirmação para o admin que o painel foi postado
    await interaction.reply({ content: '✅ Painel de alistamento postado com sucesso!', ephemeral: true });
}