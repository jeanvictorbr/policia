import { prisma } from '../../utils/database.js';

export default {
    key: 'save_uniform_kit',
    async execute(interaction) {
        const name = interaction.fields.getTextInputValue('kit_name');
        const codes = interaction.fields.getTextInputValue('kit_codes');

        try {
            await prisma.uniformKit.create({
                data: {
                    name: name,
                    codes: codes,
                    guild_id: interaction.guild.id,
                }
            });
            
            // MUDANÇA AQUI: Remove a tentativa de editar o dashboard e apenas responde
            await interaction.reply({ content: `✅ O kit de fardamento **${name}** foi criado com sucesso! A lista será atualizada da próxima vez que você abrir o dashboard.`, ephemeral: true });

        } catch (error) {
            console.error('Erro ao criar kit de fardamento:', error);
            await interaction.reply({ content: '❌ Ocorreu um erro ao criar o kit.', ephemeral: true });
        }
    }
};