import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { createMainMenu } from '../utils/panel_utils.js';

export const data = new SlashCommandBuilder()
    .setName('painel_config')
    .setDescription('Abre o painel de configuração do PoliceFlow.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
    const mainMenu = createMainMenu();
    await interaction.reply(mainMenu);
}