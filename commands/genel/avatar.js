const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Bir kullanıcının profil fotoğrafını büyük boyutta gösterir.')
        .addUserOption(option => 
            option.setName('kullanıcı')
                .setDescription('Avatarına bakmak istediğin kişiyi seç (Boş bırakırsan seninkini gösterir).')
                .setRequired(false)), // Zorunlu değil, boş bırakılabilir
    async execute(interaction) {
        // Eğer bir kullanıcı seçilmediyse, komutu yazan kişinin avatarını alıyoruz
        const user = interaction.options.getUser('kullanıcı') || interaction.user;
        
        // Şık bir kutu (Embed) oluşturuyoruz
        const embed = new EmbedBuilder()
            .setColor('#0099FF') // Mavi renk tonu
            .setTitle(`✨ ${user.username} Kullanıcısının Avatarı`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 })) // Hareketli gifleri de destekler
            .setFooter({ text: `${interaction.user.tag} tarafından istendi.`, iconURL: interaction.user.displayAvatarURL() });

        // Embed mesajı sunucuya gönderiyoruz
        await interaction.reply({ embeds: [embed] });
    },
};