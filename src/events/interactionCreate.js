import { Events } from 'discord.js';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buttonHandlers = new Map();
const selectMenuHandlers = new Map();

async function loadHandlers() {
    const buttonsPath = path.join(__dirname, '..', 'interactions', 'buttons');
    const buttonFiles = await fs.readdir(buttonsPath);
    for (const file of buttonFiles.filter(f => f.endsWith('.js'))) {
        const filePath = path.join(buttonsPath, file);
        const module = await import(pathToFileURL(filePath));
        buttonHandlers.set(module.default.key, module.default);
    }

    const selectsPath = path.join(__dirname, '..', 'interactions', 'selects');
    const selectFiles = await fs.readdir(selectsPath);
    for (const file of selectFiles.filter(f => f.endsWith('.js'))) {
        const filePath = path.join(selectsPath, file);
        const module = await import(pathToFileURL(filePath));
        selectMenuHandlers.set(module.default.key, module.default);
    }
    console.log(`[CARREGADOR] -> ${buttonHandlers.size} handlers de botão e ${selectMenuHandlers.size} de menus carregados.`);
}
loadHandlers();

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (command) await command.execute(interaction).catch(console.error);
        }
        else if (interaction.isButton()) {
            const handler = buttonHandlers.get(interaction.customId);
            if (handler) await handler.execute(interaction).catch(console.error);
        }
        else if (interaction.isAnySelectMenu()) {
            let handler;
            if (interaction.customId.startsWith('final_channel_select')) {
                handler = selectMenuHandlers.get('final_channel_select');
            } else {
                handler = selectMenuHandlers.get(interaction.customId);
            }
            if (handler) await handler.execute(interaction).catch(console.error);
        }
    },
};