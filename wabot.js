const qrcode = require('qrcode-terminal');
const fs = require("fs")
const {
    Client,
    LegacySessionAuth,
    LocalAuth,
    MessageMedia
} = require('whatsapp-web.js');
const {
    Session
} = require('inspector/promises');
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "client-one" // un identification
    })
})

// save session values to the file upon successful auth
client.on('authenticated', (session) => {
    console.log(session)
});

client.setMaxListeners(99)

client.on('group_join', async (notification) => {
    const chat = await notification.getChat();
    const newMemberId = notification.id.participant; // Mendapatkan ID member baru
    const newMember = await client.getContactById(newMemberId); // Mendapatkan data member baru

    // Mengirim pesan selamat datang dengan mention/tag member baru
    const welcomeMessage = `
┌─────────────────❖
│「 Halo 👋 」
└┬❖ 「  @${newMember.number}  」
   │✑ Selamat Datang Di
   │     Lantern夜
   │✑ Jumlah Member
   │     ${chat.participants.length} Orang
   │✑ Semoga Betah Di sini,
   │     Ikuti Rules Grup!
   │✑ Catatan:
   │     Ketik Ku, info untuk
   │     memunculkan menu Bot!
   │
   │✑ ${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}
   └───────────────┈ ⳹`;

   await chat.sendMessage(welcomeMessage, { mentions: [`@${newMember.number}`]});
});

client.on('group_leave', async (notification) => {
    const chat = await notification.getChat();
    const leavingMemberId = notification.id.participant; // Mendapatkan ID member yang keluar
    const leavingMember = await client.getContactById(leavingMemberId); // Mendapatkan data member yang keluar

    // Mengirim pesan perpisahan ke grup
    const leaveMessage = `
Sedih banget, @${leavingMember.number} telah keluar dari grup. 
Jumlah member sekarang: ${chat.participants.length} People`;

    await chat.sendMessage(leaveMessage, { mentions: [`@${leavingMember.number}`] });
});

client.on('group_promote', async (notification) => {
    const chat = await notification.getChat();
    const promotedMemberId = notification.id.participant;
    const promotedMember = await client.getContactById(promotedMemberId);

    const promoteMessage = `
Selamat @${promotedMember.number}! 🎉
Sekarang kamu adalah admin di grup ini.
Terima kasih sudah bersedia membantu mengelola grup!
`;

    await chat.sendMessage(promoteMessage, { mentions: [`@${promotedMember.number}`] });
});


client.on('message', async message => {
    if (message.body.toLowerCase().startsWith('@everyone')) {
        const chat = await message.getChat();

        if (chat.isGroup) {
            const text = message.body.slice(9).trim(); // Mengambil teks setelah "@everyone"
            let mentions = [];

            for (let participant of chat.participants) {
                mentions.push(await client.getContactById(participant.id._serialized));
            }

            await chat.sendMessage(`@everyone ${text}`, {
                mentions: mentions
            });
        } else {
            message.reply("Fitur ini hanya bisa digunakan di dalam grup.");
        }
    }
});

client.initialize();
client.on("qr", qr => {
    qrcode.generate(qr, {
        small: true
    });
})

client.on('ready', () => {
    console.log("ready to message")
})

//command untuk menampilkan menu
client.on('message', async message => {
    const commands = {
        'ku, info': {
            filePath: './resource_media/banner.jpeg',
            caption: `Ku's Bot Toram Menu 😁👍

⭕Ku, ada member baru nih
⭕Lvling level kalian
⭕Ku, xtall ( normal/weapon/armor/adds/ring )
⭕Ku, foodbuff
⭕Ku, pet menu
⭕Ku, blacksmith
⭕Ku, bahanmq
⭕Ku, upkoleksi
⭕Ku, farm mats
⭕Ku, scammer
⭕Ku, donasi
⭕Ku, consume dte
⭕Ku, consume support

Catatan : Bot masih dalam proses pengembangan jadi mohon dimaklumi bila ada bug terimakasi.😊🙌`
        },
        'ku, foodbuff': {
            filePath: './resource_media/banner.jpeg',
            caption: `Ku's Bot Foodbuff Code Services😁👍

⭕Ku, buff mp
⭕Ku, buff hp
⭕Ku, buff ampr
⭕Ku, buff cr
⭕Ku, buff watk
⭕Ku, buff str
⭕Ku, buff dex
⭕Ku, buff int
⭕Ku, buff agi
⭕Ku, buff accuracy
⭕Ku, buff mres
⭕Ku, buff pres
⭕Ku, buff frac
⭕Ku, buff +aggro
⭕Ku, buff -aggro
⭕Ku, buff dte earth
⭕Ku, buff dte wind
⭕Ku, buff dte water
⭕Ku, buff dte fire
⭕Ku, buff dte light
⭕Ku, buff dte dark
⭕Ku, buff dt neutral
⭕Ku, buff drop rate

Catatan : Menu ini digunakan pada saat kalian lupa, kalian bisa langsung menggunakan
command 'Ku, buff mp' untuk menampilkan code mp, begitupula code yang lain tanpa menggunakan
command Ku, foodbuff`
        },
        'ku, pet menu': {
            filePath: './resource_media/banner.jpeg',
            caption: `Ku's Bot Pet Building Information Services😁👍

⭕Ku, potensi pet
⭕Ku, pola hindar pet
⭕Ku, weapon pet
⭕Ku, leveling skill pet

Semangat build pet nya ya kak😁👍`
        },
        'ku, blacksmith': {
            filePath: './resource_media/banner.jpeg',
            caption: `Ku's Bot Blacksmithing Information Services😁👍

⭕Ku, lvling prof 'level prof kalian'
⭕Ku, statbs
⭕Ku, smithing chance

Woah ada yang ingin jadi murid zaldo, semangat leveling prof nya ya kak😁👍`
        },
        'ku, bahanmq': {
            filePath: './resource_media/banner.jpeg',
            caption: `Ku's Bot Main Quest Item Information Services😁👍

Daun Colon 5 pcs
- Boss : Boss Colon (Tanah Pembamgunan)
- Mob : Colon (Tanah Pembangunan)

Sisik Naga 2 pcs
- Mob : Piedra (Padang Garam Reug : Kamp Pengelana)
- Mob : Cobre (Danau Icule)

Daging Domba 1 pcs
- Mob : Wooly (Padang Garam Reug : Kamp Pengelana)

Sayap Peri 3 pcs
- Mob : Roar (Kuil Runtuh : Area 2)

Paruh Tebal 3 pcs
- Mob : Beak (Kuil Runtuh : Area 1)

Sulur 3 pcs
- Mob : Pain Leaf (Tanah Genting Kaus)

Koin Ksatria 20 pcs
- Mob : Boneka Pendekar (Kastil Setan Bulan : Ruang ke 1)

Daging Tikus Pasir 1 pcs
- Mob : Tikus Pasir (Tanah Tinggi Centerio)

Cakar Binatang Buas 3 pcs
- Mob : Foxiger (Tanah Tinggi Centerio)

Kulit Kodok Pasir 5 pcs
- Mob : Sand Frosch (Tanah Tinggi Centerio)

Taring Bergerigi 10 pcs
- Mob : Miwi (Danau Icule)
- Mob : Rutin (Gunung Nisel : Lereng)

Kristal Saham 5 pcs
- Mob : Rotta Nemico (Gua Bawah Tanah Saham : B1)

Permata Jiwa 1 pcs
- Mob : Cassy (Makam Ratu Kuno Area 2)

Anggur Rokoko 5 pcs
- Mob : Kijimu (Dataran Rokoko)

Kayu Labilans 10 pcs
- Mob : Toretta (Distrik Labilan : Area 2)

Tanduk Patah 20 pcs
- Mob : Rinoceros (Danau Rawa Pelarian : Area 2)

Bijih Berkembang 5 pcs
- Mob : Orictoceras (Kabla Jabali)

Batu Jabali 5 pcs
- Mob : Gemare (Kabla Jabali)

Semangat mainquest nya ya kak, saran jangan langsung di habisin sih 😁👍`
        },
        'ku, upkoleksi': {
            filePath: './resource_media/banner.jpeg',
            caption: `Ku's Bot Upgrade Collection Bag Information Services😁👍

*50-51*
- Kulit Colon x1 (Colon; Tanah Pembangunan

*51-52*
- Kulit Berkualitas x1 (Lavarca; Dataran Rakau)

*52-53*
- Spina x1.000

*53-54*
- Kulit Minotaur x1 (Minotaur; Kuil Runtuh: Area Terlarang)
- Pecahan Kristal Jingga x1 (Cobre; Danau Icule)

*54-55*
- Kulit Anjing Hutan x1 (Anjing Hutan; Hutan Marbabo: Bagian Dalam)
- Lencana Goblin x1 (Boss Goblin; Gua Ribisco: Bagian Dalam)

*55-56*
- Spina x2.000

*56-57*
- Bulu Mochelo x1 (Mochelo; Lereng Merapi A3)
- Kain Linen x10 (Crow Killer; Dusun Douce)

*57-58*
- Bulu Naga Giok x1 (Forestia; Tanah Kaos)
- Tanduk Berkualitas x10 (Bandot; Tanah Tinggi Yorl)

*58-59*
- Sabuk Bos Roga x1 (Boss Roga; Gua Bawah Tanah Saham: Ujung)
- Kain Beludu x10 (Orc Petarung; Gua Bawah Tanah Saham)

*59-60*
- Spina x4.000

*60-61*
- Cakar Beruang x2 (Violaccoon; Padang Darkanon)
- Sheeting Fabric x20 (Cassy; Makam Ratu Kuno: Area 2)

*61-62*
- Rantai Kukuh x2 (Pendekar Bertopeng; Tanah Tinggi Pertanian)
- Kain Polister x20 (Boneka Pengembara; Kota Hilang)

*62-63*
- Sisik Naga Sabana x2 (Naga Sabana Yelb; Desa Albatif)
- Kulit Serigala Alien x20 (Serigala Luar; Gerbang Dunia Lain: Area 1)

*63-64*
- Spina x8.000

*64-65*
- Jubah Sobek x2 (Goovua; Gurun Akaku: Bukit)
- Kulit Tupai x20 (Rodentail; Maia Diela)

*65-66*
- Tanduk Elang Zamrud x2 (Elang Zamrud; Teras Kerikil)
- Bulu Kambing x20 (Koza; Jurang Dunkel)

*66-67*
- Sayap Naga Senja x2 (Naga Senja; Benteng Solfini: Atap)
- Bulu Halus x20 (Little Snow Boar; Lembah Es Polde)

*67-68*
- Spina x16.000

*68-69*
- Rantai Penyucian x2 (Cerberus; Mata Air Kelahiran: Puncak)
- Kain Goyah x20 (Jewel Eye; Mata Air Kelahiran: Tengah)

*69-70*
- Benang Aranea x2 (Aranea; Taman Sublimasi: Pusat)
- Benang Laba-Laba Kecil x20 (Aramia; Taman Sublimasi: Area 2)

*70-71*
- Kain Dewi Tiruan x3 (Imitacia; Istana Gelap: Aula Besar)
- Kain Apung x10 (Flying Executioner; Buaian Prajurit)
- Tapak Lembut x20 (Bunny Summoner; Sungai Kegelapan)

*71-72*
- Surai Hewan Iblis x3 (Memecoleous; Istana Gelap: Area2)
- Bantalan Tapak Keras x10 (Manticore; Istana Gelap: Area1)
- Bulu Bayangan Hitam x20 (Shadow Fly; Istana Gelap: Area1)

*72-73*
- Spina 32.000

*73-74*
- Bulu Tapir x3 (Tapir; Graben Membara: Permukaan)
- Bulu Kaku x10 (Wooly; Graben Membara: Permukaan)
- Minyak Anti Karat x20 (Ornis Demi Machina; Garis Pertahanan Artileri Otomatis)

*74-75*
- Kain Kuno x3 (Proto Leon; Reruntuhan Singolaire: Lantai 3)
- Kulit Pohon Lunak x10 (Floral Bee; Situs Simcracker)
- Rambut Potum Kotor x20 (Slum Potum; Klaspe Kumuh)

*75-76*
- Tulang Raksasa Merah x3 (Dusk Machina; Pabrik Demi Machina Kecil: Area 2)
- Mantel Hitam Sobek x10 (Rugos Demi Machina; Pabrik Demi Machina Kecil: Area 2)
- Rantai Putus x20 (Machina Penyiksa; Pabrik Demi Machina Kecil: Area 2)

*76-77*
- Sisik Chimera x3 (Mozto Machina; Pabrik Demi Machina Besar: Bagian Terdalam)
- Benda Pendar Aneh x10 (Horn Machina; Pabrik Demi Machina Besar)
- Tentakel Tangguh x20 (Ledon Machina; Pabrik Demi Machina Besar)

*77-78*
- Spina x64.000

*78-79*
- Jubah Roh Hutan x3 (Lalvada; Hutan Monster: Bagian Dalam)
- Taring Tanaman x10 (Nepenthe; Hutan Monster)
- Kain Felt x20 (Naga Boneka; Mansion Lufenas)

*79-80*
- Aloi Lyark x3 (Gwaimol; Penjara Cuervo: Atap)
- Baju Penjaga Robek x10 (Sipir Lyark; Penjara Cuervo: Lantai 2)
- Kain Lembu x20 (Lyark Spesialis; Laboratorium Brahe: Area 2)

*80-81*
- Kain Bercahaya x4 (Seraph Machina: Menara Penembus Bumi: Sisi Dalam)
- Kulit Sintetis Rusak x20 (Lyark Brawler: Sekitar Alun-Alun Droma)
- Cawat Pengeksekusi x20 (Volo: Sekitar Alun-Alun Droma Area 2)

*81-82*
- Potongan Baju K. Kecil x4 (Venena: Istana Ultimea: Takhta)
- Pecahan Zirah Keras x20 (High Tigris: Istana Ultimea Gudang Demi Machina)
- Kulit Ular x20 (Ular Kolam: Reservoir Copia)

*82-83*
- Spina x100.000

*83-84*
- Kulit Mama Fluck x4 (Mama Fluck: Gua Pelupa)
- Daun Besar Colon x20 (Leedle Colon: Dataran Rokoko)
- Bulu Garis Vertikal x20 (Rakun Tambun: Hutan Curonne)

*84-85*
- Kain Rohani Mardula x4 (Mardula: Serambi Dewa Berkah)
- Kain Berkilau Misterius x20 (Malaikat Gelembung: Koridor Heresi/Kuil Para Dewa/Serambi Dewa Pembangunan/Serambi Dewa Istimewa)
- Bulu Kelabu x20 (Haliabubo: Reruntuhan G. Mithurna: Koridor Atas)

*85-86*
- Mantel Carbuncle x4 (Carbuncle: Serambi Dewa Pembangunan)
- Kain Rajut x20 (Malaikat Gelembung: Koridor Heresi/Kuil Para Dewa/Serambi Dewa Pembangunan/Serambi Dewa Istimewa)
- Ekor Beruang Berkantong x20 (Oddy: Kuil Para Dewa: Area 4/Serambi Dewa Pembangunan)

*86-87*
- Bulu Raja Piton x4 (Raja Piton: Pegunungan Elf: Kuil)
- Bulu Putih Lebat x20 (Bandot: Taman Es &Salju)
- Bulu Abu Kaku x20 (Silveria: Pegunungan Elf)

*87-88*
- Ingot Kuno x4 (Golem Preman: Kuil Naga Kegelapan: Tengah)
- Taring Serigala Es x20 (Corloup: Pegunungan Elf)
- Kain Gelap x20 (Soul Reaper: Kuil Naga Kegelapan)

*88-89*
- Spina x200.000

*89-90*
- Taring Tuscog x4 (Tuscog: Jalan Eryldan: Sekitar Hutan Ein)
- Larva Silk x20 (Tikus Lumut: Hutan Ein)
- Taring Manusia Serigala x20 (Wolfret: Jalan Eryldan)

*90-91*
- Serpihan Kayu Kuzto x5 (Kuzto; Distrik Labilans: Alun-Alun)
- Bulu Cerpelai x20 (Satwal; Distrik Fabriska)
- Sabuk Pinggang Misterius x30 (Moculus; Distrik Fractum: Area 1)

*91-92*
- Kantong Kristal x5 (Nemopirania; Distrik Racetacula: Area 1)
- Mantel Bulu Sreg x20 (Tenoblepas; Dataran Rokoko)
- Papula Kuat x30 (Toksinaria; Distrik Racetacula: Area 1)

*92-93*
- Sayap Repthon x5 (Repthon; Zona Riset Delzton: Area Terdalam)
- Kancing Polong x20 (Colon Marquis; Reruntuhan Mansion Lufenas Tua)
- Kain Perca Jas Panjang x30 (Gulingkar; Zona Riset Delzton: Area 1)

*93-94*
- Rambut Kaisar Siluman x5 (Venena Metacoenubia; Neo Plastida)
- Kain Merah Sobek x20 (Potum Bandit Gurun; Gurun Pasir Geist: Area 1) 
- Kulit Karatan x30 (Jasman; Reruntuhan Elban Urban)

*94-95*
- Spina x300.000

*95-96*
- Tulang Pisteus x5 (Pisteus; Pesisir Ducia: Area Terdalam)
- Kain Phantom x20 (Flooray; Dasar Tebing Lunagent)
- Bulu Berang-Berang Laut x30 (Lutris; Pesisir Ducia: Area 3)

*96-97*
- Sayap Arachnidemon x5 (Arachnidemon; Lembah Arche: Area Terdalam)
- Belenggu Logam x20 (Besy; Lembah Arche)
- Kulit Ular Aneh x30 (Coofer; Reruntuhan Kota Rokoko)

*97-98*
- Jangat Berlendir x5 (Datuk Nezim; Lahan Basah Nezim)
- Kain Enty x20 (Enty; Rimba Penyihir)
- Poros Kokoh x30 (Orang2an Sawah Seram; Rimba Penyihir: Area 2)

*98-99*
- Perca Gendam Geni x5 (Hexter; Rimba Penyihir: Area Terdalam)
- Piring Kappa x20 (Kappadon; Lahan Basah Nezim)
- Bulu Gagak x30 (Orang2an Sawah Seram; Rimba Penyihir: Area 2)

*99-100*
- Inti Latebra Menggeliat x5 (Trocostida; Nov Diela: Area 1)
- Cairan Lekat x20 (Juvestida; Nov Diela: Area 1)
- Kulit Pelik x30 (Mata Jahat; Padang Morga: Area 1)`
        },
        'ku, scammer': {
            filePath: './resource_media/banner.jpeg',
            caption: `Ku's Bot Scammer List Warning!!!

*IGN SCAMMER*
- ★minato★
- ★Yabokuくん
- ALucas™
- ★Së lë ñ æ★
- Isahhヤ
- Licht Bachイグ
- ユズ·フェメス
- its me

*NO WA SCAMMER*
- 0858-6765-5541
- 0813-7853-4244
- 0895-3290-17165
- 0896-7330-2391
- 0896-5227-7913
- 0895-3869-22031
- 0857-6638-2589
- 0895-4059-23300
- 0895-0855-4192
- 0822-1675-1510
- 0857-6602-6261
- 0881-3890-609
- 0831-2889-2583
- 0859-6020-3148
- 0877-5659-6401
- 0852-8047-9214

*REK SCAMMER*
- 0812-9222-4255 ( Dana )
- 0858-4872-6713 ( Dana )
- 0896-7330-2391 ( Gopay )           

Woah hati hati ya semua apalagi kalau mau RMT pastikan RMT sama yang terpercaya ajah😁👍`
        },
        'ku, farm mats': {
            filePath: './resource_media/banner.jpeg',
            caption: `Ku's Bot Farming Mats Information Services😁👍

⭕Ku, farm logam'
⭕Ku, farm kain
⭕Ku, farm kayu
⭕Ku, farm fauna
⭕Ku, farm obat
⭕Ku, farm mana

Semangat farming nya ya kak😁👍`
        }
    };

    const lowerCaseMessage = message.body.toLocaleLowerCase();

    if (commands[lowerCaseMessage]) {
        const {
            filePath,
            caption
        } = commands[lowerCaseMessage];
        const media = MessageMedia.fromFilePath(filePath);
        await client.sendMessage(message.from, media, {
            caption
        });
    }
});

//function untuk say hi kemember baru
client.on('message', message => {
    if (message.body.toLocaleLowerCase() === 'ku, ada member baru nih') {
        message.reply("Woah Iyah kak! Selamat datang member baru di guild! Yuk kenalan dulu dan saya siap membantu perkenalanya ^^ \nSilakan copas dan isi nama IGN Kaka di bawah yaa\n\nHaloo salken semua aku member baru\nIGN Name: \nAsal: \nUmur: \nGender: \nPacar: \nHobi: \nBuff land: \nTerimakasih semua sudah diizinkan gabung guild");
    }
});

//function untuk lvling
client.on('message', message => {
    // Mengubah pesan menjadi huruf kecil untuk menghindari perbedaan case
    const lowerCaseMessage = message.body.toLowerCase();

    // Memeriksa apakah pesan mengandung "lvling" diikuti oleh angka
    const lvlingMatch = lowerCaseMessage.match(/^lvling (\d+)$/);

    if (!lvlingMatch) return;

    const level = parseInt(lvlingMatch[1]);

    // Objek data leveling
    const levelingData = [{
            minLevel: 1,
            maxLevel: 40,
            reply: "Pova ( Earth ) \nType : Mob \nLevel 1-40 \nMap : Lonogo Canyon (Ngarai Lonogo)"
        },
        {
            minLevel: 41,
            maxLevel: 56,
            reply: "Bone Dragonewt ( Dark ) \nType : Mob \nLevel 40-57 \nMap : Ancient Empress Tomb: Area 1 (Makam Ratu Kuno: Area 1)"
        },
        {
            minLevel: 57,
            maxLevel: 62,
            reply: "Flare Volg ( Fire ) \nType : Boss \nDifficulty : Hard \nLevel : 57-62 \nMap : Fiery Volcano: Lava Trail (Lereng Merapi: Jejak Lava)"
        },
        {
            minLevel: 63,
            maxLevel: 70,
            reply: "Flare Volg ( Fire ) \nType : Boss \nDifficulty : Nightmare \nLevel : 63-70 \nMap : Fiery Volcano: Lava Trail (Lereng Merapi: Jejak Lava)"
        },
        {
            minLevel: 71,
            maxLevel: 79,
            reply: "Masked Warrior (Pendekar Beratopeng) ( Fire ) \nType : Boss \nDifficulty : Hard \nLevel : 71-79 \nMap : Land Under Cultivation: Hill (Tanah Pertanian: Tanah Tinggi)"
        },
        {
            minLevel: 80,
            maxLevel: 95,
            reply: "Masked Warrior (Pendekar Beratopeng) ( Fire ) \nType : Boss \nDifficulty : Nightmare \nLevel : 80-95 \nMap : Land Under Cultivation: Hill (Tanah Pertanian: Tanah Tinggi)"
        },
        {
            minLevel: 96,
            maxLevel: 112,
            reply: "Masked Warrior (Pendekar Beratopeng) ( Fire ) \nType : Boss \nDifficulty : Ultimate \nLevel : 96-112 \nMap : Land Under Cultivation: Hill (Tanah Pertanian: Tanah Tinggi) \n\nAlternatif \nDon Yeti ( Earth ) \nType : Mini Boss \nMap : Polde Ice Valley (Lembah Es Polde)"
        },
        {
            minLevel: 113,
            maxLevel: 125,
            reply: "Cerberus ( Water ) \nType : Boss \nDifficulty : Nightmare \nLevel : 113-125 \nMap : Spring of Rebirth: Top (Mata Air Kelahiran: Puncak)"
        },
        {
            minLevel: 126,
            maxLevel: 129,
            reply: "Lapin The Necromancer (Dukun Lapin) ( Neutral ) \nType : Mini Boss \nLevel : 126-129 \nMap : Trace of Dark River (Sungai Kegelapan) \n\nNote :\nSimpan meterial 'Lapins Souls', kamu dapat xp tambahan dari side quest di\nNoble Spirit's Lv83 atau kamu dapat menjualnya dengan harga tinggi di Papan."
        },
        {
            minLevel: 130,
            maxLevel: 146,
            reply: "Cerberus ( Water ) \nType : Boss \nDifficulty : Ultimate \nLevel : 130-146 \nMap : Spring of Rebirth: Top (Mata Air Kelahiran: Puncak) \n\nAlternatif \nMemecoleolus ( Neutral ) \nType : Boss \nDifficulty : Ultimate \nLevel : 132-146 \nMap : Dark Castle: Area 2 (Istana Gelap: Area 2) \n\nBuilder Golem (Builder Golem) ( Neutral ) \nType : Mini Boss \nLevel : 132-143 \nMap : Huge Crysta Factory: 3rd Floor (Pabrik Crysta Raksasa: Lantai 3)"
        },
        {
            minLevel: 147,
            maxLevel: 162,
            reply: "Venena Coenubia ( Fire ) \nType : Boss \nDifficulty : Hard \nLevel : 147-162 \nMap : Ultimea Palace: Throne (Istana Ultimea: Takhta) \n\nAlternatif\nIfrid ( Fire ) \nType : Boss \nDifficulty : Ultimate \nLevel : 146-154 \nMap : Blazing Graben: Deepest Part (Graben Membara: Bagian Terdalam) \n\nYork ( Neutral ) \nType : Boss \nDifficulty : Ultimate \nLevel : 154-166 \nMap : Huge Crysta Factory: Storage (Pabrik Crysta Raksasa: Gudang) \n\nSuper Death Mushroom (Jamur Super Mampus) ( Dark )\nType : Mini Boss \nLevel : 143-158 \nMap : Monster's Forest: Animal Trail (Hutan Monster: Jalan Hewan) \n\nCommander Golem (Komandan Golem) ( Dark ) \nType : Mini Boss \nLevel : 146-162 \nMap : Lufenas Mansion: Entrance (Mansion Lufenas: Pintu Masuk)"
        },
        {
            minLevel: 163,
            maxLevel: 179,
            reply: "Venena Coenubia ( Fire ) \nType : Boss \nDifficulty : Nightmare \nLevel : 163-179 \nMap : Ultimea Palace: Throne (Istana Ultimea: Takhta) \n\nAlternatif\nMozto Machina ( Neutral ) \nType : Boss \nDifficulty : Ultimate \nLevel : 162-172 \nMap : Large Demi Machina Factory A4"
        },
        {
            minLevel: 180,
            maxLevel: 182,
            reply: "Altoblepas ( Neutral ) \nType : Mini Boss \nMap : Rokoko Plains (Dataran Rokoko)"
        },
        {
            minLevel: 183,
            maxLevel: 199,
            reply: "Venena Coenubia ( Fire ) \nType : Boss \nDifficulty : Ultimate \nLevel : 182-199 \nMap : Ultimea Palace: Throne (Istana Ultimea: Takhta) \n\nAlternatif \nMom Fluck (Mama Fluck) ( Water ) \nType : Boss \nDifficulty : Ultimate \nLevel : 190-199 \nMap : Forgotten Cave (Gua Pelupa) \n\nSeele Zauga ( Light )\nType : Boss \nDifficulty : Ultimate \nLevel : 193-209 \nMap : Shrine of the Goddess of Species (Kuil Dewi Spesies)"
        },
        {
            minLevel: 200,
            maxLevel: 215,
            reply: "Finstern the Dark Dragon (Finstern si Naga Kegelapan) ( Dark )\nType : Boss \nDifficulty : Ultimate \nLevel : 200-215 \nMap : Dark Dragon Shrine: Near the Top (Kuil Naga Kegelapan: Dekat Puncak) \n\nNote :\nMaterial 'Suspicious Old Boxes' cukup mahal kamu dapat menjualnya di papan."
        },
        {
            minLevel: 216,
            maxLevel: 227,
            reply: "Kuzto ( Earth ) \nType : Boss \nDifficulty : Ultimate \nLevel : 216-227 \nMap : Labilans Sector: Square (Distrik Labilans: Alun-Alun)"
        },
        {
            minLevel: 228,
            maxLevel: 244,
            reply: "Arachnidemon ( Dark )\nType : Boss \nDifficulty : Ultimate \nLevel : 227-244 \nMap : Arche Valley: Depths (Lembah Arche: Area Terdalam) \n\nAlternatif\nBullamius ( Earth )\nType : Mini boss \nLevel : 234-246 \nMap : Storage Yard A2"
        },
        {
            minLevel: 245,
            maxLevel: 253,
            reply: "Ferzen the Rock Dragon (Ferzen si Naga Batu) ( Earth )\nType : Boss \nDifficulty : Ultimate \nLevel : 245-253 \nMap : Guardian Forest: Giant Tree (Hutan Lindung: Pohon Raksasa) \n\nAlternatif\nIgnitrus ( Fire )\nType : Mini Boss \n Level : 246-254 \n Map : Vulcani Crater Base"
        },
        {
            minLevel: 254,
            maxLevel: 266,
            reply: "Trickster Dragon Mimyugon ( Earth ) \nType : Boss \nDifficulty : Nightmare \nLevel : 254-266 \nMap : Operation Zone Cockpit-Area \n\nAlternatif\nBrassozard ( Earth ) \nType : Mini Boss \nLevel : 256-262 \nOperation Zone A3 \n\nNote : \nMimyu terkenal dengan boss yang perlu cukup banyak 'physical pierce'"
        },
        {
            minLevel: 267,
            maxLevel: 272,
            reply: "Red Ash Dragon Rudis ( Earth ) \nType : Boss \nDifficulty : Hard \nLevel : 267-272 \nMap : Espuma Dome A4 \n\nAlternatif\nTrus ( Fire ) \nType : Mini Boss \nLevel : 262-277 \nMap : Propulsion System Zone A3 \n\nNote : \nLebih baik teleport ke aquacity lalu pindah daripada langsung teleport ke 'Espuma Dome (Kubah Espuma)'"
        },
        {
            minLevel: 273,
            maxLevel: 290,
            reply: "Trickster Dragon Mimyugon ( Earth ) \nType : Boss \nDifficulty : Ultimate \nLevel : 273-290 \nMap : Operation Zone Cockpit-Area \n\nAlternatif\nRed Ash Dragon Rudis ( Earth ) \nType : Boss \nDifficulty : Nightmare \nLevel : 272-290 \nMap : Espuma Dome A4 \n\nNote :\nMasa masa dimana exp seret banget ada baiknya simpan beberapa Bab main quest untuk ini"
        },
    ];

    // Mencari level yang sesuai dalam data leveling
    const response = levelingData.find(data => level >= data.minLevel && level <= data.maxLevel);

    // Jika ada yang cocok, kirimkan reply
    if (response) {
        message.reply(response.reply);
    } else {
        message.reply("Data leveling baru menyentuh cap level 290")
    }
});

//leveling proof
client.on('message', message => {
    // Mengubah pesan menjadi huruf kecil untuk menghindari perbedaan case
    const lowerCaseMessage = message.body.toLowerCase();

    // Memeriksa apakah pesan mengandung "lvling prof" diikuti oleh angka
    const lvlingProfMatch = lowerCaseMessage.match(/^ku, lvling prof (\d+)$/);

    if (!lvlingProfMatch) return;

    const level = parseInt(lvlingProfMatch[1]);

    // Objek data leveling profisiensi
    const levelingProfData = [{
            minLevel: 1,
            maxLevel: 5,
            reply: "Level 1 - 5\n[Pedang 1 Tangan] Pedang Pendek\nResep: 3x Mats. Logam"
        },
        {
            minLevel: 5,
            maxLevel: 10,
            reply: "Level 5 - 10\n[Zirah] Baju Pengelana\nResep: 35x Sayap Burung\n40x Mats. Kain"
        },
        {
            minLevel: 10,
            maxLevel: 50,
            reply: "Level 10 - 50\n[Tinju] Hard Knuckles\nResep:\n20x Pelat Abu-Abu\n5x Minyak Jernih Murni\n100x Mats. Logam\n25x Mats. Kain"
        },
        {
            minLevel: 50,
            maxLevel: 90,
            reply: "Level 50 - 90\n[Pedang 1 Tangan] Pedang Indigo\nResep:\n20x Sirip Pedang Panas\n5x Pedang Cacat\n125x Mats. Logam\n100x Mats. Fauna"
        },
        {
            minLevel: 90,
            maxLevel: 120,
            reply: "Level 90 - 120\n[Zirah] Baju Diomedea\nResep:\n25x Kain Lembu\n10x Batu Ultimea\n250x Mats. Kain\n50x Mats. Logam"
        },
        {
            minLevel: 120,
            maxLevel: 140,
            reply: "Level 120 - 140\n[Tombak] Tombak Baskara\nResep :\n5x Prasasti Bersinar\n20x Halo Terputus\n300x Mats. Logam\n50x Mats. Kayu"
        },
        {
            minLevel: 140,
            maxLevel: 170,
            reply: "Level 140 - 170\n[Katana] Bakung Lelabah Merah\nResep:\n20x Kulit Ular Aneh\n5x Kristal Merah Kehitaman\n225x Mats. Kayu\n200x Mats. Logam"
        },
        {
            minLevel: 170,
            maxLevel: 200,
            reply: "Level 170 - 200\n[Tinju] Cakar Archanida\nResep:\n2x Air Ajaib Berseri\n2x Tanduk Arachnidemon\n1.500x Mats. Fauna\n500x Mats. Logam\n[Pedang 2T] Golok Pembunuh Naga\nResep :\n5x Fragmen Kerlip Cahaya\n20x Batu Bara Berkualitas\n300x Mats. Logam\n200x Mats. Kayu"
        },
        {
            minLevel: 200,
            maxLevel: 220,
            reply: "Level 200 - 220\n[Busur] Busur Naga Api Beracun\nResep:\n2x Cakar Sayap Merah Ungu\n1x Kelenjar Racun Panas\n1.500x Mats. Fauna\n700x Mats. Kayu"
        },
        {
            minLevel: 220,
            maxLevel: 250,
            reply: "Level 220 - 250\n[Zirah] Baju Pengelabu\nResep:\n4x Kulit Naga Penyamar\n1x Mata Naga Penyamar\n1.250x Mats. Fauna\n1.200 Mats. Kain"
        }
    ];

    // Mencari level yang sesuai dalam data leveling profisiensi
    const response = levelingProfData.find(data => level >= data.minLevel && level <= data.maxLevel);

    // Jika ada yang cocok, kirimkan reply
    if (response) {
        message.reply(response.reply);
    } else {
        message.reply("Data leveling prof belum tersedia untuk level tersebut.");
    }
});

//command list upgrade xtall
client.on('message', message => {
    const msg = message.body.toLowerCase().trim();

    if (msg.startsWith("ku,")) {
        let replyMessage = '';

        switch (msg) {
            case "ku, xtall normal":
                replyMessage = `DAFTAR UPGRADE CRYSTA

🔵 LIST UP XTALL NORMAL 🔵
=========================
VERSI INDONESIA
1. Ksatriaja - Volotur - Brassozard
2. Lobalawar - Melancia
3. Nurethoth - Guignol - Golem Satpam
4. Aranea - Blazingur
5. Shawle - Dutannen
6. Gespenst - Salamander -> Bullamius
7. Minotaur - Rhinosaurus
8. Naga Beringas Decel - York - Tuscog - Bayangan Hitam - Torexesa
9. Metal Stinger - Kapten Lyark Spesialis - Ageladanios
10. Odelon Machina - Pret - Lilicarolla
11. Coryn Besar - Seraph Machina - Limacina
12. Crimsosh - Amoeba Machina
13. Potum Raja - Potum Platina
14. Flare Volg - Charugon
15. Bos Petapa Kadal - Orictoceras
16. Gravicep - Naga Abu Merah Rudis
17. Lynx Mithurna - Kuffania

=========================
ENGLISH VERSION
1. Gigan Knight - Volotur - Brassozard
2. Radibat - Melancia
3. Nurethoth - Guignol - Guard Golem
4. Aranea - Blazingur
5. Shawle - Dutannen
6. Gespenst - Salamander - Bullamius
7. Minotour - Rhinosaur
8. Brutal Dragon Decel - York - Tuscog - Black Shadow - Torexesa
9. Metal Stinger - Lyark Master Specialist - Ageladanios
10. Odelon Machina - Tappler - Lilicarolla
11. Big Coryn - Seraph Machina - Limacina
12. Crimsosch - Amoeba Machina
13. King Potum - Platinum Potum
14. Flare Volg - Charugon
15. Fanadon - Orictoceras
16. Gravicep - Red Ash Dragon Rudis
17. Mithurna Lynx - Kuffania`;
                break;
            case "ku, xtall weapon":
                replyMessage = `DAFTAR UPGRADE CRYSTA

🔴 LIST UP XTALL WEAPON 🔴
=========================
VERSI INDONESIA
1. Metasrigala - Cakar Kucing Kissatpam
2. Pomie Chan - Pomie Chan II
3. Potum Pahlawan - Potum Pahlawan II - Potum Pahlawan III - Potum Pahlawan IV
4. Ganglef - Machina Tiran - Vulture - Naga Penyamar Mimyugon
5. Armasit - Kadal Bunga
6. Imitacia - Finstern si Naga Kegelapan - Oculasignio
7. Imitator - Mardula - Velum
8. Golem Pilar - Machina Ultima - Vlam si Naga Api
9. Zahhak Machina - Penyihir Besi Bercakar - Naga Meraung Bovinari
10. Iblis Kristal Jahanam - Shampy - Irestida - Vatudo
11. Ksatria Buruk Dusta - Gwaimol - Hexter - Don Profundo
12. Gerbang Iblis - Mozto Machina - Pisteus - Naga Jahat Fazzino
13. Zolban - Repthon - Naga Trompet Reguita
14. Pedang Sihir Iblis - Kristal Berlumur Darah
15. Mbah Dukun Usasama - Mbah Dukun Usasama II
16. Ganglef - Kepiting Bulan Besar
17. Dukun Lapin - Momok Gelembung
18. Golem Galian - Builder Golem
19. Pedang Neo Maton - Pedrio
20. Zega III - Zega IV - Zega V - Zega VI - Zega VII
21. Sang Juara Megiston - Sang Juara Megiston II - Sang Juara Megiston III - Sang Juara Megiston IV - Sang Juara Megiston V
22. Arbogazella - Doridodi
23. Armasit - Diark

=========================
ENGLISH VERSION
1. Blancanine the White Fang - Cat Claw Guardkissa
2. Pomie Chan - Pomie Chan II
3. Hero Potum - Hero Potum II - Hero Potum III - Hero Potum IV
4. Ganglef - Tyrant Machina - Vulture - Trickster Dragon Mimyugon
5. Armasite - Florizard
6. Imitacia - Finstern the Dark Dragon - Oculasignio
7. Imitator - Mardula - Velum
8. Pillar Golem - Ultimate Machina - Vlam the Flame Dragon
9. Zahhak Machina - Clawed Iron Witch - Raging Dragon Bovinari
10. Evil Crystal Beast - Shampy - Irestida - Vatudo
11. Black Knight of Delusion - Gwaimol - Hexter - Don Profundo
12. Demon's Gate - Mozto Machina - Pisteus - Wicked Dragon Fazzino
13. Zolban - Repthon - Brass Dragon Reguita
14. Evil Magic Sword - Blood Smeared Crystal
15. Usasama the Necromancer - Usasama the Necromancer II
16. Ganglef - Giant Moon Crab
17. Lapin The Necromancer - Bubble Bogey
18. Excavated Golem - Builder Golem
19. Neo Maton Sword - Pedrio
20. Zega III - Zega IV - Zega V - Zega VI - Zega VII
21. Megiston The Champion - Megiston The Champion II - Megiston The Champion III - Megiston The Champion IV - Megiston The Champion V
22. Arbogazella - Doridodi
23. Armasite - Diark`;
                break;
            case "ku, xtall armor":
                replyMessage = `DAFTAR UPGRADE CRYSTA

🟢 LIST UP XTALL ARMOR 🟢
=========================
VERSI INDONESIA
1. Cerabes - Mimesia - Sakura Merah Jelita - Baavgai
2. Kruztor - Kruztor II
3. Sosok Jahat - Velly Hitam
4. Pilz Erosi - Filrocas
5. Golem Preman - Naga Langkisau
6. Ifrid - Mama Fluck - Gordel
7. Forestia - Glaucius
8. Usakichi - Usami - Usamochi
9. Bos Roga - Iconos - Ornlaf - Roga Safir - Ferzen si Naga Batu - Walican
10. Gopherga - Yuveria
11. Cerberus - Pyxtica - Gemma
12. Noeliel - Noeliel si Patung Es Suci - Kucing Yule - Gegner
13. Quasar Jahanam - Mata Jahanam
14. Colon Komandan - Goleps
15. Elang Zamrud - Jamur Super Mampus
16. Tortuga - Daddy Finpen - Capo Profundo
17. Dr. Leonardo - Dr. Leonardo II
18. DX Fighter - DX Fighter II
19. Arachnidemon - Zapo

=========================
ENGLISH VERSION
1. Cerabes - Mimesia - Dreamy Scarlet Sakura - Baavgai
2. Kruztor - Kruztor II
3. Evil Shadow - Black Velly
4. Eroded Pilz - Filrocas
5. Thug Golem - Galegon
6. Ifrid - Mom Fluck - Gordel
7. Forestia - Glaucius
8. Usakichi - Usami - Usamochi
9. Boss Roga - Iconos - Ornlaf - Sapphire Roga - Ferzen the Rock Dragon - Walican
10. Gopherga - Yuveria
11. Cerberus - Pyxtica - Gemma
12. Noeliel - Noeliel the Ice Statue - Yule Cat - Gegner
13. Demonic Quasar - Demonic Eye
14. Colon Commander - Goleps
15. Jade Raptor - Super Death Mushroom
16. Tortuga - Daddy Finpen - Capo Profundo
17. Dr. Leonardo - Dr. Leonardo II
18. DX Fighter - DX Fighter II
19. Arachnidemon - Zap`;
                break;
            case "ku, xtall adds":
                replyMessage = `DAFTAR UPGRADE CRYSTA

🟡 LIST UP XTALL ADDITIONAL 🟡
==========================
VERSI INDONESIA
1. Kapten Karatan - Exdocus
2. Warmonger - Proto Leon - Raja Piton - Naga Membara Igneus
3. Naga Senja - Baphomela - Bayangan Biru Tafakur
4. Naga Sabana Yelb - Roda Kelana - Roda Kelana Neo
5. Naga Sabana Yelb - Roda Kelana - Gordo
6. Pumpking - Jeila - Zoe - Zarth - Neewollah - Eripmav
7. Dusk Machina - Trokostida
8. Ayah Yashiro Azuki - Raja Kegelapan
9. Raja Kerbau - Paduka Raja Kerbau
10. Raja Kerbau - Pillow Kitagawa
11. Biskuit Buatan Tangan - Alfenix
12. Eidenliebe - Garnache
13. Gespenst II - Stellar Ooze
14. Adaro - Monster Dasar Laut
15. Seltirio - Tardigrademon
16. Iconos Emas - Kodok Riang - Gem Mas
17. Celeng Raksasa - Mega Alpoca
18. Tengkorak Emas - Solopy
19. Candela - Candela II - Amargon
20. Chocolate Ooze - Chocolate Ooze II - Soldner
21. Ratu Kuno - Ratu Kuno II
22. Altoblepas - Jiva
23. Grylee - Fantica

============================
ENGLISH VERSION
1. Corroded Knight Captain - Exdocus
2. Warmonger - Proto Leon - King Piton - Burning Dragon Igneus
3. Twilight Dragon - Baphomela - Prudent Blue Shadow
4. Grass Dragon Yelb - Wandering Wheel - Neo Wandering Wheel
5. Grass Dragon Yelb - Wandering Wheel - Gordo
6. Pumpking - Jeila - Zoe - Zarth - Neewollah - Eripmav
7. Dusk Machina - Trocostida
8. Yashiro Azuki's Dad - Dark Lord
9. Ox King - Royal Ox King
10. Ox King - Pillow Kitagawa
11. Handmade Cookie - Alfenix
12. Eidenliebe - Garnache
13. Gespenst II - Stellar Ooze
14. Adaro - Underwater Ruins Monster
15. Seltirios - Tardigrandemon
16. G. Iconos - Felicitoad -> Goldigem
17. Giant Boar - Mega Alpoca
18. Golden Skeleton - Solopy
19. Candela - Candela II - Amargon
20. Chocolate Ooze - Chocolate Ooze II - Soldner
21. Ancient Empress - Ancient Empress II
22. Altoblepas - Jiva
23. Grylee - Fantic`;
                break;
            case "ku, xtall ring":
                replyMessage = `DAFTAR UPGRADE CRYSTA

🟣 LIST UP XTALL RING 🟣
===========================
VERSI INDONESIA
1. Kristal Jahat - Tapir - Patissia - Sicanokami
2. Kristal Jahat - Kristal Misterius
3. Viscum - Deniala - Amalgam - Crysmort - Breeta
4. Bexiz - Zelbuse - Naga Milisi Turba
5. Dark Mushroom - Teertocrit
6. Baron Bling-bling - Roh Orang Mati
7. Venena - Venena II - Humida
8. Violaccoon - Ketua Bandit Gurun
9. Ooze - Lalvada - Dominaredor
10. Tentara Batu - Memecoleous
11. Volgagon - Etoise
12. Seele Zauga - Seele Zauga II
13. Potumotter - Potumotter II

===========================
ENGLISH VERSION
1. Eerie Crystal - Tapir - Patissia - Sicanokami
2. Eerie Crystal - Mysterious Crystal
3. Viscum - Deniala - Amalgam - Crysmort - Breeta
4. Bexiz - Zelbuse -> War Dragon Turba
5. Dark Mushroom - Teertocrit
6. Shining Gentleman - Espectro
7. Venena - Venena II - Humida
8. Violaccoon - Sand Bandits Leader
9. Ooze - Lalvada - Dominaredor
10. Stone Mercenary - Memecoleous
11. Volgagon - Etoise
12. Seele Zauga - Seele Zauga II
13. Potumotter - Potumotter II`;
                break;
            default:
                break;
        }

        // Cek jika replyMessage tidak kosong sebelum dikirim
        if (replyMessage) {
            message.reply(replyMessage);
        }
    }
});;

//list foodbuff
const buffs = {
    'ku, buff mp': {
        name: 'Max MP Lv10',
        codes: [
            '6052000', '1020808', '1200001', '1220069',
            '2011234', '7012828', '3204544', '6010021',
            '6070013', '1011212', '4010090', '3210666'
        ]
    },
    'ku, buff hp': {
        name: 'Max HP Lv10',
        codes: [
            '1010203', '6010062', '1010032', '1010084',
            '1011945', '1234567', '3011143'
        ]
    },
    'ku, buff ampr': {
        name: 'AMPR Lv10',
        codes: [
            '2010068', '5010031', '5236969', '1011010',
            '3063101', '1010006', '1011010', '1023040',
            '3062728', '1010017', '1010456', '4040404'
        ]
    },
    'ku, buff cr': {
        name: 'Crit Rate Lv10',
        codes: [
            '6022292', '1200069', '1010006', '1010092',
            '1010017', '1010050', '1011010', '1012000',
            '7162029', '1100000'
        ]
    },
    'ku, buff watk': {
        name: 'Weapon Atk Lv10',
        codes: [
            '1010810', '3081024', '1010029', '1010099',
            '6010024', '1011126', '2020404', '2010136',
            '3222223'
        ]
    },
    'ku, buff str': {
        name: 'STR Lv10',
        codes: [
            '1110033', '1011069', '7031997', '7070777',
            '4016699', '2020303', '3010095', '3010085'
        ]
    },
    'ku, buff dex': {
        name: 'DEX Lv10',
        codes: [
            '4084545', '1010058', '5010092', '1010106',
            '7011001', '2020222', '1010058'
        ]
    },
    'ku, buff int': {
        name: 'INT Lv10',
        codes: [
            '2020707', '6061294', '1010489', '6010701',
            '1032222'
        ]
    },
    'ku, buff agi': {
        name: 'AGI Lv10',
        codes: [
            '7162029', '2020037'
        ]
    },
    'ku, buff accuracy': {
        name: 'Accuracy Lv10',
        codes: [
            '4261111'
        ]
    },
    'ku, buff mres': {
        name: 'Magical Resist Lv10',
        codes: [
            '2020505', '5200052', '1010004', '7010016', '7030023'
        ]
    },
    'ku, buff pres': {
        name: 'Physical Resist Lv10',
        codes: [
            '1020001', '1100000', '3010034', '7010014'
        ]
    },
    'ku, buff frac': {
        name: 'Fractional Barrier Lv10',
        codes: [
            '7010082'
        ]
    },
    'ku, buff +aggro': {
        name: 'Additional Aggro% Lv10',
        codes: [
            '7171717', '3030110', '2020606', '3053131', '6262000',
            '1010207', '3204544', '3158668', '1016646', '3030110', '1010207'
        ]
    },
    'ku, buff -aggro': {
        name: 'Aggro% Reduction Lv 10',
        codes: [
            '1010038', '1010002', '1010147', '1016646', '6010009',
            '3010018'
        ]
    },
    'ku, buff dte earth': {
        name: 'Damage To Earth Lv10',
        codes: [
            '2020202'
        ]
    },
    'ku, buff dte wind': {
        name: 'Damage To Wind Lv 9',
        codes: [
            '3210101'
        ]
    },
    'ku, buff dte water': {
        name: 'Damage To Water Lv10',
        codes: [
            '3210100'
        ]
    },
    'ku, buff dte fire': {
        name: 'Damage To Fire Lv9',
        codes: [
            '3210106'
        ]
    },
    'ku, buff dte light': {
        name: 'Damage To Light Lv10',
        codes: [
            '3210105'
        ]
    },
    'ku, buff dte dark': {
        name: 'Damage To dark Lv10',
        codes: [
            '1190020', '3210104'
        ]
    },
    'ku, buff dt neutral': {
        name: 'Damage To Neutral Lv10',
        codes: [
            '3210102'
        ]
    },
    'ku, buff drop rate': {
        name: 'Drop Rate Lv6',
        codes: [
            '1010084', '4196969'
        ]
    },
};

//foodbuff command handle
client.on('message', message => {
    const lowerCaseMessage = message.body.toLowerCase().trim();

    if (buffs[lowerCaseMessage]) {
        const {
            name,
            codes
        } = buffs[lowerCaseMessage];
        const response = `Code Buff ${name} 😁👍\n\n` +
            codes.map(code => `${code} ${name}`).join('\n') +
            '\n\nNote: jika foodbuff berubah / salah harap lapor admin 😉';
        message.reply(response);
    }
});

//image reply
client.on('message', async message => {
    const lowerCaseMessage = message.body.toLocaleLowerCase();
    let mediaPath, caption;

    switch (lowerCaseMessage) {
        case 'ku, potensi pet':
            mediaPath = './resource_media/base_potensi_pet.jpeg';
            caption = 'Tabel base potensi pet';
            break;
        case 'ku, pola hindar pet':
            mediaPath = './resource_media/pola_hindar_pet.jpeg';
            caption = 'Tabel pola hindar pet bedasarkan Nature / Sifat';
            break;
        case 'ku, weapon pet':
            mediaPath = './resource_media/weapon_pet.jpeg';
            caption = 'Tabel bonus stat pet bedasarkan Weapon / Senjata';
            break;
        case 'ku, leveling skill pet':
            mediaPath = './resource_media/leveling_pet.jpeg';
            caption = 'tabel info leveling pet jika start dari level tertentu';
            break;
        case 'ku, donasi':
            mediaPath = './resource_media/donate_image.jpeg';
            caption = 'Kata owner ku buat jajan kak 😁👍';
            break;
        case 'ku, statbs':
            mediaPath = './resource_media/stat_blacksmith.jpeg';
            caption = 'Tabel potensial dari status untuk char blackmith';
            break;
        case 'ku, smithing chance':
            mediaPath = './resource_media/toram_online_smithing_success_rate.png';
            caption = 'Tabel success rate smithing menggunakan beberapa jenis ore';
            break;
        case 'ku, foodbuff lvling':
            mediaPath = './resource_media/lvlingFoodBuff.jpeg';
            caption = 'Jangan lupa siram tanaman buat bahan masak^^'
        default:
            return; // Do nothing if the message doesn't match
    }

    const media = MessageMedia.fromFilePath(mediaPath);
    await client.sendMessage(message.from, media, {
        caption
    });
});

//farming mats 
const farmLocations = {
    'ku, farm logam': `*LOGAM*
1. Celeng Kecil Mesin (Lembah Dalam Sykea)
2. Malaikat Gelembung (Kuil Dewa Berkah)
3. Hermit doll (Heresy Corridor)
4. Laduro (Terowongan Cobaan)`,

    'ku, farm kain': `*KAIN*
1. Potum Semedi (Koridor Heresi)
2. Cassy (Makam Ratu: Area 2)
3. Laduro (Terowongan Cobaan)`,

    'ku, farm kayu': `*KAYU*
1.Machina Tumbuhan (Pembuangan Peligro)
2.Ivy Kuil Naga Kegelapan : Tengah)`,

    'ku, farm fauna': `*FAUNA*
1.Celeng Kecil Mesin (Lembah Dalam Sykea)
2.Wolfret (Jalan Eryldan : Area 2)
3.Nemico (Saluran Bawah Tanah Ultimea : Tenggara)
4.Nagakor (Terowongan Cobaan)
5.Inoz (Depan Moba Konda)`,

    'ku, farm obat': `*OBAT*
1.Grape Jelly (Saluran Bawah Tanah Ultimea : Tenggara)
2.Lettacia (Depan Moba Konda)`,

    'ku, farm mana': `*MANA*
1.Cassy (Makam Ratu : Area 2)
2.Malaikat Gelembung(Kuil Dewa Berkah)
3.Laduro => Maps Terowongan Cobaan
4.Event Summer Mobs Khusus Ele Air
  - Venomsch (Saluran Bawah Tanah Ultimea : Selatan)
  - Semua Mob Berelemen Air
5.Event Valentine => Bos Bab 1 Chocolate Ooze
6.Event Withe Day => Bos Candela
7.Event Hanami Bab 1-7`
};

client.on('message', message => {
    const response = farmLocations[message.body.toLocaleLowerCase()];
    if (response) {
        message.reply(response);
    }
});

client.on('message', message => {
    const msg = message.body.toLowerCase().trim();

    if (msg.startsWith("ku,")) {
        let replyMessage = '';

        switch (msg) {
            case "ku, consume support":
                replyMessage = `BUFF SUPPORT / PENDUKUNG
Regera I
Fungsi: Mengembalikan 10 HP setiap 3 detik selama 5 menit
Restores 10 HP every 3 sec for 5 min
Minus: Tidak bisa digunakan bersama item penyembuhan HP lain
Recipe / Bahan:
Pomum Leaf x1
(Drop Mobs: Pomum, Maps: Rakau Plains)
Medicine x10pts
(Process Materials)

Regera II
Fungsi: Mengembalikan 25 HP setiap 3 detik selama 5 menit
Restores 25 HP every 3 sec for 5 min
Minus: Tidak bisa digunakan bersama item penyembuhan HP lain
Recipe / Bahan:
Hard Apple x1
(Drop Mobs: Vanilla Potum, Maps: Athema Ruins)
Medicine x20pts
(Process Materials)

Regera III
Fungsi: Mengembalikan 50 HP setiap 3 detik selama 5 menit
Restores 50 HP every 3 sec for 5 min
Minus: Tidak bisa digunakan bersama item penyembuhan HP lain
Recipe / Bahan:
Lime x1
(Drop Mobs: Lime Potum, Maps: Land Under Cultivation)
Medicine x40pts
(Process Materials)

Regera IV
Fungsi: Mengembalikan 100 HP setiap 3 detik selama 5 menit
Restores 100 HP every 3 sec for 5 min
Minus: Tidak bisa digunakan bersama item penyembuhan HP lain
Recipe / Bahan:
Scorching Orange x1
(Drop Mobs: Baby Salamander, Maps: Blazing Graben)
Medicine x80pts
(Process Materials)

Regera V
Fungsi: Mengembalikan 200 HP setiap 3 detik selama 5 menit
Restores 200 HP every 3 sec for 5 min
Minus: Tidak bisa digunakan bersama item penyembuhan HP lain
Recipe / Bahan:
Onion x1
(Drop Mobs: Pecols, Maps: Monster's Forest)
Medicine x160pts
(Process Materials)

Vita Plus I
Fungsi: Menambah MaxHP +500 selama 30 menit
MaxHP +500 for 30 min
Minus: Tidak bisa digunakan bersama item penyembuhan HP lain
Recipe / Bahan:
Colon Leaf x5
(Drop Mobs: Colon, Maps: Land Under Development)
Medicine x24pts
(Process Materials)

Vita Plus II
Fungsi: Menambah MaxHP +1000 selama 30 menit
MaxHP +1000 for 30 min
Minus: Tidak bisa digunakan bersama item penyembuhan HP lain
Recipe / Bahan:
Apple x1
(Drop Mobs: Coryn, Maps: Douce Hamlet)
Medicine x120pts
(Process Materials)

Vita Plus III
Fungsi: Menambah MaxHP +1500 selama 30 menit
MaxHP +1500 for 30 min
Minus: Tidak bisa digunakan bersama item penyembuhan HP lain
Recipe / Bahan:
Aromatic Leaf x1
(Drop Mobs: Kinote, Maps: Peligro Landfill)
Medicine x240pts
(Process Materials)

Magi Add I
Fungsi: Menambah MaxMP +100 selama 30 menit
MaxMP +100 for 30 min
Minus: Tidak bisa digunakan bersama item penambahan MP lain
Recipe / Bahan:
Blue Gelatin x5
(Drop Mobs: Blue Jelly, Maps: Underground Channel)
Medicine x24pts
(Process Materials)

Magi Add II
Fungsi: Menambah MaxMP +200 selama 30 menit
MaxMP +200 for 30 min
Minus: Tidak bisa digunakan bersama item penambahan MP lain
Recipe / Bahan:
Green Jelatin x5
(Drop Mobs: Green Jelly, Maps: Zoktzda Ruins)
Medicine x120pts
(Process Materials)

Magi Add III
Fungsi: Menambah MaxMP +300 selama 30 menit
MaxMP +300 for 30 min
Minus: Tidak bisa digunakan bersama item penambahan MP lain
Recipe / Bahan:
Orange Gelatin x5
(Drop Mobs: Orange Jelly, Maps: Magic Waste Site)
Medicine x240pts
(Process Materials)

Vaccine I
Fungsi: Mencegah 1 jenis penyakit selama 1 menit
Prevents ailments once for 1 min
Minus: Tidak bisa digunakan bersama item sejenis lainnya
Recipe / Bahan:
Bat Claw x3
(Drop Mobs: Nemico, Maps: Underground Ruins)
Medicine x8pts
(Process Materials)

Vaccine II
Fungsi: Mencegah 1 jenis penyakit selama 2 menit
Prevents ailments once for 2 min
Minus: Tidak bisa digunakan bersama item sejenis lainnya
Recipe / Bahan:
Reptile Bone x3
(Drop Mobs: Elizard, Maps: Land of Chaos)
Medicine x40pts
(Process Materials)

Vaccine III
Fungsi: Mencegah 1 jenis penyakit selama 3 menit
Prevents ailments once for 3 min
Minus: Tidak bisa digunakan bersama item sejenis lainnya
Recipe / Bahan:
Purification Salt x3
(Drop Mobs: Ghost Potum, Maps: Calle Mort)
Medicine x80pts
(Process Materials)

Mana Supply Stone
Fungsi: Pemulihan MP Serangan +3 selama 30 menit
Attack MP Recovery +3 for 30 min
Recipe / Bahan:
Saham Crystal x1
(Drop Mobs: Rotta Nemico, Maps: Saham Underground Cave)
Spiritual Gemstone x1
(Drop Mobs: Cassy, Maps: Ancient Empress's Tomb)
Medicine x100pts
(Process Materials)

Magic Absorption Stone
Fungsi: Pemulihan MP Serangan +6 selama 30 menit
Attack MP Recovery +6 for 30 min
Recipe / Bahan:
Corroded Iron Arm x1
(Drop Mobs: Corroded Brawler, Maps: Dark Manor)
Sharp Shield Bit x1
(Drop Mobs: Corroded Shielder, Maps: Dark Manor)
Medicine x160pts
(Process Materials)

Crispy Potato
Fungsi: Mengembalikan 50 MP dua kali dalam 10 detik
Restores 50 MP twice in 10 sec
Minus: Tidak bisa digunakan bersama item penyembuhan HP lain
Recipe / Bahan:
Potato x5
(Drop Mobs: Ivy, Maps: Dark Dragon Shrine)
Hard Nut x5
(Drop Mobs: Earl Colon, Maps: Lufenas Mansion: Garden)

Fighter's Red Loincloth
Fungsi: MaxHP +500, Aggro -15% selama 30 menit
MaxHP +500, Aggro -15% for 30 min
Recipe / Bahan:
Crimson Loincloth x1
(Drop Mobs: Assault Golem, Maps: Lufenas Mansion)
Big Button x2
(Drop Mobs: Puppet Dragon, Maps: Lufenas Mansion)
Medicine x184pts
(Process Materials)
`
              break;
              case "ku, consume dte":
                replyMessage = `Usual Affair Buffs (Damage Boost)
Consumables - 5% Damage to Element (DTE)

Pumpkin Cookie
Element: Fire (Damage to Fire)

Ginger Cake
Element: Water (Damage to Water)

Barmbrack
Element: Earth (Damage to Earth)

Jack Pudding
Element: Wind (Damage to Wind)

Pumpkin Candy
Element: Light (Damage to Light)

Pumpkin Soup
Element: Neutral (Damage to Neutral)

Zombie Cake
Element: Dark (Damage to Dark)`
            break;
            }

            if (replyMessage) {
                message.reply(replyMessage);
            }
        }
    });;
//check status bot
client.on('message', message => {
    if (message.body.toLocaleLowerCase() === 'ku, status') {
        message.reply("Status Online\nKu's Bot~")
    }
});

client.on('message', message =>{
    if(message.body.toLocaleLowerCase() === 'ku, buy cp'){
        message.reply('STRESS JIG')
    }
})