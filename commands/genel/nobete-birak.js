const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nobete-birak')
        .setDescription('Nöbetçi müzik odasına 7/24 kesintisiz canlı yayın başlatır.')
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Botun giriş yapacağı ses kanalını seçin kanka.')
                // SADECE ses kanallarının seçilebilmesini zorunlu kılıyoruz:
                .addChannelTypes(ChannelType.GuildVoice) 
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('saat')
                .setDescription('Yayının kaç saat süreceğini belirtin.')
                .setRequired(true)
        ),

    async execute(interaction) {
        // Discord'un 3 saniye kuralına takılmamak için süreyi uzatıyoruz (Uygulama yanıt vermedi hatasını önler)
        await interaction.deferReply({ ephemeral: false });

        const sesKanali = interaction.options.getChannel('kanal');
        const sureSaat = interaction.options.getInteger('saat');

        // Arka planda çalacak garanti ve kesintisiz müzik linki (7/24 Radyo)
        const garantiMuzikLink = "https://www.youtube.com/watch?v=jfKfPfyJRdk"; 

        try {
            // DisTube motorunu tetikliyoruz ve direkt linki veriyoruz
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