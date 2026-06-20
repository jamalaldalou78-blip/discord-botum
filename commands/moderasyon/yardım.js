const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'yardım', // Prefix için
    data: new SlashCommandBuilder() // Slash için
        .setName('yardım')
        .setDescription('Botun tüm komutlarını gösterir.'),
        
    async execute(interactionOrMessage) {
        // Hem slash hem mesaj desteği
        const isSlash = interactionOrMessage.user !== undefined;
        
        const embed = new EmbedBuilder()
            .setTitle('👑 Wolf Komutlar')
            .setDescription('Aşağıdaki menüden kategori seçerek komutları inceleyebilirsin.')
            .setColor('#2b2d31')
            .setThumbnail(interactionOrMessage.client.user.displayAvatarURL());

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('yardim_menu')
                    .setPlaceholder('Kategorileri görmek için tıkla!')
                    .addOptions([
                        { label: 'Mod Komutları', value: 'mod', emoji: '🛡️' },
                        { label: 'Eğlence', value: 'eglence', emoji: '🎉' },
                        { label: 'Ekonomi', value: 'ekonomi', emoji: '💰' }
                    ]),
            );

        if (isSlash) await interactionOrMessage.reply({ embeds: [embed], components: [row] });
        else await interactionOrMessage.reply({ embeds: [embed], components: [row] });
    }
};