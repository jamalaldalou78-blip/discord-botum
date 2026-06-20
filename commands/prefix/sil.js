module.exports = {
    name: 'sil',
    async execute(message, args) {
        const olumluEmoji = "<a:wolfonay:1517197503345328430>";
        const olumsuzEmoji = "<a:wolfhayir:1517203345385984150>";

        // Girilen sayıyı alıyoruz
        const inputAmount = parseInt(args[0]);
        
        if (isNaN(inputAmount) || inputAmount < 1 || inputAmount > 100) {
            return message.reply(`${olumsuzEmoji} Lütfen 1-100 arası geçerli bir sayı gir kanka.`);
        }
        
        try {
            // KANKA ÇÖZÜM BURADA: Senin yazdığın komut mesajını da hesaba katıp sayıya otomatik +1 ekliyoruz!
            const deleteAmount = inputAmount + 1;
            // Eğer +1 ekleyince 100'ü geçiyorsa Discord hata vermesin diye 100'e sabitliyoruz
            const finalAmount = deleteAmount > 100 ? 100 : deleteAmount;

            // Mesajları siliyoruz (Senin komut mesajın da bu silinenlerin içinde gidiyor)
            const deleted = await message.channel.bulkDelete(finalAmount, true);
            
            // Gerçekten silinen mesaj sayısından senin komutunu (1) çıkarıp ekrana yazıyoruz
            const netDeleted = deleted.size - 1 <= 0 ? 0 : deleted.size - 1;

            // Başarı mesajı (Herkes görecek ve kalın olacak)
            const successMessage = await message.channel.send(`${olumluEmoji} Başarıyla \`${netDeleted}\` adet mesaj **silindi**!`);
            
            // 3 saniye sonra başarı mesajını siliyoruz
            setTimeout(() => {
                successMessage.delete().catch(() => {});
            }, 3000);
                
        } catch (e) {
            console.error(e);
            const errorMessage = await message.channel.send(`${olumsuzEmoji} Mesajlar silinirken bir hata oluştu.`);
            setTimeout(() => errorMessage.delete().catch(() => {}), 5000);
        }
    }
};