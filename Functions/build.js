const Canvas = require("@napi-rs/canvas");
const expModel = require("../Model/exp.js");
const constantsFile = require("../Storage/constants.js");

const suffixes = ["", "K", "M", "B", "T"];

async function build(user, levelData) {
  const toAbbrev = (num) => {
    if (!num || Number.isNaN(num)) return "0";

    if (typeof num === "string") num = parseInt(num);

    if (typeof Intl !== "undefined") {
      return new Intl.NumberFormat("en", { notation: "compact" }).format(num);
    }

    const exponent = Math.floor(Math.log10(num));
    const suffixIndex = Math.floor(exponent / 3);
    const size = Math.pow(10, suffixIndex * 3);

    const suffix = suffixes[suffixIndex];
    const abbreviated = Math.round(num / size);

    if (abbreviated === 1000 && suffixIndex < suffixes.length - 1) {
      return toAbbrev(Math.round(num / size) * size);
    }

    return `${abbreviated}${suffix}`;
  };

  const shorten = (text, len) => {
    if (typeof text !== "string") return "";
    if (text.length <= len) return text;
    return `${text.substring(0, len).trim()}  ...`;
  };

  let avatar = await Canvas.loadImage(
    user.displayAvatarURL({
      extension: "png",
    })
  );

  Canvas.GlobalFonts.registerFromPath("./Functions/Manrope-Bold.ttf", "Manrope Bold");
  const abbreviatedLevel = toAbbrev(levelData.level);
  const leaderboard = await expModel
    .find({
      guildID: constantsFile.guildId,
    })
    .sort({ level: -1, xp: -1 });
  const rank = leaderboard.findIndex((element) => element.memberID === levelData.memberID) + 1;
  const abbreviatedRank = toAbbrev(rank);

  // create canvas instance
  const canvas = Canvas.createCanvas(934, 282);
  const ctx = canvas.getContext("2d");

  // create background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // reset transparency
  ctx.globalAlpha = 1;

  // draw username
  ctx.font = `36px Manrope Bold`;
  ctx.fillStyle = "white";
  ctx.textAlign = "start";
  const name = shorten(user.username, 10);
  ctx.fillText(`${name}`, 275.5, 164);

  // draw discriminator
  const discrim = user.discriminator;
  ctx.textAlign = "center";
  ctx.fillText(`#${discrim.substr(0, 4)}`, ctx.measureText(name).width + 20 + 335, 164);

  // fill level
  ctx.font = `32px Manrope Bold`;
  ctx.fillText("Level", 800 - ctx.measureText(abbreviatedLevel).width, 82);
  ctx.textAlign = "end";
  ctx.fillText(abbreviatedLevel, 860, 82);

  // fill rank
  ctx.fillText(
    "Rank",
    800 -
      ctx.measureText(abbreviatedLevel || "-").width -
      7 -
      ctx.measureText("Level").width -
      7 -
      ctx.measureText(abbreviatedRank || "-").width -
      20,
    82
  );

  // Fill level
  ctx.fillText(abbreviatedRank, 790 - ctx.measureText(abbreviatedLevel || "-").width - 7 - ctx.measureText("Level").width, 82);

  // Show progress
  ctx.font = `30px Manrope Bold`;

  ctx.textAlign = "start";
  const xpNeeded = 5 * Math.pow(levelData.level, 2) + 60 * levelData.level + 100;
  ctx.fillText("/ " + toAbbrev(xpNeeded), 670 + ctx.measureText(toAbbrev(levelData.xp)).width + 15, 164);
  ctx.fillText(toAbbrev(levelData.xp), 670, 164);

  // Grey background
  ctx.beginPath();
  ctx.fillStyle = "#484b4E";
  const startAngle = 1.5 * Math.PI;
  const endAngle = 0.5 * Math.PI;
  ctx.arc(275.5, 202.25, 18.5, startAngle, endAngle, true);
  ctx.fill();
  ctx.fillRect(275.5, 183.75, 596.5, 37.5);
  ctx.arc(257 + 615, 202.25, 18.75, startAngle, endAngle, false);
  ctx.fill();

  // Progress Bar (Custom fill in color)
  let progressWidth = (levelData.xp * 615) / xpNeeded;
  if (progressWidth > 596.5) {
    progressWidth = 596.5;
  }

  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(275.5, 202.25, 18.5, startAngle, endAngle, true);
  ctx.fill();
  ctx.fillRect(275.5, 183.75, progressWidth, 37.5);
  ctx.arc(275.5 + progressWidth, 202.25, 18.75, startAngle, endAngle, false);
  ctx.fill();

  // Circle for profile picture
  ctx.beginPath();
  ctx.arc(125 + 10, 125 + 20, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  // Draw profile picture
  ctx.drawImage(avatar, 35, 45, 200, 200);
  ctx.restore();

  const data = await canvas.encode("png");
  return data;
}

module.exports = { build };
