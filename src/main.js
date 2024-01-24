import Jimp from "jimp";
import settings from "./settings.json" assert { type: "json" };
import path from "path";
import { fileURLToPath } from "url";
import { open } from "node:fs/promises";

const src = (src) => {
  return path.join(path.dirname(fileURLToPath(import.meta.url)), src);
};

(async () => {
  const names = await open(src("nombres.txt"));

  const COLORS = {
    yellow: "#fe7910",
    blue: "#183e89",
    black: "#000",
    grey: "#97afaf",
  };
  
  const _22_light = await Jimp.loadFont(src("./assets/fonts/22_light.fnt"));
  const _24_regular = await Jimp.loadFont(src("./assets/fonts/24_regular.fnt"));
  const _44_regular = await Jimp.loadFont(src("./assets/fonts/44_regular.fnt"));

  const formatDate = (number) => {
    return Intl.NumberFormat("es", {
      minimumIntegerDigits: 2,
    }).format(number);
  };

  for await (const person of names.readLines()) {
    if (!person || /^\/\//.test(person)) {
      continue;
    }

    const [ref, personName = ""] = person.split(",");
    const noAdmitedCharts = /[~"#%&*:<>?\/\\{|}]/g;
    const fileName = person.replace(noAdmitedCharts, "").replace(",", "_");

    try {
      const canvas = await Jimp.read(src("./assets/plantilla.jpg"));

      const data = {
        person: {
          value: personName,
          color: COLORS.black,
          font: _44_regular,
        },
        text: {
          value: {
            title: settings.title,
            dayStart: settings.date.start.day,
            dayEnd: settings.date.end.day,
            dayDelivered: settings.date.delivered.day,
            monthStart: settings.date.start.month,
            monthEnd: settings.date.end.month,
            monthDelivered: settings.date.delivered.month,
            yearStart: settings.date.start.year,
            yearEnd: settings.date.end.year,
            yearDelivered: settings.date.delivered.year,
          },
          color: COLORS.blue,
          font: _22_light,
        },

        charges: {
          value: {
            kainos: settings.authors.kainos.charge.toUpperCase(),
            KAINOS: "KAINOS S.A.",
            uci: settings.authors.uci.charge.toUpperCase(),
            UCI: "UCI",
          },
          color: COLORS.grey,
          font: _22_light,
        },

        author: {
          value: {
            uci: settings.authors.uci.name,
            kainos: settings.authors.kainos.name,
          },
          color: COLORS.yellow,
          font: _24_regular,
        },

        ref: {
          value: ref,
          color: COLORS.grey,
          font: _24_regular,
        },
      };

      const createText = ({ value, color, font }) => {
        if (typeof value === "object") {
          let output = {};

          for (const key in value) {
            const text =
              key === "dayStart" ||
              key === "dayEnd" ||
              key === "dayDelivered" ||
              key === "monthStart" ||
              key === "monthEnd" ||
              key === "monthDelivered"
                ? formatDate(value[key])
                : value[key];

            output[key] = new Jimp(792, 612, 0x0)
              .print(font, 0, 0, text.toString().trim())
              .color([{ apply: "xor", params: [color] }]);
          }

          return output;
        }

        return new Jimp(792, 612, 0x0)
          .print(font, 0, 0, value.toString().trim())
          .color([{ apply: "xor", params: [color] }]);
      };

      const name = createText(data.person),
        text = createText(data.text),
        charges = createText(data.charges),
        author = createText(data.author),
        refe = createText(data.ref);

      canvas
        .blit(name, 113, 265)

        .blit(text.title, 310, 323.4)

        .blit(text.dayStart, 180, 345)
        .blit(text.monthStart, 236, 345)
        .blit(text.yearStart, 291, 345)

        .blit(text.dayEnd, 180 + 229, 345)
        .blit(text.monthEnd, 236 + 229, 345)
        .blit(text.yearEnd, 291 + 229, 345)

        .blit(text.dayDelivered, 233, 367)
        .blit(text.monthDelivered, 289, 367)
        .blit(text.yearDelivered, 344, 367)

        .blit(author.uci, 118, 475)
        .blit(charges.uci, 118, 495)
        .blit(charges.UCI, 118, 512)

        .blit(author.kainos, 358, 475)
        .blit(charges.kainos, 358, 495)
        .blit(charges.KAINOS, 358, 512)

        .blit(refe, 720, 580)

        .write(src(`./certificados/${fileName}.jpg`));
    } catch (error) {
      console.error(error);
    }
  }
})();
