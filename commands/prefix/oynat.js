module.exports = {
    name: 'oynat',
    execute(message, args) {
        const query = args.join(' ');
        if (!query) return message.reply('❌ Ne çalmamı istersin?');
        if (!message.member.voice.channel) return message.reply('❌ Önce ses kanalına girmelisin!');
        
        message.client.distube.play(message.member.voice.channel, query, {
            member: message.member,
            textChannel: message.channel,
            message
        });
        message.react('✅'); // İşlem başladığında tepki ekle
    }
};