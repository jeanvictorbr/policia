import bcrypt from 'bcrypt';
import { prisma } from '../../utils/database.js';

export default {
    key: 'create_theme_password_modal',
    async execute(interaction) {
        const newPassword = interaction.fields.getTextInputValue('new_password');
        const confirmPassword = interaction.fields.getTextInputValue('confirm_password');

        if (newPassword !== confirmPassword) {
            return interaction.reply({ content: '❌ As senhas não coincidem. Tente novamente.', ephemeral: true });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        try {
            // MUDANÇA AQUI: de 'update' para 'upsert'
            await prisma.guildConfig.upsert({
                where: { guild_id: interaction.guild.id },
                update: { theme_config_password: hashedPassword },
                create: { 
                    guild_id: interaction.guild.id,
                    theme_config_password: hashedPassword 
                }
            });

            await interaction.reply({ content: '✅ Senha criada com segurança! Clique no cadeado novamente para acessar o painel.', ephemeral: true });
        } catch (error) {
            console.error("Erro ao salvar senha:", error);
            await interaction.reply({ content: '❌ Ocorreu um erro ao salvar a senha.', ephemeral: true });
        }
    }
};