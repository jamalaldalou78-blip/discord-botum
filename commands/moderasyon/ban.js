const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('🛠️ Belirtilen kullanıcıyı sunucudan kalıcı olarak yasaklar.')
        .addUserOption(option => 
            option.setName('kullanıcı')
                .setDescription('Yasaklanacak kullanıcıyı seçin.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('sebep')
                .setDescription('Yasaklama sebebini yazın.')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('kullanıcı');
        const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi.';
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: '❌ Bu kullanıcı sunucuda bulunamadı.', ephemeral: true });
        }
        if (!member.bannable) {
            return interaction.reply({ content: '❌ Bu kullanıcıyı yasaklamaya yetkim yetmiyor! (Rolü benden üstte olabilir).', ephemeral: true });
        }
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({ content: '❌ Kendini banlayamazsın kanka, sakin ol! 😂', ephemeral: true });
        }

        const onayButon = new ButtonBuilder()
            .setCustomId('ban_onay')
            .setLabel('Evet, Banla!')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔨');

        const iptalButon = new ButtonBuilder()
            .setCustomId('ban_iptal')
            .setLabel('İptal Et')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('❌');

        const butonSatiri = new ActionRowBuilder().addComponents(onayButon, iptalButon);

        const onayEmbed = new EmbedBuilder()
            .setColor('#f1c40f')
            .setTitle('⚠️ Yasaklama Onayı İstiyor!')
            .setDescription(`**${targetUser.tag}** isimli kullanıcıyı sunucudan yasaklamak üzeresiniz.\n\n📝 **Sebep:** ${reason}`)
            .setFooter({ text: `${interaction.user.tag} tarafından başlatıldı.`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        const response = await interaction.reply({
            embeds: [onayEmbed],
            components: [butonSatiri],
            fetchReply: true
        });

        const filter = i => i.user.id === interaction.user.id;
        const collector = response.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async i => {
            if (i.customId === 'ban_onay') {
                try {
                    await interaction.guild.members.ban(targetUser, { reason: `${interaction.user.tag}: ${reason}` });

                    // 🤫 GİZLİ HİLE: GIF linkini açıklamanın en altına görünmez boşluk karakteriyle gömdük.
                    // Discord bunu düz yazı olarak göstermez ama altta GIF'i zorunlu olarak patlatır.
                    const basariliEmbed = new EmbedBuilder()
                        .setColor('#ff0000') 
                        .setTitle('🚀 ADALET YERİNİ BULDU!')
                        .setDescription(`💥 **Yasaklanan Üye:** ${targetUser.tag}\n👮 **Yetkili:** ${interaction.user}\n\n📝 **Sebep:** \` ${reason} \`\n\n[‌](https://media.tenor.com/fL-2EshR6cwAAAAC/ban-hammer-ban.gif)`) 
                        .setImage('https://media.tenor.com/fL-2EshR6cwAAAAC/ban-hammer-ban.gif') // Çift dikiş olsun diye buraya da ekledim
                        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                        .setFooter({ text: 'Bu sunucunun kuralları çiğnenemez!' })
                        .setTimestamp();

                    await i.update({ embeds: [basariliEmbed], components: [] });
                    collector.stop();
                } catch (error) {
                    await i.update({ content: '❌ Kullanıcıyı banlarken bir hata oluştu. Lütfen botun rolünün bu kullanıcıdan üstte olduğundan emin ol!', embeds: [], components: [] });
                    collector.stop();
                }

            } else if (i.customId === 'ban_iptal') {
                const iptalEmbed = new EmbedBuilder()
                    .setColor('#2ecc71')
                    .setTitle('✅ İşlem İptal Edildi')
                    .setDescription(`**${targetUser.tag}** için başlatılan yasaklama işlemi yetkili tarafından iptal edildi.`);

                await i.update({ embeds: [iptalEmbed], components: [] });
                collector.stop();
            }
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                const sureDolduEmbed = new EmbedBuilder()
                    .setColor('#95a5a6')
                    .setTitle('⏰ Süre Doldu')
                    .setDescription('Yasaklama işlemi 30 saniye içinde onaylanmadığı için otomatik olarak iptal edildi.');

                await interaction.editReply({ embeds: [sureDolduEmbed], components: [] }).catch(() => null);
            }
        });
    },
};