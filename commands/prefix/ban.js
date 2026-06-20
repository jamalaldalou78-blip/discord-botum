module.exports = {
    name: 'ban',
    execute(message, args) {
        if (!message.member.permissions.has('BanMembers')) return message.reply('❌ Yetkin yok!');
        const member = message.mentions.members.first();
        if (!member) return message.reply('❌ Banlanacak kişiyi etiketle.');
        
        member.ban().then(() => message.reply(`🔨 **${member.user.tag}** sunucudan banlandı.`))
            .catch(() => message.reply('❌ Bu kişiyi banlayamadım (yetkim yetmiyor olabilir).'));
    }
};