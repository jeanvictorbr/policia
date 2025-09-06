import bcrypt from 'bcrypt';
import { prisma } from '../../utils/database.js';

export default {
    key: 'enter_theme_password_modal',
    async execute(interaction) {
        const submittedPassword = interaction.fields.getTextInputValue('password');
        
        const config = await prisma.guildConfig.findUnique({
            where: { guild_id: interaction.guild.id },
            select: { theme_config_password: true }
        });

        // Se por algum motivo a senha não existir mais, avisa o usuário.
        if (!config || !config.theme_config_password) {
            return interaction.reply({ content: '⚠️ Nenhuma senha encontrada. Clique no cadeado para criar uma.', ephemeral: true });
        }

        // Compara a senha digitada com a senha criptografada no banco
        const isMatch = bcrypt.compareSync(submittedPassword, config.theme_config_password);

        if (isMatch) {
            // Placeholder para o próximo passo
            await interaction.reply({ content: '✅ Acesso concedido! O painel de gerenciamento de temas apareceria aqui.', ephemeral: true });
        } else {
            await interaction.reply({ content: '❌ Senha incorreta.', ephemeral: true });
        }
    }
};