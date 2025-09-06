import { EmbedBuilder, ActionRowBuilder, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    key: 'role_type_select',
    async execute(interaction) {
        // Pega o valor selecionado, que é o nome da coluna no banco de dados
        const roleTypeToSet = interaction.values[0]; // ex: 'recruiter_role_id'
        
        // Pega o "label" para usar no título da embed
        const roleLabel = interaction.component.options.find(opt => opt.value === roleTypeToSet)?.label;

        // O customId dinâmico nos ajuda a saber qual coluna atualizar no DB na próxima etapa
        const dynamicCustomId = `final_role_select:${roleTypeToSet}`;

        const embed = new EmbedBuilder()
            .setColor(0x2B2D31)
            .setTitle(`Definindo o ${roleLabel}`)
            .setDescription(`Escolha no menu abaixo qual cargo do servidor irá desempenhar esta função. Esta ação substituirá qualquer configuração anterior para este tipo de cargo.`);

        const menu = new ActionRowBuilder()
            .addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId(dynamicCustomId)
                    .setPlaceholder('Clique para escolher um cargo...')
            );

        // A CORREÇÃO ESTÁ AQUI:
        const backButton = new ActionRowBuilder() // Usando o nome correto: ActionRowBuilder
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back_to_role_type_select') 
                    .setLabel('Voltar')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⬅️')
            );

        await interaction.update({ embeds: [embed], components: [menu, backButton] });
    }
};