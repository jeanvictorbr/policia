import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { prisma } from '../../utils/database.js';

export default {
    key: 'configure_garrison_themes',
    async execute(interaction) {
        const config = await prisma.guildConfig.findUnique({
            where: { guild_id: interaction.guild.id },
            select: { theme_config_password: true }
        });

        // Se NÃO existir uma senha, mostra o modal para CRIAR uma
        if (!config || !config.theme_config_password) {
            const createPasswordModal = new ModalBuilder()
                .setCustomId('create_theme_password_modal')
                .setTitle('Criar Senha de Acesso ao Painel');

            const newPasswordInput = new TextInputBuilder().setCustomId('new_password').setLabel('Digite a nova senha').setStyle(TextInputStyle.Short).setMinLength(4).setMaxLength(20).setRequired(true);
            const confirmPasswordInput = new TextInputBuilder().setCustomId('confirm_password').setLabel('Confirme a nova senha').setStyle(TextInputStyle.Short).setMinLength(4).setMaxLength(20).setRequired(true);
            
            createPasswordModal.addComponents(
                new ActionRowBuilder().addComponents(newPasswordInput),
                new ActionRowBuilder().addComponents(confirmPasswordInput)
            );

            return await interaction.showModal(createPasswordModal);
        }

        // Se JÁ EXISTIR uma senha, mostra o modal para DIGITAR
        const enterPasswordModal = new ModalBuilder()
            .setCustomId('enter_theme_password_modal')
            .setTitle('Acesso ao Painel de Temas');
        
        const passwordInput = new TextInputBuilder().setCustomId('password').setLabel('Digite a senha para continuar').setStyle(TextInputStyle.Short).setRequired(true);

        enterPasswordModal.addComponents(new ActionRowBuilder().addComponents(passwordInput));
        await interaction.showModal(enterPasswordModal);
    }
};