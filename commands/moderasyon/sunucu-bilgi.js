const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sunucu-bilgi')
        .setDescription('Sunucu hakkında bilgiler verir.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle(interaction.guild.name)
            .addFields(
                { name: 'Üye Sayısı', value: `${interaction.guild.memberCount}`, inline: true },
                { name: 'Oluşturulma', value: interaction.guild.createdAt.toDateString(), inline: true },
                { name: 'Sahibi', value: `<@${interaction.guild.ownerId}>`, inline: true }
            );
        await interaction.reply({ embeds: [embed] });
    },
};