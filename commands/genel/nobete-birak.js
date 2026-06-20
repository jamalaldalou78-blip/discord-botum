const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nobete-birak')
        .setDescription('Nobetci muzik odasina 7/24 kesintisiz canli yayin baslatir.')
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Botun giris yapacagi ses kanalini secin kanka.')
                .addChannelTypes(ChannelType.GuildVoice) 
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('saat')
                .setDescription('Yayinin kac saat surecegini belirtin.')
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });

        const sesKanali = interaction.options.getChannel('kanal');
        const sureSaat = interaction.options.getInteger('saat');

        // %100 sorunsuz ve telifsiz direkt canlı radyo akış IP'si (YouTube kısıtlamalarına takılmaz)
        const garantiMuzikLink = "http://46.20.3.201:8030/;stream.mp3"; 

        try {
            await interaction.client.distube.play(sesKanali, garantiMuzikLink, {
                textChannel: interaction.channel,
                member: interaction.member,
                interaction: interaction
            });

            const nobetEmbed = new EmbedBuilder()
                .setColor('#2b2d31')
                .setTitle('🛡️ Nöbet Sistemi Aktif Edildi!')
                .setDescription(`Bot başarıyla <#${sesKanali.id}> odasına giriş yaptı ve nöbet yayını başlatıldı!`)
                .addFields(
                    { name: '⏳ Planlanan Süre', value: `\`${sureSaat} Saat\``, inline: true },
                    { name: '🎵 Yayın Türü', value: '`7/24 Kesintisiz Radyo` 📻', inline: true }
                )
                .setFooter({ text: 'Wolf Nöbet Modu • Sistem tıkır tıkır işliyor.' })
                .setTimestamp();

            return interaction.editReply({ embeds: [nobetEmbed] });

        } catch (error) {
            console.error("💥 Nöbet komutunda kritik hata oluştu:", error);
            
            return interaction.editReply({ 
                content: `❌ **Müzik motoru başlatılırken bir sorun oluştu!**\n> **Hata Detayı:** \`${error.message || error}\`\n\nLütfen botun ses kanalına girme yetkilerini kontrol et kanka.` 
            });
        }
    }
};