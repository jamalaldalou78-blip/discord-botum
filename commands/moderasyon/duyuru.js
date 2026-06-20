const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duyuru')
        .setDescription('Botun ağzından sunucuya şık bir duyuru mesajı gönderir.')
        .addStringOption(option => 
            option.setName('metin')
                .setDescription('Duyuruya yazılacak mesajı girin.')
                .setRequired(true)) // Bu alan zorunlu
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Sadece Mesajları Yönet yetkisi olanlar kullanabilir
    async execute(interaction) {
        const duyuruMetni = interaction.options.getString('metin');

        // Şık kırmızı renkli bir duyuru kutusu tasarlıyoruz
        const embed = new EmbedBuilder()
            .setColor('#FF0000') // Kırmızı dikkat çeker
            .setTitle('📢 SUNUCU DUYURUSU')
            .setDescription(duyuruMetni)
            .setTimestamp() // Duyurunun atıldığı saati en alta ekler
            .setFooter({ text: `Duyuruyu Yapan: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        // Komutu yazan yetkiliye gizli bir "Başarılı" mesajı atıyoruz (ephemeral: true)
        await interaction.reply({ content: 'Duyuru kanalına mesaj başarıyla gönderildi kanka!', ephemeral: true });
        
        // Duyuruyu komutun yazıldığı kanala herkesin göreceği şekilde fırlatıyoruz
        await interaction.channel.send({ embeds: [embed] });
    },
};