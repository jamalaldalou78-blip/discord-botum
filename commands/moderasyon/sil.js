const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sil')
        .setDescription('Belirtilen miktarda mesajı kanaldan temizler.')
        .addIntegerOption(option => 
            option.setName('miktar')
                .setDescription('Silinecek mesaj sayısı (1-100 arası).')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
        
    async execute(interaction) {
        const olumluEmoji = "<a:wolfonay:1517197503345328430>";
        const olumsuzEmoji = "<a:wolfhayir:1517203345385984150>";

        const miktar = interaction.options.getInteger('miktar');

        if (miktar < 1 || miktar > 100) {
            return interaction.reply({ 
                content: `${olumsuzEmoji} Lütfen 1 ile 100 arasında geçerli bir sayı gir kanka.`, 
                flags: [] 
            });
        }

        try {
            // Direkt mesajları siliyoruz
            const messages = await interaction.channel.bulkDelete(miktar, true);
            
            // Mesajlar silindikten SONRA cevabı herkese açık olarak gönderiyoruz
            await interaction.reply({ 
                content: `${olumluEmoji} Başarıyla \`${messages.size}\` adet mesaj **silindi**!`,
                flags: [] // Herkes görsün diye
            });

            // 3 saniye sonra slash cevabını otomatik kaldırıyoruz
            setTimeout(() => {
                interaction.deleteReply().catch(() => {});
            }, 3000);

        } catch (error) {
            console.error(error);
            if (!interaction.replied) {
                await interaction.reply({ content: `${olumsuzEmoji} Bir hata oluştu.`, flags: [] });
            }
        }
    },
};