module.exports = {
    name: 'kick',
    execute(message, args) {
        if (!message.member.permissions.has('KickMembers')) return message.reply('❌ Yetkin yok!');
        const member = message.mentions.members.first();
        if (!member) return message.reply('❌ Atılacak kişiyi etiketle.');
        
        member.kick().then(() => message.reply(`👢 **${member.user.tag}** sunucudan atıldı.`))
            .catch(() => message.reply('❌ Bu kişiyi atamadım.'));
    }
};