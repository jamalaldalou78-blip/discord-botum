const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meydanoku')
        .setDescription('Sunucudan birine raconuna meydan okursun! (Karşı taraf onaylamalı)')
        .addUserOption(option => 
            option.setName('hedef')
                .setDescription('Meydan okumak istediğin ağır abiyi seç.')
                .setRequired(true)),
    async execute(interaction) {
        const hedef = interaction.options.getUser('hedef');
        const meydanOkuyan = interaction.user;

        if (hedef.id === meydanOkuyan.id) {
            return interaction.reply({ content: 'Kendi kendine racon kesemezsin kanka, karşına birini al!', ephemeral: true });
        }

        if (hedef.bot) {
            return interaction.reply({ content: 'Botlara racon sökmez kral, gerçek birini seç!', ephemeral: true });
        }

        // 1. ADIM: Butonları hazırlayalım
        const kabulEtButonu = new ButtonBuilder()
            .setCustomId('kabul')
            .setLabel('Masaya Otur (Kabul Et)')
            .setStyle(ButtonStyle.Success)
            .setEmoji('⚔️');

        const reddetButonu = new ButtonBuilder()
            .setCustomId('reddet')
            .setLabel('Geri Vites (Reddet)')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🏃');

        const row = new ActionRowBuilder().addComponents(kabulEtButonu, reddetButonu);

        // 2. ADIM: Karşı tarafa giden ilk davet mesajı
        const davetEmbed = new EmbedBuilder()
            .setColor('#ffaa00') // Turuncu uyarı rengi
            .setTitle('⚠️ MEKAN BASILDI! MEYDAN OKUMA VAR!')
            .setDescription(`Hey <@${hedef.id}>!\n\n**${meydanOkuyan.username}** senin mekanına geldi ve sana racon keserek meydan okuyor!\n\nMasaya oturup çarpışacak mısın, yoksa geri vites mi yapacaksın? (60 saniye süren var)`)
            .setThumbnail('https://i.imgur.com/8Q5YI2k.gif') // İstersen değiştirebilirsin
            .setFooter({ text: 'Racon masası kuruldu, bekleniyor...' });

        // Mesajı butonlarla birlikte gönderelim
        const response = await interaction.reply({ content: `<@${hedef.id}>`, embeds: [davetEmbed], components: [row] });

        // 3. ADIM: Butonları dinleme sistemi (Sadece etiketlenen kişi basabilir)
        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 }); // 60 saniye süre

        collector.on('collect', async i => {
            // Eğer butona basan kişi, bizim meydan okuduğumuz kişi değilse:
            if (i.user.id !== hedef.id) {
                return i.reply({ content: 'Bu masaya sadece meydan okunan kişi oturabilir! Sen karışma.', ephemeral: true });
            }

            // KABUL ET BUTONUNA BASILDIYSA:
            if (i.customId === 'kabul') {
                const okuyanGuc = Math.floor(Math.random() * 101);
                const hedefGuc = Math.floor(Math.random() * 101);

                let durumMesaji = '';
                let hikaye = '';
                let renk = '#ff0000';

                // Sonuca göre hikaye yazdırıyoruz
                if (okuyanGuc > hedefGuc) {
                    renk = '#00ff00'; // Kazanan için yeşilimsi
                    durumMesaji = `👑 Kazanan: **${meydanOkuyan.username}**`;
                    hikaye = `**${meydanOkuyan.username}** masaya öyle bir vurdu ki, çay bardakları devrildi! **${hedef.username}** bu ağır racon karşısında sessiz kalıp mekanı terk etti.`;
                } else if (hedefGuc > okuyanGuc) {
                    renk = '#00ff00';
                    durumMesaji = `👑 Kazanan: **${hedef.username}**`;
                    hikaye = `**${meydanOkuyan.username}** büyük konuştu ama **${hedef.username}** tek bir bakışıyla tüm raconu bozdu! Meydan okuyan kendi mekanına eli boş döndü.`;
                } else {
                    renk = '#ffff00'; // Beraberlik için sarı
                    durumMesaji = `🤝 Beraberlik!`;
                    hikaye = `İki taraf da öyle ağır konuştu ki, masada kimse birbirine üstünlük kuramadı. Dostluk kazandı, çaylar şirketten!`;
                }

                const savasEmbed = new EmbedBuilder()
                    .setColor(renk)
                    .setTitle('⚡ BÜYÜK HESAPLAŞMA SONUÇLANDI!')
                    .setDescription(hikaye)
                    .addFields(
                        { name: `📿 ${meydanOkuyan.username} Racon Gücü`, value: `\`%${okuyanGuc}\``, inline: true },
                        { name: `📿 ${hedef.username} Racon Gücü`, value: `\`%${hedefGuc}\``, inline: true }
                    )
                    .setFooter({ text: durumMesaji })
                    .setTimestamp();

                // İlk atılan mesajı, savaş sonucuna göre güncelliyoruz (Butonlar kaybolur)
                await i.update({ content: null, embeds: [savasEmbed], components: [] });
                collector.stop(); 
            }

            // REDDET BUTONUNA BASILDIYSA:
            if (i.customId === 'reddet') {
                const iptalEmbed = new EmbedBuilder()
                    .setColor('#555555') // Sönük gri renk
                    .setTitle('🏃 GERİ VİTES!')
                    .setDescription(`**${hedef.username}** mekana gelmeye cesaret edemedi ve geri vites yaptı! \n\n**${meydanOkuyan.username}** masada tek başına çayını yudumluyor...`)
                    .setFooter({ text: 'Racon kesilmeden bitti.' });

                await i.update({ content: null, embeds: [iptalEmbed], components: [] });
                collector.stop();
            }
        });

        // 4. ADIM: SÜRE BİTİNCE (60 saniye boyunca kimse basmazsa)
        collector.on('end', collected => {
            if (collected.size === 0) { // Kimse butona basmadıysa
                const zamanAsimiEmbed = new EmbedBuilder()
                    .setColor('#000000')
                    .setTitle('⏳ ZAMAN AŞIMI')
                    .setDescription(`**${hedef.username}** 60 saniye boyunca masaya gelmedi. Ya uyudu, ya da korkudan telefonu kapattı! Meydan okuma iptal oldu.`);
                
                // Mesajı güncelle ve butonları kaldır
                interaction.editReply({ embeds: [zamanAsimiEmbed], components: [] }).catch(console.error);
            }
        });
    },
};