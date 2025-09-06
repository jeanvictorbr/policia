import { createGeneralConfigDashboard, createRecruitmentDashboard, createUniformsDashboard, createPromotionsDashboard } from '../../utils/uiBuilder.js';

export default {
    key: 'select_module',
    async execute(interaction) {
        // Avisa ao Discord que a interação foi recebida e que estamos processando.
        // Isso evita que a interação "expire" se a busca no banco de dados demorar um pouco.
        await interaction.deferUpdate();

        // Pega o valor da opção que o usuário escolheu no menu dropdown.
        // Ex: 'module_recruitment', 'module_general', etc.
        const selectedModule = interaction.values[0];

        let dashboard; // Variável que armazenará a interface a ser exibida

        // O "switch" funciona como um GPS, checando qual módulo foi escolhido
        // e chamando a função correta para construir o respectivo dashboard.
        switch (selectedModule) {
            case 'module_general':
                dashboard = await createGeneralConfigDashboard(interaction.guild.id);
                break;
            case 'module_recruitment':
                dashboard = await createRecruitmentDashboard(interaction.guild.id);
                break;
            case 'module_uniforms':
                dashboard = await createUniformsDashboard(interaction.guild.id);
                break;
            case 'module_promotions':
                dashboard = await createPromotionsDashboard(interaction.guild.id);
                break;
            default:
                // Caso algum valor inesperado apareça, envia uma mensagem de erro.
                dashboard = { content: 'Módulo não encontrado ou ainda não implementado.', embeds: [], components: [] };
        }
        
        // Edita a mensagem original para exibir o dashboard do módulo selecionado.
        await interaction.editReply(dashboard);
    }
};