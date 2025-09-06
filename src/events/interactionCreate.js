import { Events } from 'discord.js';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Carregadores Dinâmicos de Handlers ---
// Criamos "mapas" para armazenar as funções de cada tipo de interação
const buttonHandlers = new Map();
const selectMenuHandlers = new Map();
const modalHandlers = new Map();

// Esta função é executada uma vez quando o bot inicia, lendo todos os arquivos de handler
async function loadHandlers() {
    // Carrega os handlers de Botão
    const buttonsPath = path.join(__dirname, '..', 'interactions', 'buttons');
    const buttonFiles = await fs.readdir(buttonsPath);
    for (const file of buttonFiles.filter(f => f.endsWith('.js'))) {
        const module = await import(pathToFileURL(path.join(buttonsPath, file)));
        buttonHandlers.set(module.default.key, module.default);
    }

    // Carrega os handlers de Menu de Seleção
    const selectsPath = path.join(__dirname, '..', 'interactions', 'selects');
    const selectFiles = await fs.readdir(selectsPath);
    for (const file of selectFiles.filter(f => f.endsWith('.js'))) {
        const module = await import(pathToFileURL(path.join(selectsPath, file)));
        selectMenuHandlers.set(module.default.key, module.default);
    }
    
    // Carrega os handlers de Modal (Formulário)
    const modalsPath = path.join(__dirname, '..', 'interactions', 'modals');
    const modalFiles = await fs.readdir(modalsPath);
    for (const file of modalFiles.filter(f => f.endsWith('.js'))) {
        const module = await import(pathToFileURL(path.join(modalsPath, file)));
        modalHandlers.set(module.default.key, module.default);
    }

    console.log(`[CARREGADOR] -> ${buttonHandlers.size} handlers de botão, ${selectMenuHandlers.size} de menus e ${modalHandlers.size} de modais carregados.`);
}
loadHandlers();

// --- Evento Principal de Interação ---
export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Roteador para Comandos de Barra (/)
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (command) await command.execute(interaction).catch(console.error);
        } 
        // Roteador para Botões
        else if (interaction.isButton()) {
            // Esta lógica inteligente separa o ID base dos argumentos extras
            // Ex: "aprovar_alistamento:USER_ID:NOME:ID" vira key="aprovar_alistamento" e args=["USER_ID", "NOME", "ID"]
            const [key, ...args] = interaction.customId.split(':');
            const handler = buttonHandlers.get(key);
            if (handler) await handler.execute(interaction, args).catch(console.error);
        } 
        // Roteador para TODOS os Menus de Seleção (String, Role, User, etc.)
        else if (interaction.isAnySelectMenu()) {
            let handler;
            // Lógica especial para IDs dinâmicos, se necessário
            if (interaction.customId.startsWith('final_channel_select')) {
                handler = selectMenuHandlers.get('final_channel_select');
            } else {
                // Lógica padrão para IDs estáticos (como 'recrutador_selecionado')
                handler = selectMenuHandlers.get(interaction.customId);
            }
            if (handler) await handler.execute(interaction).catch(console.error);
        }
        // Roteador para Envios de Modal (Formulário)
        else if (interaction.isModalSubmit()) {
            // Lógica para lidar com IDs dinâmicos, como o do alistamento
            // Ex: "ficha_alistamento_modal:RECRUITER_ID" vira key="ficha_alistamento_modal"
            const [key] = interaction.customId.split(':');
            const handler = modalHandlers.get(key);
            if (handler) await handler.execute(interaction).catch(console.error);
        }
    },
};