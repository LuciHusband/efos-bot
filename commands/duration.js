const DURATIONS = {};

module.exports = {
  execute(oldState, newState) {
    const member = newState.member;

    if (!member) return;

    if (!oldState.channelId && newState.channelId) {
      DURATIONS[member.id] = {
        joinTime: Date.now(),
        channel: newState.channel,
      };
    } else if (oldState.channelId && !newState.channelId) {
      const joinTime = DURATIONS[member.id]?.joinTime;

      if (joinTime) {
        const channel = oldState.channel;
        const duration = new Date(Date.now() - joinTime);

        channel.send({
          content: `${DURATIONS[member.id]?.channel.name} kanalında ${duration.getUTCHours()} saat ${duration.getUTCMinutes()} dakika ${duration.getUTCSeconds()} saniye kadar kalan **${member.nickname}** arkadaşımızı tebrik ediyoruz.`,
          flags: [4096] // Silent message
        })
          .then(() => {
            delete DURATIONS[member.id];
          });
      };
    };
  }
};