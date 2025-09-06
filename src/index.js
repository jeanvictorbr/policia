import { Client, GatewayIntentBits, Collection } from 'discord.js';
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url'; // Adicionada a importação de pathToFileURL

if (!process.env.DISCORD_TOKEN) {
    console.error("[ERRO FATAL] A variável DISCORD_TOKEN não foi encontrada no arquivo .env!");
    process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
        ]
    });

    client.commands = new Collection();

    // Carregador de Comandos
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = await fs.readdir(commandsPath);
    console.log('[CARREGADOR] Carregando comandos...');
    for (const file of commandFiles.filter(f => f.endsWith('.js'))) {
        const filePath = path.join(commandsPath, file);
        // MUDANÇA IMPORTANTE AQUI:
        const command = await import(pathToFileURL(filePath));
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`[CARREGADOR] -> Comando /${command.data.name} carregado.`);
        }
    }

    // Carregador de Eventos
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = await fs.readdir(eventsPath);
    console.log('\n[CARREGADOR] Registrando eventos...');
    for (const file of eventFiles.filter(f => f.endsWith('.js'))) {
        const filePath = path.join(eventsPath, file);
        // MUDANÇA IMPORTANTE AQUI:
        const event = await import(pathToFileURL(filePath));
        if (event.default && event.default.name) {
            if (event.default.once) {
                client.once(event.default.name, (...args) => event.default.execute(...args));
            } else {
                client.on(event.default.name, (...args) => event.default.execute(...args));
            }
            console.log(`[CARREGADOR] -> Evento ${event.default.name} registrado.`);
        }
    }
    
    console.log("\n[CLIENTE] Tudo carregado. Fazendo login no Discord...");
    await client.login(process.env.DISCORD_TOKEN);
}

main().catch(error => {
    console.error("[ERRO INESPERADO NA INICIALIZAÇÃO]", error);
});