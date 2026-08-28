const assert = require('assert');

// A very simple static syntax mock check script for the builder API usage.
const fs = require('fs');
const glob = require('glob');

const files = glob.sync('{commands,slashCommands,handlers,events}/**/*.js');

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');

  // Assert there are no leftover MessageEmbed / MessageActionRow / MessageButton calls
  if (content.includes('new MessageEmbed()')) {
    console.error(`Found leftover MessageEmbed in ${file}`);
    process.exit(1);
  }
  if (content.includes('new MessageActionRow()')) {
    console.error(`Found leftover MessageActionRow in ${file}`);
    process.exit(1);
  }
  if (content.includes('new MessageButton()')) {
    console.error(`Found leftover MessageButton in ${file}`);
    process.exit(1);
  }
  if (content.includes('new MessageSelectMenu()')) {
    console.error(`Found leftover MessageSelectMenu in ${file}`);
    process.exit(1);
  }

  // Check new Builders usage
  if (content.includes('.addComponents([')) {
    console.error(`Warning: .addComponents() arrays may cause issues if not spread in v14 in ${file}`);
  }
}

console.log("Static check passed!");
