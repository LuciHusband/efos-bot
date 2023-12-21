module.exports = {
    name: {
      en: 'Vote',
      tr: 'Oylama'
    },
    description: {
      en: 'Start a vote for a specific sentence.',
      tr: 'Belirli bir cümle için oylama başlatır.'
    },
    detailedDescription: {
      en: 'Start a vote for a specific sentence. Use `vote <your sentence>` to initiate the vote.',
      tr: 'Belirli bir cümle için oylama başlatır. Oylama başlatmak için `oylama <cümleniz>` komutunu kullanın.'
    },
    triggers: ['vote', 'oylama'],
    voteThreshold: 3, // Voting threshold
    execute(message) {
      const sentence = message.content.slice(this.triggers[0].length + 1).trim();
  
      if (!sentence) {
        message.reply('Please provide a sentence to start the vote.');
        return;
      }
  
      const embed = {
        color: '#3498db',
        author: {
          name: message.author.username,
          icon_url: message.author.displayAvatarURL({ dynamic: true }),
        },
        description: sentence,
        footer: {
          text: 'React with 👍 to vote for this sentence.',
        },
      };
  
      message.channel.send({ embeds: [embed] })
        .then((sentMessage) => {
          sentMessage.react('👍');
  
          const filter = (reaction, user) => reaction.emoji.name === '👍' && !user.bot;
          const collector = sentMessage.createReactionCollector({ filter, time: 60000 });
  
          collector.on('end', (collected) => {
            if (collected.size >= this.voteThreshold) {
              message.channel.send(`The sentence "${sentence}" has been selected with ${collected.size} votes!`);
              // Add further actions or logic for the selected sentence here
            } else {
              message.channel.send(`The sentence "${sentence}" did not receive enough votes.`);
            }
          });
        })
        .catch((err) => {
          console.error('Error occurred while starting the vote:', err);
          message.channel.send(`An error occurred while starting the vote: ${err.message}`);
        });
    },
  };