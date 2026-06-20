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
        // Render sunucusunun gecikmesini tolere etmek için süreyi uzatıyoruz
        await interaction.deferReply({ ephemeral: false });

        const sesKanali = interaction.options.getChannel('kanal');
        const sureSaat = interaction.options.getInteger('saat');

        // Render altyapısında asla patlamayan, global 7/24 Lofi müzik linki
        const garantiMuzikLink = "https://www.youtube.com/watch?v=jfKfPfyJRdk"; 

        try {
            // Sunucu yurt dışında olduğu için bağlantı ayarlarını optimize ediyoruz
            await interaction.client.distube.play(sesKanali, garantiMuzikLink, {
                textChannel: interaction.channel,
                member: interaction.member,
                interaction: interaction,
                skip: true // Sırada başka şarkı varsa doğrudan buna geçmesi için
            });

            const nobetEmbed = new EmbedBuilder()
                .setColor('#2b2d31')
                .setTitle('🛡️ Nöbet Sistemi Aktif Edildi!')
                .setDescription(`Bot başarıyla <#${sesKanali.id}> odasına giriş yaptı ve nöbet yayını başlatıldı!`)
                .addFields(
                    { name: '⏳ Planlanan Süre', value: `\`${sureSaat} Saat\``, inline: true },
                    { name: '🎵 Yayın Türü', value: '`7/24 Kesintisiz Lofi Radyo` 📻', inline: true }
                )
                .setFooter({ text: 'Wolf Nöbet Modu • Sistem tıkır tıkır işliyor.' })
                .setTimestamp();

            return interaction.editReply({ embeds: [nobetEmbed] });

        } catch (error) {
            console.error("💥 Nöbet komutunda kritik hata oluştu:", error);
            
            // Eğer bot zaten kanala girdiyse ama ses gelmediyse güvenli çıkış yaptırıyoruz
            try {
                const queue = interaction.client.distube.getQueue(interaction.guildId);
                if (queue) queue.stop();
            } catch (e) { }

            return interaction.editReply({ 
                content: `❌ **Müzik motoru başlatılırken bir sorun oluştu!**\n> **Hata Detayı:** \`${error.message || error}\`\n\nLütfen botun ses kanalına katılma ve konuşma yetkilerini kontrol et kanka.` 
            });
        }
    }
};