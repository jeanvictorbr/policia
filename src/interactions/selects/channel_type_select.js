import { EmbedBuilder, ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    key: 'channel_type_select',
    async execute(interaction) {
        const channelType = interaction.values[0];
        const dynamicCustomId = `final_channel_select:${channelType}`;

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Selecione o Canal`)
            .setDescription(`Agora, selecione no menu abaixo qual canal de texto será usado para a função de **${interaction.component.options.find(opt => opt.value === channelType)?.label}**.`);

        const menu = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId(dynamicCustomId)
                    .setPlaceholder('Clique para escolher um canal...')
                    .addChannelTypes(ChannelType.GuildText)
            );

        const backButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('config_gerais')
                    .setLabel('Voltar')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⬅️')
            );

        await interaction.update({ embeds: [embed], components: [menu, backButton] });
    }
};