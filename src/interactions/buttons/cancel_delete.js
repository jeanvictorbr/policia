export default {
    key: 'cancel_delete',
    async execute(interaction) {
        // Simplesmente deleta a mensagem de confirmação.
        await interaction.message.delete();
    }
};