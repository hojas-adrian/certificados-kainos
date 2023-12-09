import Jimp from "jimp";
import settings from "./settings.json" assert { type: "json" };
import path from "path";
import { fileURLToPath } from "url";
import { open } from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const colors = {
  yellow: "#fe7910",
  blue: "#183e89",
  black: "#000",
};

(async () => {
  const names = await open(path.join(__dirname, "nombres.txt"));

  for await (const personName of names.readLines()) {
    if (!personName || /^\/\//.test(personName)) {
      continue;
    }

    const noAdmitedCharts = /[~"#%&*:<>?\/\\{|}]/g;
    const fileName = personName.replace(noAdmitedCharts, "");

    try {
      const lenna = await Jimp.read(
        path.join(__dirname, "./assets/plantilla.jpg"),
      );

      const fontDate = await Jimp.loadFont(
        path.join(__dirname, "./assets/texts/date.fnt"),
      );
      const fontTitle = await Jimp.loadFont(
        path.join(__dirname, "./assets/texts/title.fnt"),
      );
      const fontName = await Jimp.loadFont(
        path.join(__dirname, "./assets/texts/name.fnt"),
      );
      const fontAuthor = await Jimp.loadFont(
        path.join(__dirname, "./assets/texts/autor.fnt"),
      );
      const fontRol = await Jimp.loadFont(
        path.join(__dirname, "./assets/texts/cargo.fnt"),
      );

      const createText = (text, font, color) => {
        return new Jimp(792, 612, 0x0)
          .print(font, 0, 0, text)
          .color([{ apply: "xor", params: [color] }]);
      };

      const title = createText(
        `${settings.title.toUpperCase()}:`,
        fontTitle,
        colors.yellow,
      );

      const date = createText(
        settings.fecha,
        fontDate,
        colors.blue,
      );

      const autor = createText(
        settings.autor,
        fontAuthor,
        colors.yellow,
      );

      const cargo = createText(
        settings.cargo.toUpperCase(),
        fontRol,
        colors.blue,
      );

      const name = createText(
        personName,
        fontName,
        colors.black,
      );

      lenna
        .blit(name, 120, 293)
        .blit(title, 117, 240)
        .blit(date, 117, 212)
        .blit(autor, 117, 473)
        .blit(cargo, 117, 495)
        .write(path.join(__dirname, `./certificados/${fileName}.jpg`));
    } catch (error) {
      console.error(err);
    }
  }
})();
