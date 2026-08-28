var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  ButtonBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js')
module.exports = {
  name: "language",
  category: "⚙️ Settings",
  aliases: ["setuplanguage", "setup-caps", "setupcaps", "language-setup", "languagesetup"],
  cooldown: 5,
  usage: "language  -->  Follow the Steps",
  description: "Enable + Change the maximum Percent of UPPERCASE (caps) inside of a Message",
  memberpermissions: ["ADMINISTRATOR"],
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let languages = {
      "en": "🇬🇧 English",
      "de": "🇩🇪 German",
      "fr": "🇫🇷 French",
      "ir": "🇮🇷 Persian (ir)",

      /*
        "it": "🇮🇹 Italian",
        "sp": "🇪🇸 Spanish",
        "in": "🇮🇳 India (Hindi)",
        "nl": "🇳🇱 Dutch",
        "tr": "🇹🇷 Turkish",
        "ir": "🇮🇷 Iran"
      */
    }
    //call the first layer
    first_layer()
    //function to handle the FIRST LAYER of the SELECTION
    async function first_layer() {
      let menuoptions = [{
          value: `Change Language`,
          description: "Change the Language of the Bot",
          emoji: `${emoji.react.change_language}`
        },
        {
          value: `Reset Language`,
          description: "Reset to the Default Language (English)",
          emoji: `${emoji.react.reset_language}`
        },
        {
          value: "Settings",
          description: `Show the Current Language`,
          emoji: `${emoji.react.settings}`
        },
        {
          value: "Cancel",
          description: `Cancel and stop the Ticket-Setup!`,
          emoji: `${emoji.react.cancel}`
        }
      ]
      let Selection = new StringSelectMenuBuilder()
        .setPlaceholder('Click me to setup the Language!').setCustomId('MenuSelection')
        .setMaxValues(1).setMinValues(1)
        .addOptions(
          menuoptions.map(option => {
            let Obj = {
              label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
              value: option.value.substr(0, 50),
              description: option.description.substr(0, 50),
            }
            if (option.emoji) Obj.emoji = option.emoji;
            return Obj;
          }))
      //define the embed
      let MenuEmbed = new EmbedBuilder()
        .setColor(es.color)
        .setAuthor(client.getFooter("Language System Setup","https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/flag-united-kingdom_1f1ec-1f1e7.png","https://discord.gg/milrato"))
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["setup-language"]["variable1"]))
      let used1 = false;
      //send the menu msg
      let menumsg = await message.reply({
        embeds: [MenuEmbed],
        components: [new ActionRowBuilder().addComponents(Selection)]
      })
      //function to handle the menuselection
      function menuselection(menu) {
        let menuoptiondata = menuoptions.find(v => v.value == menu.values[0])
        let menuoptionindex = menuoptions.findIndex(v => v.value == menu.values[0])
        if (menu.values[0] == "Cancel") return menu.reply(eval(client.la[ls]["cmds"]["settings"]["setup-language"]["variable2"]))
        menu.deferUpdate();
        used1 = true;
        handle_the_picks(menuoptionindex, menuoptiondata)
      }
      //Event
      client.on('interactionCreate', (menu) => {
        if (menu.message.id === menumsg.id) {
          if (menu.user.id === cmduser.id) {
            if (used1) return menu.reply({
              content: `❌ You already selected something, this Selection is now disabled!`,
              ephemeral: true
            })
            menuselection(menu);
          } else menu.reply({
            content: `❌ You are not allowed to do that! Only: <@${cmduser.id}>`,
            ephemeral: true
          });
        }
      });
    }

    //THE FUNCTION TO HANDLE THE SELECTION PICS
    async function handle_the_picks(menuoptionindex, menuoptiondata) {
      switch (menuoptionindex) {
        case 0: {
          let button_en = new ButtonBuilder().setStyle('PRIMARY').setCustomId('language_en').setEmoji("🇬🇧").setLabel("English").setDisabled(false)
          let button_de = new ButtonBuilder().setStyle('PRIMARY').setCustomId('language_de').setEmoji("🇩🇪").setLabel("German").setDisabled(false)
          let button_fr = new ButtonBuilder().setStyle('PRIMARY').setCustomId('language_fr').setEmoji("🇫🇷").setLabel("French").setDisabled(false)
          let button_ir = new ButtonBuilder().setStyle('PRIMARY').setCustomId('language_ir').setEmoji("🇮🇷").setLabel("Persian (ir)").setDisabled(false)

          let buttonRow1 = new ActionRowBuilder()
            .addComponents(button_en, button_de, button_fr, button_ir)
          let allbuttons = [buttonRow1]
          //Send message with buttons
          let helpmsg = await message.reply({
            content: `***Click on a __Button__ to select the Language***`,
            embeds: [new EmbedBuilder()
              .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-language"]["variable3"]))
              .setDescription(eval(client.la[ls]["cmds"]["settings"]["setup-language"]["variable4"]))
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            ],
            components: allbuttons
          });
          //create a collector for the thinggy
          const collector = helpmsg.createMessageComponentCollector({
            filter: (i) => i.isButton() && i.user && i.message.author.id == client.user.id,
            time: 180e3
          }); //collector for 5 seconds
          //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
          var edited = false;
          collector.on('collect', async b => {
            if (b.user.id !== message.author.id)
              return b.reply(`${emoji.msg.ERROR} **Only the one who typed ${prefix}setup-language is allowed to react!**`, true)
            if (b.user.id == message.author.id && b.message.id == helpmsg.id && b.customId.includes("language_")) {
              b.deferUpdate();
              let lang = b.customId.replace("language_", "")
              client.settings.set(message.guild.id, lang, "language");
              ls = lang;
              message.reply({
                embeds: [new EmbedBuilder()
                  .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-language"]["variable5"]))
                  .setColor(es.color)
                  .setFooter(client.getFooter(es))
                ]
              });
              edited = true;
              helpmsg.edit({
                content: `Time has ended type ${prefix}setup-language again!`,
                embeds: [helpmsg.embeds[0]],
                components: []
              })
            }
          });
          collector.on('end', collected => {
            if (!edited) {
              edited = true;
              helpmsg.edit({
                content: `Time has ended type ${prefix}setup-language again!`,
                embeds: [helpmsg.embeds[0]],
                components: []
              })
            }
          });
          setTimeout(() => {
            if (!edited) {
              edited = true;
              helpmsg.edit({
                content: `Time has ended type ${prefix}setup-language again!`,
                embeds: [helpmsg.embeds[0]],
                components: []
              })
            }
          }, 180e3 + 150)
          return;
        }
        case 1: {
          client.settings.set(message.guild.id, "en", "language");
          ls = "en";
          return message.reply({
            embeds: [new EmbedBuilder()
              .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-language"]["variable6"]))
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            ]
          });
        }
        case 2: {
          let thesettings = client.settings.get(message.guild.id, `language`)
          return message.reply({
            embeds: [new EmbedBuilder()
              .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-language"]["variable7"]))
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            ]
          });
        }
      }

    }
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