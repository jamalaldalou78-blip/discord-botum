const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kullanıcı-bilgi')
        .setDescription('Seçilen üyenin detaylı profil ve yetkili istatistiklerini gösterir.')
        .addUserOption(option =>
            option.setName('üye')
                .setDescription('Bilgilerine bakmak istediğiniz üyeyi seçin.')
                .setRequired(false)
        ),
    async execute(interaction) {
        // Eğer üye seçilmediyse komutu yazan kişiyi baz alır
        const targetUser = interaction.options.getUser('üye') || interaction.user;
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: 'Bu üye sunucuda bulunamadı!', ephemeral: true });
        }

        // Hafıza kartından (QuickDB) yetkili sayılarını çekiyoruz
        const banSayisi = await db.get(`yetkili_${member.id}_ban`) || 0;
        const muteSayisi = await db.get(`yetkili_${member.id}_mute`) || 0;
        const jailSayisi = await db.get(`yetkili_${member.id}_jail`) || 0;
        const kayitSayisi = await db.get(`yetkili_${member.id}_kayit`) || 0;
        const talepSayisi = await db.get(`yetkili_${member.id}_talep`) || 0;
        const sesSuresi = await db.get(`yetkili_${member.id}_ses`) || "1 Saat 33 Dakika"; // Örnek süre, istersen değiştirebilirsin

        // İzin kontrolüne göre rütbe belirleme
        let yetkiDurumu = "Üye";
        if (member.permissions.has('Administrator')) {
            yetkiDurumu = "Yönetici";
        } else if (member.permissions.has('ManageGuild') || member.permissions.has('KickMembers')) {
            yetkiDurumu = "Yetkili";
        }

        // Tarih formatlarını Discord zaman etiketine çevirme
        const dcKatilim = Math.floor(targetUser.createdTimestamp / 1000);
        const sunucuKatilim = Math.floor(member.joinedTimestamp / 1000);

        // Şık asil siyah temalı Embed yapısı
        const profilEmbed = new EmbedBuilder()
            .setAuthor({ name: `${targetUser.username} Kişisinin Genel Bilgileri:`, iconURL: targetUser.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setColor('#101114') // Tam fotoğraftaki o koyu siyah tonu
            .setDescription(
                `👤 **Kullanıcı Bilgileri:**\n` +
                `• 🏷️ **Takma Adı:** ${member.nickname ? `@${member.nickname}` : `@${targetUser.username}`}\n` +
                `• 📜 **Rol Sayısı:** \`${member.roles.cache.size - 1}\`\n` +
                `• 📅 **Discord'a Katılım:** <t:${dcKatilim}:D> (<t:${dcKatilim}:R>)\n\n` +

                `🏠 **Sunucu İstatistikleri:**\n` +
                `• 📥 **Sunucuya Katılımı:** \`${Math.floor((Date.now() - member.joinedTimestamp) / (1000 * 60 * 60 * 24))} Gün\`\n` +
                `• 📅 **Giriş Tarihi:** <t:${sunucuKatilim}:F> (<t:${sunucuKatilim}:R>)\n` +
                `• 🔊 **Ses Süresi:** \`${sesSuresi}\`\n` +
                `• 👑 **Üyenin İzinleri:** \`${yetkiDurumu}\`\n\n` +
                
                `🛠️ **Yetkili İstatistikleri:**\n` +
                `• 🚫 **Ban Sayısı:** \`${banSayisi}\`\n` +
                `• 🔇 **Mute Sayısı:** \`${muteSayisi}\`\n` +
                `• ⛓️ **Jail Sayısı:** \`${jailSayisi}\`\n` +
                `• 📝 **Kayıt Sayısı:** \`${kayitSayisi}\`\n` +
                `• 📞 **Talep Çözümü Sayısı:** \`${talepSayisi}\`\n\n` +
                
                `🖼️ **Banner:**\n\`Bulunmuyor\``
            );

        // Alt taraftaki "Genel" Açılır Menüsü
        const menuRow = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('profil_menu')
                    .setPlaceholder('Genel')
                    .addOptions([
                        { label: 'Genel Bilgiler', description: 'Ana profil sayfasını gösterir.', value: 'genel' },
                        { label: 'Ceza Geçmişi', description: 'Kullanıcının aldığı cezaları gösterir.', value: 'cezalar' }
                    ])
            );

        // Alt taraftaki Etkileşim Butonları
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('profil_yenile')
                    .setLabel('Menüyü Güncelle')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('profil_sil')
                    .setLabel('Sil')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('profil_duzenle')
                    .setLabel('Verileri Düzenle')
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.reply({ embeds: [profilEmbed], components: [menuRow, buttonRow] });
    }
};