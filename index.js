const http = require('http');
http.createServer((req, res) => { res.write("Bot aktif!"); res.end(); }).listen(process.env.PORT || 3000);

const { Client, GatewayIntentBits, Collection, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');

let config = {};
const configPath = path.join(__dirname, 'config.json');
if (fs.existsSync(configPath)) { config = require('./config.json'); }

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates 
    ]
});

client.commands = new Collection();
client.prefixCommands = new Collection();
client.games = new Collection(); 

client.distube = new DisTube(client, {
    plugins: [ new SpotifyPlugin(), new SoundCloudPlugin() ],
    emitNewSongOnly: true,
    nsfw: true,
    leaveOnEmpty: true, // Odada kimse kalmazsa çıkar
    leaveOnFinish: false // Nöbet sistemi için listeyi korur
});

// --- KOMUT YÜKLEME ---
const restCommands = [];

const commandsPath = path.join(__dirname, 'commands');
for (const folder of fs.readdirSync(commandsPath)) {
    if (folder === 'prefix') continue; 
    
    const folderPath = path.join(commandsPath, folder);
    if (fs.lstatSync(folderPath).isDirectory()) {
        for (const file of fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))) {
            const command = require(path.join(folderPath, file));
            if (command.data && command.execute) {
                client.commands.set(command.data.name, command);
                restCommands.push(command.data.toJSON());
            }
        }
    }
}

const prefixPath = path.join(__dirname, 'commands/prefix');
if (fs.existsSync(prefixPath)) {
    for (const file of fs.readdirSync(prefixPath).filter(f => f.endsWith('.js'))) {
        const command = require(path.join(prefixPath, file));
        if (command.name && command.execute) client.prefixCommands.set(command.name, command);
    }
}

// --- KOMUT KAYIT ---
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN || config.token);
(async () => {
    try {
        const cId = process.env.CLIENT_ID || config.clientId;
        const gId = process.env.GUILD_ID || config.guildId;
        if (cId && gId) {
            await rest.put(Routes.applicationGuildCommands(cId, gId), { body: restCommands });
            console.log('✅ Slash ve Prefix sistemleri yüklendi!');
        }
    } catch (e) { console.error('Komut kayıt hatası:', e); }
})();

client.once('ready', () => { console.log(`✅ ${client.user.tag} başarıyla aktif!`); });

// --- ETKİLEŞİM YÖNETİMİ ---
client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try { 
            await command.execute(interaction); 
        } catch (e) { 
            console.error(e); 
            const errorMsg = { content: 'Bir hata oluştu!', ephemeral: true };
            if (interaction.replied || interaction.deferred) await interaction.followUp(errorMsg).catch(() => {});
            else await interaction.reply(errorMsg).catch(() => {});
        }
    }
    
    else if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'yardim_menu') {
            const selected = interaction.values[0];
            const embed = new EmbedBuilder().setColor('#2b2d31');
            
            if (selected === 'mod') {
                embed.setTitle('🛡️ Moderasyon Komutları')
                    .setDescription('`w!ban` - Yasaklar.\n`w!kick` - Atar.\n`w!sil` - Temizler.\n`w!timeout` - Susturur.');
            } else if (selected === 'eglence') {
                embed.setTitle('🎉 Eğlence Komutları')
                    .setDescription('`w!avatar` - Profil resmi.\n`w!yazı-tura` - Yazı tura atar.');
            } else if (selected === 'ekonomi') {
                embed.setTitle('💰 Ekonomi Komutları')
                    .setDescription('Çok yakında!');
            }
            await interaction.update({ embeds: [embed] }).catch(console.error);
        }
    }
});

// --- PREFIX SİSTEMİ ---
client.on('messageCreate', async message => {
    if (message.author.bot || !message.content.toLowerCase().startsWith('w!')) return;

    console.log(`📩 [Wolf Mesaj Algıladı]: ${message.content}`);

    const args = message.content.slice(2).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    console.log(`🔍 [Aranan Komut]: ${commandName}`);

    const command = client.prefixCommands.get(commandName) || 
                    client.prefixCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (!command) {
        console.log(`❌ [Hata]: "w!${commandName}" komutu bulunamadı!`);
        return;
    }

    try { 
        console.log(`🚀 [Çalıştırılıyor]: ${command.name}.js`);
        await command.execute(message, args); 
    } 
    catch (e) { 
        console.error('💥 Komut hatası:', e); 
        message.reply('Komut çalıştırılırken bir hata oluştu!'); 
    }
});

// =========================================================
// --- WOLF MÜZİK SİSTEMİ (ÇÖKMEYE KARŞI KORUMALI) ---
// =========================================================

const olumluEmoji = "<a:wolfonay:1517197503345328430>";
const olumsuzEmoji = "<a:wolfhayir:1517203345385984150>";

client.distube.on('addSong', (queue, song) => {
    const siraNumarasi = queue.songs.length;
    const addSongEmbed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setTitle(`📥 Sıraya Eklendi - #${siraNumarasi}`)
        .setDescription(`**[${song.name}](${song.url})**`)
        .addFields(
            { name: '⏳ Süre', value: `\`${song.isLive ? '🔴 CANLI' : song.formattedDuration}\``, inline: true },
            { name: '👤 İsteyen', value: `${song.user}`, inline: true }
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: 'Wolf Sıra Sistemi' });

    queue.textChannel.send({ embeds: [addSongEmbed] });
});

client.distube.on('playSong', (queue, song) => {
    const playerEmbed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('🎵 Şu Anda Oynatılıyor')
        .setDescription(`**[${song.name}](${song.url})**`)
        .addFields(
            { name: '⏳ Süre', value: `\`${song.isLive ? '🔴 CANLI YAYIN' : song.formattedDuration}\``, inline: true },
            { name: '👤 İsteyen', value: `${song.user}`, inline: true },
            { name: '🌀 Döngü', value: queue.repeatMode === 1 ? '`Tekrar Açık` 🔁' : '`Kapalı` ❌', inline: true }
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: 'Wolf Müzik Sistemi • Butonları kullanarak kontrol et kanka.' });

    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('player_pause').setLabel('⏸️ Durdur / Devam').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('player_skip').setLabel('⏭️ Geç').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('player_loop').setLabel('🔁 Sonsuz Tekrar').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('player_stop').setLabel('⏹️ Kapat').setStyle(ButtonStyle.Danger)
    );

    queue.textChannel.send({ embeds: [playerEmbed], components: [buttons] }).then(msg => {
        // Canlı yayınsa (isLive) butonları sınırsız açık tut, normal şarkıysa şarkı süresi kadar tut
        const zamanAsimi = song.isLive ? 86400000 : song.duration * 1000; 
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: zamanAsimi });

        collector.on('collect', async interaction => {
            await interaction.deferUpdate().catch(() => {});

            if (interaction.customId === 'player_pause') {
                if (queue.paused) {
                    queue.resume();
                    queue.textChannel.send(`${olumluEmoji} Müzik devam ettiriliyor.`).then(m => setTimeout(() => m.delete().catch(()=>{}), 3000));
                } else {
                    queue.pause();
                    queue.textChannel.send(`${olumluEmoji} Müzik durduruldu.`).then(m => setTimeout(() => m.delete().catch(()=>{}), 3000));
                }
            }

            if (interaction.customId === 'player_skip') {
                if (queue.songs.length > 1) {
                    queue.skip();
                    queue.textChannel.send(`${olumluEmoji} Şarkı başarıyla geçildi.`).then(m => setTimeout(() => m.delete().catch(()=>{}), 3000));
                } else {
                    queue.textChannel.send(`${olumsuzEmoji} Sırada başka şarkı yok kanka.`).then(m => setTimeout(() => m.delete().catch(()=>{}), 3000));
                }
            }

            if (interaction.customId === 'player_loop') {
                if (queue.repeatMode === 1) {
                    queue.setRepeatMode(0);
                    queue.textChannel.send(`${olumluEmoji} Sonsuz tekrar modu **Kapatıldı**.`).then(m => setTimeout(() => m.delete().catch(()=>{}), 3000));
                } else {
                    queue.setRepeatMode(1);
                    queue.textChannel.send(`${olumluEmoji} Ağır abi modu aktif! Şarkı **Sonsuza Kadar Tekrar Edilecek**! 🔁`).then(m => setTimeout(() => m.delete().catch(()=>{}), 4000));
                }
            }

            if (interaction.customId === 'player_stop') {
                queue.stop();
                queue.textChannel.send(`${olumsuzEmoji} Müzik kapatıldı, Wolf kanaldan ayrılıyor.`).then(m => setTimeout(() => m.delete().catch(()=>{}), 4000));
                msg.delete().catch(() => {});
            }
        });

        collector.on('end', () => {
            buttons.components.forEach(btn => btn.setDisabled(true));
            msg.edit({ components: [buttons] }).catch(() => {});
        });
    });
});

// --- YENİ EKLENEN HAYAT KURTARICI OLAYLAR (EVENTS) ---

// Hata Yakalayıcı: Botun tamamen çökmesini engeller
client.distube.on('error', (channel, error) => {
    console.error('💥 [KORUMA] DisTube Hatası Engellendi:', error);
    if (channel) channel.send(`❌ Müzik motorunda anlık bir sorun oluştu, yayın bağlantısı koptu kanka.`).catch(() => {});
});

// Odada kimse kalmadığında çalışır (Sistemi yormaz)
client.distube.on('empty', queue => {
    queue.textChannel.send('👋 Odada kimse kalmadı, Wolf enerji tasarrufu için yayını kapatıp çıkıyor.').catch(() => {});
});

// Şarkı listesi tamamen bittiğinde çalışır
client.distube.on('finish', queue => {
    queue.textChannel.send('🎵 Çalma listesinin sonuna geldik, benden bu kadar!').catch(() => {});
});

client.login(process.env.DISCORD_TOKEN || config.token);