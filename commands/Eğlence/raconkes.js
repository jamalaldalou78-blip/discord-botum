const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raconkes')
        .setDescription('Sunucuda ağırlığını koyup efsane bir racon sözü söyler.'),
    async execute(interaction) {
        // Senin eklediklerin ve eski efsane sözlerin birleşimi!
        const raconSozleri = [
            "Biz racon kesmeyiz, kafa keseriz!",
            "Kralına yol verdik, soytarısıyla mı uğraşacağız?",
            "Bizim dostluğumuz ağır abilerin kalbinde başlar, mezarda biter.",
            "Çakalların hürriyeti, aslan ayağa kalkana kadardır.",
            "Arkamdan konuşanların hayallerinde imzam var kanka.",
            "Biz ölmeyi çoktan göze aldık da, yanımızda kimleri götüreceğiz onu düşünüyoruz.",
            "Geçmişi arkamda bıraktım, önüme çıkanın vay haline!",
            "Kaderimizde varsa genç yaşta kefen giymek; raconumuz olsun bu alemde dik yürümek!",
            "Gölgesinden korkan güneşe racon kesmesin.",
            "İhanetin nedeni olmaz, bedeli olur.",
            "Çekildik köşemize, çocuklar meydan sizin.",
            "Öfkeyle kalkarsam, zarar vermeden oturmam.",
            "Sonunu düşünen kahraman olamaz.",
            "Kime yürümeyi öğrettiysek bizi geçmeye çalıştı.",
            "Ateşle oynayan ya evini yakar, ya kendini…",
            "Onu hiç görmemek, onu başkasıyla görmekten iyidir."
        ];

        // Listeden rastgele bir söz seçiyoruz
        const rastgeleSoz = raconSozleri[Math.floor(Math.random() * raconSozleri.length)];

        // Havalı bir siyah-kırmızı embed mesajı
        const raconEmbed = new EmbedBuilder()
            .setColor('#1a1a1a')
            .setTitle('📿 RACON KESİLDİ!')
            .setDescription(`**"${rastgeleSoz}"**`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `${interaction.user.tag} ağırlığını koydu.`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [raconEmbed] });
    },
};