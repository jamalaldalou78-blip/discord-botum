const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rusruleti')
        .setDescription('Sadece özel role sahip olanların katılabileceği ölümcül kumar!'),
    async execute(interaction) {
        const user = interaction.user;
        const member = interaction.member;

        // 🆔 KOPYALADIĞIN ROL ID'Sİ EKLENDİ!
        const ozelRolID = "1516398067761418371"; 

        // Kullanıcıda o ID'ye sahip rol var mı kontrol ediyoruz
        const rolKontrol = member.roles.cache.has(ozelRolID);

        // EĞER ROLÜ YOKSA MASAYA OTURAMAZ!
        if (!rolKontrol) {
            const yetkisizEmbed = new EmbedBuilder()
                .setColor('#ffaa00')
                .setTitle('🛑 HOP GÜZEL KARDEŞİM, ORDA DUR!')
                .setDescription(`Bu masaya sadece özel lakaba/role sahip olan has adamlar oturabilir.\n\nSonunu düşünüyorsan bu tetiği çekmeye kalkma, git önce yukardan rolünü kap gel! 📿`)
                .setFooter({ text: 'Racon masasına destursuz girilmez.' });

            return interaction.reply({ embeds: [yetkisizEmbed], ephemeral: true });
        }

        // ROLÜ VARSA OYUN BAŞLAR:
        const tetik = Math.floor(Math.random() * 6) + 1;
        const mermi = 3; 

        const donmeEmbed = new EmbedBuilder()
            .setColor('#1a1a1a')
            .setTitle('🔫 ÖLÜMCÜL MASADASIN...')
            .setDescription(`**${user.username}** silahı şakağına dayadı... Gözler karardı, hazne dönüyor... 🎲`)
            .setTimestamp();

        await interaction.reply({ embeds: [donmeEmbed] });

        // 2 saniye heyecan gecikmesi
        setTimeout(async () => {
            // KAYBETTİ
            if (tetik === mermi) {
                let muteHata = false;

                try {
                    await member.timeout(60000, 'Rus ruletinde kaybetti.');
                } catch (error) {
                    muteHata = true;
                }

                const kayipEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('💥 GÜÜÜM! MASADAN BİR KİŞİ EKSİLDİ!')
                    .setDescription(`**${user.username}** sonunu düşünmedi ve mermi patladı! ${muteHata ? '\n\n*(Yetkim yetmedi ama masada kanın döküldü say kanka!)*' : '\n\n**1 dakika boyunca sesin kesildi. Geçmiş olsun ağa...** 🤫'}`)
                    .setFooter({ text: 'Sonunu düşünen kahraman olamazdı...' })
                    .setTimestamp();

                return interaction.editReply({ embeds: [kayipEmbed] });
            } 
            
            // KAZANDI
            else {
                const kazancEmbed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('🎯 *TIK!* BOŞ ÇIKTI!')
                    .setDescription(`**${user.username}** masadan bir kez daha devrilmeden kalktı! Tetik çekildi ama hazne boştu. Raconun sürüyor kral! 😎📿`)
                    .setFooter({ text: 'Şansın yaver gitti.' })
                    .setTimestamp();

                return interaction.editReply({ embeds: [kazancEmbed] });
            }
        }, 2000);
    },
};