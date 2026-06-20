const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('istatistik')
        .setDescription('Botun çalışma durumunu gösterir.'),
    async execute(interaction) {
        const uptime = process.uptime();
        const seconds = Math.floor(uptime % 60);
        const minutes = Math.floor((uptime / 60) % 60);
        const hours = Math.floor((uptime / 3600) % 24);
        
        await interaction.reply(`🤖 Bot ${hours} saat, ${minutes} dakika, ${seconds} saniyedir ayakta!\nPing: ${interaction.client.ws.ping}ms`);
    },
};