import { Events } from 'discord.js';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregadores de Handlers
const buttonHandlers = new Map();
const selectMenuHandlers = new Map();
const modalHandlers = new Map();

async function loadHandlers() {
    // Botões
    const buttonsPath = path.join(__dirname, '..', 'interactions', 'buttons');
    const buttonFiles = await fs.readdir(buttonsPath);
    for (const file of buttonFiles.filter(f => f.endsWith('.js'))) {
        const module = await import(pathToFileURL(path.join(buttonsPath, file)));
        buttonHandlers.set(module.default.key, module.default);
    }

    // Select Menus
    const selectsPath = path.join(__dirname, '..', 'interactions', 'selects');
    const selectFiles = await fs.readdir(selectsPath);
    for (const file of selectFiles.filter(f => f.endsWith('.js'))) {
        const module = await import(pathToFileURL(path.join(selectsPath, file)));
        selectMenuHandlers.set(module.default.key, module.default);
    }
    
    // Modals
    const modalsPath = path.join(__dirname, '..', 'interactions', 'modals');
    const modalFiles = await fs.readdir(modalsPath);
    for (const file of modalFiles.filter(f => f.endsWith('.js'))) {
        const module = await import(pathToFileURL(path.join(modalsPath, file)));
        modalHandlers.set(module.default.key, module.default);
    }

    console.log(`[CARREGADOR] -> ${buttonHandlers.size} handlers de botão, ${selectMenuHandlers.size} de menus e ${modalHandlers.size} de modais carregados.`);
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
            // Lógica de IDs dinâmicos para aprovar/recusar
            const [key, ...args] = interaction.customId.split(':');
            const handler = buttonHandlers.get(key);
            if (handler) await handler.execute(interaction, args).catch(console.error);
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
        else if (interaction.isModalSubmit()) {
            const handler = modalHandlers.get(interaction.customId);
            if (handler) await handler.execute(interaction).catch(console.error);
        }
    },
};