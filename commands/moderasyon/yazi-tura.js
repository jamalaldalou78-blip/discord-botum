const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yazi-tura')
        .setDescription('Yazi mi tura mi?'), // Türkçe karakterleri kaldırdım
    async execute(interaction) {
        const sonuc = Math.random() < 0.5 ? 'Yazi' : 'Tura';
        await interaction.reply(`Sonuc: **${sonuc}** geldi!`);
    },
};