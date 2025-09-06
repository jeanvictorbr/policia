import { Events } from 'discord.js';

export default {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        if (!client.user) {
            console.error("[ERRO] Usuário do cliente não encontrado ao ficar pronto.");
            return;
        }
        console.log(`\n✅ Logado com sucesso como ${client.user.tag}!`);
        console.log(`🚀 PoliceFlow está online e pronto para operar.`);
    },
};