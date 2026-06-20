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
        // Hata almamak için öncelikli yanıt veriyoruz
        await interaction.deferReply({ ephemeral: false });

        const sesKanali = interaction.options.getChannel('kanal');
        
        // Render gibi sunucularda patlamayan, garanti canlı yayın linki
        const garantiMuzikLink = "https://www.youtube.com/watch?v=jfKfPfyJRdk"; 

        try {
            // DisTube üzerinden yayını başlat
            await interaction.client.distube.play(sesKanali, garantiMuzikLink, {
                textChannel: interaction.channel,
                member: interaction.member,
                interaction: interaction
            });

            const nobetEmbed = new EmbedBuilder()
                .setColor('#2b2d31')
                .setTitle('🛡️ Nöbet Sistemi Aktif Edildi!')
                .setDescription(`Bot <#${sesKanali.id}> kanalına giriş yaptı ve nöbet yayını başlatıldı!`)
                .setFooter({ text: 'Wolf Nöbet Modu • Sistem tıkır tıkır işliyor.' });

            return interaction.editReply({ embeds: [nobetEmbed] });

        } catch (error) {
            console.error("💥 Kritik Hata:", error);
            return interaction.editReply({ 
                content: `❌ **Yayın başlatılamadı!**\n> **Hata:** \`${error.message}\`\n\nBotun ses kanalına girme ve konuşma yetkisi olduğundan emin ol kanka.` 
            });
        }
    }
};