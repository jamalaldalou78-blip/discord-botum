const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('durdur') // Türkçe karakter yok!
        .setDescription('Müziği tamamen durdurur ve botu kanaldan çıkarır.'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: '🛑 Bu komutu kullanmak için ses kanalında olmalısın kanka!', ephemeral: true });
        }

        const queue = interaction.client.distube.getQueue(interaction.guildId);

        if (!queue) {
            return interaction.reply({ content: '🎵 Zaten şu anda çalan bir müzik yok kral!', ephemeral: true });
        }

        try {
            await queue.stop();
            return interaction.reply({ content: '⏹️ Müzik tamamen durduruldu, liste temizlendi ve oda kapatıldı!' });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '💥 Müziği durdururken bir hata yaşandı!', ephemeral: true });
        }
    },
};