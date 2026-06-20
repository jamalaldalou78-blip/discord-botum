module.exports = {
    name: 'timeout',
    execute(message, args) {
        if (!message.member.permissions.has('ModerateMembers')) return message.reply('❌ Yetkin yok!');
        const member = message.mentions.members.first();
        if (!member) return message.reply('❌ Kimi susturayım?');
        
        member.timeout(60000, 'Moderasyon tarafından susturuldu').then(() => message.reply(`🔇 **${member.user.tag}** 1 dakikalığına susturuldu.`))
            .catch(() => message.reply('❌ Susturma işlemi başarısız.'));
    }
};