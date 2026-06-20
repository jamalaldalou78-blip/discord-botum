module.exports = {
    name: 'atla',
    execute(message, args) {
        const queue = message.client.distube.getQueue(message);
        if (!queue) return message.reply('❌ Şu an atlanacak bir müzik yok!');
        
        try {
            message.client.distube.skip(message);
            message.reply('⏭️ Şarkı başarıyla atlandı.');
        } catch (e) {
            console.error(e);
            message.reply('❌ Şarkı atlanırken bir hata oluştu (sıradaki şarkı olmayabilir).');
        }
    }
};