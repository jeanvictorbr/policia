import { REST, Routes } from 'discord.js';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url'; // Adicionada a importação de pathToFileURL

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    // MUDANÇA IMPORTANTE AQUI:
    const command = await import(pathToFileURL(path.join(commandsPath, file)));
    commands.push(command.data.toJSON());
}

if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID || !process.env.GUILD_ID) {
    throw new Error("Variáveis de ambiente (TOKEN, CLIENT_ID, GUILD_ID) não foram definidas!");
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`🚀 Iniciando o registro de ${commands.length} comandos (/) de aplicação.`);
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );
        console.log(`✅ ${data.length} comandos (/) foram registrados com sucesso.`);
    } catch (error) {
        console.error(error);
    }
})();