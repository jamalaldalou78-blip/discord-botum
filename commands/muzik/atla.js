const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('atla') // Türkçe karakter yok!
        .setDescription('Sırada şarkı varsa bir sonrakine geçer.'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: '🛑 Bu komutu kullanmak için ses kanalında olmalısın kanka!', ephemeral: true });
        }

        const queue = interaction.client.distube.getQueue(interaction.guildId);

        if (!queue) {
            return interaction.reply({ content: '🎵 Şu anda çalan bir şarkı veya sırada bekleyen bir liste yok kral!', ephemeral: true });
        }

        try {
            await queue.skip();
            return interaction.reply({ content: '⏭️ Sıradaki şarkıya başarıyla atlandı kral!' });
        } catch (error) {
            return interaction.reply({ content: '💥 Sırada atlanacak başka şarkı yok kanka!', ephemeral: true });
        }
    },
};