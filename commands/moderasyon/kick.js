const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Belirtilen kullanıcıyı sunucudan atar.')
        .addUserOption(option => option.setName('kullanici').setDescription('Atılacak üye').setRequired(true))
        .addStringOption(option => option.setName('sebep').setDescription('Atılma nedeni').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
        
    async execute(interaction) {
        const user = interaction.options.getUser('kullanici');
        const sebep = interaction.options.getString('sebep') || 'Sebep belirtilmedi.';
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) return interaction.reply({ content: '❌ Bu kullanıcı sunucuda bulunamadı.', flags: ['Ephemeral'] });
        if (!member.kickable) return interaction.reply({ content: '❌ Bu kullanıcıyı atmaya yetkim yetmiyor!', flags: ['Ephemeral'] });

        await member.kick(sebep);

        const embed = new EmbedBuilder()
            .setTitle('🥾 Kullanıcı Atıldı!')
            .setDescription(`**Atılan:** ${user.tag}\n**Yetkili:** ${interaction.user.tag}\n**Sebep:** ${sebep}`)
            .setColor('#ffaa00')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
