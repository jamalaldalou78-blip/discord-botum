const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nobete-birak')
        .setDescription('Nöbetçi müzik odasına 7/24 kesintisiz canlı yayın yayını başlatır.')
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Botun giriş yapacağı ses kanalını seçin kanka.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('saat')
                .setDescription('Yayının kaç saat süreceğini belirtin.')
                .setRequired(true)
        ),

    async execute(interaction) {
        // İlk iş olarak Discord etkileşim süresini uzatıyoruz, böylece "Uygulama yanıt vermedi" hatası tarih oluyor.
        await interaction.deferReply({ ephemeral: false });

        const sesKanali = interaction.options.getChannel('kanal');
        const sureSaat = interaction.options.getInteger('saat');

        // Seçilen kanalın gerçekten bir ses kanalı olup olmadığını kontrol ediyoruz
        if (!sesKanali.isVoiceBased()) {
            return interaction.editReply({ content: '❌ Lütfen geçerli bir **ses kanalı** seç kanka!' });
        }

        // Arka planda çalacak ve asla telif/çökme sorunu yaratmayacak, doğrudan taranabilir garanti bir müzik linki
        // DisTube bazen düz arama kelimelerinde hata verebildiği için buraya doğrudan çalışan bir URL koyuyoruz
        const garantiMuzikLink = "https://www.youtube.com/watch?v=jfKfPfyJRdk"; 

        try {
            // DisTube motorunu tetikliyoruz ve ses kanalına gönderiyoruz
            await interaction.client.distube.play(sesKanali, garantiMuzikLink, {
                textChannel: interaction.channel,
                member: interaction.member,
                interaction: interaction
            });

            // Başarılı olursa kanala şık bir embed gönderiyoruz
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
            
            // Kullanıcıya hatanın detayını kibarca bildiren sistem
            return interaction.editReply({ 
                content: `❌ **Müzik motoru başlatılırken bir sorun oluştu!**\n> **Hata Detayı:** \`${error.message || error}\`\n\nLütfen botun ses kanalına girme ve konuşma yetkilerinin tam olduğunu kontrol et kanka.` 
            });
        }
    }
};
// tes

