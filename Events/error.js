const { client } = require("../index.js");
module.exports = {
  name: "error",
  once: false,
  async execute(error) {
    console.error(error);

    const user = await client.users.fetch("693511698912641105");
    user.send("Giraffe's Lil Brody threw and error!");
    user.send(`\`\`\`js\n${error}\n\`\`\``);
  },
};
