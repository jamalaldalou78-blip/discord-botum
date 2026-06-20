module.exports = {
    name: 'rol',
    async execute(message, args) {
        // --- SENİN ÖZEL KURT EMOJİLERİN ---
        const olumluEmoji = "<a:wolfonay:1517197503345328430>"; 
        const olumsuzEmoji = "<a:wolfhayir:1517203345385984150>";

        // Komutu kullanan kişinin yetkisi var mı?
        if (!message.member.permissions.has('ManageRoles')) {
            return message.reply(`${olumsuzEmoji} Bu komutu kullanmak için **Rolleri Yönet** yetkine sahip olmalısın!`);
        }

        // Botun rol yetkisi var mı?
        if (!message.guild.members.me.permissions.has('ManageRoles')) {
            return message.reply(`${olumsuzEmoji} Benim **Rolleri Yönet** yetkim olmadığı için bu işlemi yapamıyorum.`);
        }

        // Kullanıcı ve Rol etiketlenmiş mi kontrol et
        const targetMember = message.mentions.members.first();
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);

        if (!targetMember) return message.reply(`${olumsuzEmoji} Lütfen bir kullanıcı etiketle. Örnek: \`w!rol @kullanıcı @rol\``);
        if (!role) return message.reply(`${olumsuzEmoji} Lütfen bir rol etiketle veya Rol ID\'si gir.`);

        // Rol hiyerarşisi kontrolü
        if (role.position >= message.guild.members.me.roles.highest.position) {
            return message.reply(`${olumsuzEmoji} Bu rol benim rollerimden daha üstte veya eşit olduğu için bu rolü yönetemiyorum!`);
        }

        try {
            // EĞER KULLANICIDA ROL VARSA: Rolü Kaldır
            if (targetMember.roles.cache.has(role.id)) {
                await targetMember.roles.remove(role);
                // İstediğin gibi "kaldırıldı" kelimesi yıldızlarla kalınlaştırıldı kanka:
                return message.reply(`${olumluEmoji} Kullanıcıdan rol başarıyla **kaldırıldı**!`);
            } 
            // EĞER KULLANICIDA ROL YOKSA: Rolü Ver
            else {
                await targetMember.roles.add(role);
                // İstediğin gibi "verildi" kelimesi yıldızlarla kalınlaştırıldı kanka:
                return message.reply(`${olumluEmoji} Kullanıcıya rol başarıyla **verildi**!`);
            }
        } catch (error) {
            console.error(error);
            return message.reply(`${olumsuzEmoji} Rol işlemi sırasında beklenmedik bir hata oluştu.`);
        }
    }
};