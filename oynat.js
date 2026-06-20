module.exports = {
    name: 'oynat', // Ana komut adı
    aliases: ['p', 'çal', 'play'], // ✅ w!p yazdığında artık burası çalışacak
    description: 'Şarkı oynatır.',
    
    async execute(message, args, client) {
        const query = args.join(' ');
        
        // Kullanıcı bir şey yazmış mı?
        if (!query) return message.reply('❌ Ne çalmamı istersin kanka?');
        
        // Kullanıcı ses kanalında mı?
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('❌ Önce ses kanalına girmelisin!');
        
        try {
            // Müzik çalma işlemi
            await client.distube.play(voiceChannel, query, {
                member: message.member,
                textChannel: message.channel,
                message: message
            });
            
            message.react('✅').catch(() => {});
        } catch (error) {
            console.error('💥 [Oynatma Hatası]:', error);
            message.reply('❌ Şarkı oynatılırken bir hata oluştu!');
        }
    }
};