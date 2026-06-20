const { SlashCommandBuilder } = require('discord.js');

const kategoriler = {
    spor: ['futbol', 'basketbol', 'voleybol', 'tenis', 'yuzme'],
    ulke: ['turkiye', 'almanya', 'fransa', 'japonya', 'ispanya'],
    meyve: ['elma', 'armut', 'cilek', 'muz', 'karpuz']
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adamasmaca')
        .setDescription('Adam asmaca oyunu baslatir')
        .addStringOption(option => 
            option.setName('kategori')
                .setDescription('Bir kategori secin')
                .setRequired(true)
                .addChoices(
                    { name: 'Spor', value: 'spor' },
                    { name: 'Ulke', value: 'ulke' },
                    { name: 'Meyve', value: 'meyve' }
                )),

    async execute(interaction) {
        const kategori = interaction.options.getString('kategori');
        const secilenKelime = kategoriler[kategori][Math.floor(Math.random() * kategoriler[kategori].length)];

        interaction.client.games.set(interaction.user.id, {
            kelime: secilenKelime,
            tahminler: [],
            hak: 6
        });

        const gizliKelime = '_ '.repeat(secilenKelime.length);
        await interaction.reply(`Oyun basladi! Kategori: **${kategori}**.\nKelime: \`${gizliKelime}\`\nTahmin etmek icin **normal mesaj olarak** harf yaz.`);
    },
};