const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB(); // Hafıza kartımızı tanımlıyoruz

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Kullanıcıya süreli olarak susturma (zaman aşımı) cezası verir.')
        .addUserOption(option => option.setName('kullanici').setDescription('Cezalandırılacak üye').setRequired(true))
        .addIntegerOption(option => option.setName('sure').setDescription('Süre seçin').setRequired(true)
            .addChoices(
                { name: '60 Saniye', value: 60 * 1000 },
                { name: '5 Dakika', value: 5 * 60 * 1000 },
                { name: '10 Dakika', value: 10 * 60 * 1000 },
                { name: '1 Saat', value: 60 * 60 * 1000 },
                { name: '1 Gün', value: 24 * 60 * 60 * 1000 },
                { name: '1 Hafta', value: 7 * 24 * 60 * 60 * 1000 }
            ))
        .addStringOption(option => option.setName('sebep').setDescription('Susturma nedeni').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
        
    async execute(interaction) {
        const user = interaction.options.getUser('kullanici');
        const sure = interaction.options.getInteger('sure');
        const sebep = interaction.options.getString('sebep') || 'Sebep belirtilmedi.';
        const member = interaction.guild.members.cache.get(user.id);

        // Kullanıcı kontrolü
        if (!member) {
            return interaction.reply({ content: '❌ Bu kullanıcı sunucuda bulunamadı.', ephemeral: true });
        }
        
        // Profesyonel Koruma Kontrolleri
        if (user.id === interaction.user.id) {
            return interaction.reply({ content: '❌ Kanka kendi kendini neden susturuyorsun? Yapma böyle şeyler.', ephemeral: true });
        }
        if (user.id === interaction.client.user.id) {
            return interaction.reply({ content: '❌ Beni susturursan sunucuyu kim koruyacak kanka? Ayıp ediyorsun.', ephemeral: true });
        }
        if (!member.moderatable) {
            return interaction.reply({ content: '❌ Bu kullanıcının rolü benden veya senden üstte! Onu cezalandıramam.', ephemeral: true });
        }
        
        try {
            // Susturma işlemini Discord'a gönderiyoruz
            await member.timeout(sure, sebep);
            
            // Cezayı kesen yetkilinin hafızadaki Mute sayısını 1 arttırıyoruz!
            await db.add(`yetkili_${interaction.member.id}_mute`, 1);
            
            // Seçilen milisaniyeyi düzgün yazıya çeviriyoruz
            const sureIsimleri = {
                [60 * 1000]: '60 Saniye',
                [5 * 60 * 1000]: '5 Dakika',
                [10 * 60 * 1000]: '10 Dakika',
                [60 * 60 * 1000]: '1 Saat',
                [24 * 60 * 60 * 1000]: '1 Gün',
                [7 * 24 * 60 * 60 * 1000]: '1 Hafta'
            };
            const cezaSuresi = sureIsimleri[sure] || 'Bilinmeyen Süre';

            // Marpel tarzında şık, asil siyah Embed tasarımı
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Zaman Aşımı Başarıyla Uygulandı', iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor('#101114') // Tam istediğin o koyu siyah tonu
                .setDescription(
                    `🔇 **Sunucuda Bir Üye Susturuldu!**\n\n` +
                    `• 👤 **Cezalandırılan Üye:** ${user} (\`${user.id}\`)\n` +
                    `• 🛠️ **Cezayı Veren Yetkili:** ${interaction.user} (\`${interaction.user.id}\`)\n` +
                    `• ⏱️ **Ceza Süresi:** \`${cezaSuresi}\`\n` +
                    `• 📝 **Susturma Sebebi:** \`${sebep}\``
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: '❌ Zaman aşımı uygulanırken teknik bir hata meydana geldi!', ephemeral: true });
        }
    },
};