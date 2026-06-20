const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sayi-tahmin')
        .setDescription('1-100 arası bir sayı tuttum, tahmin et!')
        .addIntegerOption(option => option.setName('tahmin').setDescription('Tahminini gir').setRequired(true)),
    async execute(interaction) {
        const tahmin = interaction.options.getInteger('tahmin');
        const tutulanSayi = Math.floor(Math.random() * 100) + 1;

        if (tahmin === tutulanSayi) {
            await interaction.reply(`🎉 Tebrikler! Doğru tahmin ettin, sayı **${tutulanSayi}** idi!`);
        } else {
            await interaction.reply(`❌ Bilemedin! Benim tuttuğum sayı **${tutulanSayi}** idi. Tekrar denemek ister misin?`);
        }
    },
};