const { showQueue } = require("../model/showQueue");

module.exports = {
  name: "remove",
  description: "[KANNA BIẾT HÁT] Xóa 1 bài nhạc trong queue. Hoặc nhiều bài",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Không có nhạc thì xóa cái gì 😩").catch(console.error);

    let removeList = args.sort().reverse();

    // remove from to
    if (removeList[0] == 'to' && removeList.length == 3) {
      if (!Number.isInteger(Number(removeList[1])) || !Number.isInteger(Number(removeList[2]))) {
        console.log('remove: syntax error')
        return message.channel.send(`Sai cú pháp :( !remove <number> <number>`);
      } else {
        let countRemove = 0
        for (let i = parseInt(removeList[1]); i >= parseInt(removeList[2]); i--) {
          let song = queue.songs.splice(i - 1, 1);
          if (song[0] != null) countRemove++
        }
        queue.textChannel.send(`☑️ Đã xóa **${countRemove}** bài hát`);
        console.log('remove: ok')
        showQueue(message); 
      }
    } else {    //remove 
      let isRemovable = true;
    
      if (!args.length) {
        console.log('remove: syntax error')
        return message.channel.send(`Sai cú pháp :( !remove <number> <number>`);
      }

      removeList.forEach(item => {
        if (!Number.isInteger(Number(item))) {
          isRemovable = false;
          return;
        }
      });

      if (isRemovable == false) {
        console.log('remove: syntax error')
        return message.channel.send(`Sai cú pháp :( !remove <number> <number>`) 
      } else {
        removeList.forEach(item => {
          let song = queue.songs.splice(item - 1, 1);
          if (song[0] != null) {
            queue.textChannel.send(`☑️ Đã xóa **${item}. ${song[0].title}**`);
            
          }
          else queue.textChannel.send(`❌ Không có bài **${item}** nha !!`);
        });
        console.log('remove: ok')
        showQueue(message);
      }
    }
  }
}
