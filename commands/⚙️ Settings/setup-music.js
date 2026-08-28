var {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  ButtonBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js')
module.exports = {
  name: "setup-music",
  category: "⚙️ Settings",
  aliases: ["setupmusic"],
  cooldown: 10,
  usage: "setup-music #Channel",
  description: "Setup a Music Request Channel",
  memberpermissions: ["ADMINISTRATOR"],
  type: "music",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //first declare all embeds
    var embeds = [
      new EmbedBuilder()
      .setColor(es.color)
      .setTitle(`📃 Queue of __${message.guild.name}__`)
      .setDescription(`**Currently there are __0 Songs__ in the Queue**`)
      .setThumbnail(message.guild.iconURL({
        dynamic: true
      })),
      new EmbedBuilder()
      .setColor(es.color)
      .setFooter(es.footertext, message.guild.iconURL({
        dynamic: true
      }))
      .setImage(message.guild.banner ? message.guild.bannerURL({
        size: 4096
      }) : "https://imgur.com/jLvYdb4.png")
      .setTitle(`Start Listening to Music, by connecting to a Voice Channel and sending either the **SONG LINK** or **SONG NAME** in this Channel!`)
      .setDescription(`> *I support <:Youtube:840260133686870036> Youtube, <:Spotify:846090652231663647> Spotify, <:soundcloud:825095625884434462> Soundcloud and direct MP3 Links!*`)
    ]
    var Emojis = [
      "0️⃣",
      "1️⃣",
      "2️⃣",
      "3️⃣",
      "4️⃣",
      "5️⃣",
      "6️⃣",
      "7️⃣",
      "8️⃣",
      "9️⃣",
      "🔟",
      "🟥",
      "🟧",
      "🟨",
      "🟩",
      "🟦",
      "🟪",
      "🟫",
    ]
    //now we add the components!
    var components = [
      new ActionRowBuilder().addComponents([
        new StringSelectMenuBuilder()
        .setCustomId("StringSelectMenuBuilder")
        .addOptions(["Pop", "Strange-Fruits", "Gaming", "Chill", "Rock", "Jazz", "Blues", "Metal", "Magic-Release", "NCS | No Copyright Music", "Default"].map((t, index) => {
          return {
            label: t.substr(0, 25),
            value: t.substr(0, 25),
            description: `Load a Music-Playlist: "${t}"`.substr(0, 50),
            emoji: Emojis[index]
          }
        }))
      ]),
      new ActionRowBuilder().addComponents([
        new ButtonBuilder().setStyle(1).setCustomId('Skip').setEmoji(`⏭`).setLabel(`Skip`).setDisabled(true),
        new ButtonBuilder().setStyle(4).setCustomId('Stop').setEmoji(`🏠`).setLabel(`Stop`).setDisabled(true),
        new ButtonBuilder().setStyle(2).setCustomId('Pause').setEmoji('⏸').setLabel(`Pause`).setDisabled(true),
        new ButtonBuilder().setStyle(3).setCustomId('Autoplay').setEmoji('🔁').setLabel(`Autoplay`).setDisabled(true),
        new ButtonBuilder().setStyle(1).setCustomId('Shuffle').setEmoji('🔀').setLabel(`Shuffle`).setDisabled(true),
      ]),
      new ActionRowBuilder().addComponents([
        new ButtonBuilder().setStyle(3).setCustomId('Song').setEmoji(`🔁`).setLabel(`Song`).setDisabled(true),
        new ButtonBuilder().setStyle(3).setCustomId('Queue').setEmoji(`🔂`).setLabel(`Queue`).setDisabled(true),
        new ButtonBuilder().setStyle(1).setCustomId('Forward').setEmoji('⏩').setLabel(`+10 Sec`).setDisabled(true),
        new ButtonBuilder().setStyle(1).setCustomId('Rewind').setEmoji('⏪').setLabel(`-10 Sec`).setDisabled(true),
        new ButtonBuilder().setStyle(1).setCustomId('Lyrics').setEmoji('📝').setLabel(`Lyrics`).setDisabled(true),
      ]),
    ]
    let channel = message.mentions.channels.first();
    if (!channel) return message.reply(":x: **You forgot to ping a Text-Channel!**")
    //send the data in the channel
    channel.send({
      embeds,
      components
    }).then(msg => {
      client.musicsettings.set(message.guild.id, channel.id, "channel");
      client.musicsettings.set(message.guild.id, msg.id, "message");
      //send a success message
      return message.reply(`✅ **Successfully setupped the Music System in:** <#${channel.id}>`)
    });
  },
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.dev
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
