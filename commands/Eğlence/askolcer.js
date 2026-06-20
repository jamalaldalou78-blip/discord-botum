const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('askolcer')
        .setDescription('Belirtilen iki kişi arasındaki uyumu profesyonelce ölçer.')
        .addUserOption(option => 
            option.setName('hedef1')
                .setDescription('Uyumunu ölçmek istediğin ilk kişiyi seç.')
                .setRequired(true))
        .addUserOption(option => 
            option.setName('hedef2')
                .setDescription('Uyumunu ölçmek istediğin ikinci kişiyi seç (Boş bırakırsan kendinle ölçer).')
                .setRequired(false)),
    async execute(interaction) {
        const hedef1 = interaction.options.getUser('hedef1');
        const hedef2 = interaction.options.getUser('hedef2') || interaction.user;

        if (hedef1.id === interaction.client.user.id || hedef2.id === interaction.client.user.id) {
            return interaction.reply({ content: '🤖 Yapay zekanın aşkı kodlardan ibarettir kanka, beni bu işlere karıştırma!', ephemeral: true });
        }

        const oran = Math.floor(Math.random() * 101);

        const doluKalpSayisi = Math.round(oran / 10);
        const bosKalpSayisi = 10 - doluKalpSayisi;
        const kalpBari = "❤️".repeat(doluKalpSayisi) + "🖤".repeat(bosKalpSayisi);

        let durumBasligi = "";
        let durumMesaji = "";
        let gifLink = "";
        let embedRenk = "#ffffff";

        // Discord'un %100 sorunsuz okuduğu resmi 'media.giphy.com' CDN linkleri yerleştirildi
        if (oran >= 0 && oran <= 20) {
            durumBasligi = "🥶 KUTUP SOĞUKLUĞU / TOKSİK İLİŞKİ";
            durumMesaji = `Aralarında tam bir soğuk savaş dönüyor. Yan yana gelseler kıvılcım bile çıkmaz, direkt buz keser! Arkana bakmadan kaç kanka.`;
            gifLink = "https://media.giphy.com/media/HteV6g0QTNqs6OPv2O/giphy.gif"; 
            embedRenk = "#4a5568"; 
        } 
        else if (oran >= 21 && oran <= 50) {
            durumBasligi = "🤝 FRIENDZONE / SADECE ARKADAŞIZ";
            durumMesaji = `Buradan öteye köy olmaz kanka. "Sen çok iyi birisin ama kardeşiz" cümlesinin tam karşılığı burası. Temiz bir kanka tokalaşması gider.`;
            gifLink = "https://media.giphy.com/media/XpgNRe2xgUknB27TVB/giphy.gif"; 
            embedRenk = "#3182ce"; 
        } 
        else if (oran >= 51 && oran <= 80) {
            durumBasligi = "👀 BİR ŞEYLER OLUYOR / TATLI KIVILCIM";
            durumMesaji = `Gözler birbirini arıyor, mesajlara hızlı cevaplar veriliyor gibi! Ortada temiz bir elektrik var, ufak bir adımla her şey ciddiye binebilir.`;
            gifLink = "https://media.giphy.com/media/l3q2Nz76S9bI9XPt6/giphy.gif"; 
            embedRenk = "#ed64a6"; 
        } 
        else if (oran >= 81 && oran <= 99) {
            durumBasligi = "💖 BÜYÜK AŞK / YIKILMAZ İKİLİ";
            durumMesaji = `Maşallah! Sunucunun en sağlam çifti/ikilisi olmaya adaylar. Birbirleri olmadan canları sıkılıyor, aralarındaki bağ beton gibi sağlam.`;
            gifLink = "https://media.giphy.com/media/v8qFmR9jWzCiA/giphy.gif"; 
            embedRenk = "#e53e3e"; 
        } 
        else if (oran === 100) {
            durumBasligi = "👑 RUH İKİZİ / KADERİN CİLVESİ!";
            durumMesaji = `YOK BÖYLE BİR UYUM! %100 çıktı şaka gibi! Bu iki isim resmen birbirleri için yaratılmış. Nikah dairesinden gün alın, sunucuda düğün var!`;
            gifLink = "https://media.giphy.com/media/26hpq36zP6730vaU0/giphy.gif"; 
            embedRenk = "#ff007f"; 
        }

        const askEmbed = new EmbedBuilder()
            .setColor(embedRenk)
            .setTitle('💘 GELİŞMİŞ UYUM ANALİZİ')
            .setDescription(`**${hedef1.username}** ile **${hedef2.username}** arasındaki kalbi durumlar masaya yatırıldı!`)
            .addFields(
                { name: '📊 Skor', value: `\`%${oran}\``, inline: true },
                { name: '📈 Durum', value: `\`${durumBasligi}\``, inline: true },
                { name: '📋 Analiz Raporu', value: `${durumMesaji}` },
                { name: '⚡ Aşk Grafiği', value: `${kalpBari}` }
            )
            .setImage(gifLink) 
            .setFooter({ text: `${interaction.user.tag} tarafından ölçüldü.`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [askEmbed] });
    },
};