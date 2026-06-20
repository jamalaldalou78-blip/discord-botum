module.exports = {
    name: 'durdur',
    aliases: ['s', 'stop', 'kapat'], // İşte w!s yazınca çalışmasını sağlayan kısaltmalar
    async execute(message, args) {
        const olumluEmoji = "<a:wolfonay:1517197503345328430>";
        const olumsuzEmoji = "<a:wolfhayir:1517203345385984150>";

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply(`${olumsuzEmoji} Bu komutu kullanmak için ses kanalında olmalısın kanka!`);
        }

        const queue = message.client.distube.getQueue(message);
        if (!queue) {
            return message.reply(`${olumsuzEmoji} Şu anda zaten çalan bir müzik yok kral!`);
        }

        try {
            await queue.stop();
            // reply yerine channel.send yaparak havada asılı kalan silinmiş mesaj ibaresini engelledik:
            message.channel.send(`${olumluEmoji} Müzik tamamen durduruldu, liste temizlendi ve oda kapatıldı!`);
            message.delete().catch(() => {}); // Komut mesajını siler
        } catch (error) {
            console.error(error);
            message.reply(`${olumsuzEmoji} Müziği durdururken bir hata yaşandı!`);
        }
    }
};