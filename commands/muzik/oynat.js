module.exports = {
    name: 'oynat',
    aliases: ['p', 'play'], // w!p veya w!play yazınca da çalışmasını sağlayan kısaltmalar
    async execute(message, args) {
        const olumsuzEmoji = "<a:wolfhayir:1517203345385984150>";

        // Şarkı adını birleştiriyoruz
        const sarki = args.join(' ');
        if (!sarki) return message.reply(`${olumsuzEmoji} Kanka oynatmam için bir şarkı adı veya linki girmelisin.`);

        // Kullanıcının ses kanalında olup olmadığını kontrol ediyoruz
        const sesKanali = message.member.voice.channel;
        if (!sesKanali) return message.reply(`${olumsuzEmoji} Önce bir ses kanalına girmen lazım reis.`);

        try {
            // DisTube motoruna şarkıyı ve kanalı fırlatıyoruz
            await message.client.distube.play(sesKanali, sarki, {
                textChannel: message.channel,
                member: message.member,
                message: message
            });
            
            // Kullanıcının yazdığı w!oynat / w!p mesajını siliyoruz ki sohbet temiz kalsın
            message.delete().catch(() => {});

        } catch (error) {
            console.error(error);
            message.channel.send(`${olumsuzEmoji} Şarkı açılırken bir hata meydana geldi.`);
        }
    }
};