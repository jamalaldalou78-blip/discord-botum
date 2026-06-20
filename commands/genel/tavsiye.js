const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tavsiye')
        .setDescription('Bot sana günün tavsiyesini versin!'),
    async execute(interaction) {
        const tavsiyeler = [
            "Kod yazmayı bırakıp biraz uyu kanka, dinlenmek de bir sanattır.",
            "Bugün birine çay ısmarla, belki iyi bir dost kazanırsın.",
            "Sunucuyu yönetmekten yorulduysan bir kahve iç, ekranı biraz boşver.",
            "Hayat sadece Discord'dan ibaret değil, dışarı çık bir hava al.",
            "Düşünmeyi bırak, harekete geç. Başarı eylemde saklıdır.",
            "Bugün kendine bir iyilik yap ve sevdiğin bir müziği son ses dinle."
        ];
        
        const rastgele = tavsiyeler[Math.floor(Math.random() * tavsiyeler.length)];
        await interaction.reply(`💡 **Günün Tavsiyesi:** ${rastgele}`);
    },
};