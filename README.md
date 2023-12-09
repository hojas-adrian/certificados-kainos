# Generador de Certificados para EI Kainos

Este proyecto automatiza la creación de certificados para la empresa Interfaz
Kainos utilizando Node.js y la biblioteca
[Jimp](https://github.com/jimp-dev/jimp).

## Requisitos

- [Node.js](https://nodejs.org/) versión `17.5.0` o superior.

## Configuración

La configuración del certificado se realiza a través de un archivo JSON dentro
de la carpeta `src`. Aquí está un ejemplo de cómo se ve el archivo de
configuración:

```json
{
  "title": "Certificado a entregar", //=> Agrega el nombre del certificado
  "autor": "Dr. Jane Goodall", //=> Agrega el nombre de la persona que certifica
  "cargo": "Presidente", //=> Agrega el cargo de la persona que certifica
  "fecha": "a los 32 días de abril" //=> Agrega la fecha de emición
}
```

Los nombres de los destinatarios del certificado deben estar en un archivo
`nombres.txt` dentro de la misma carpeta `src`.

```
.
└──📁src
   ├──📁certificados
   ├──📄settings.json
   └──📄nombres.txt
```

> Los certifiacos generados estarán en la carpeta `certificados`

## Instalar

Para ejecutar el programa, navegue hasta el directorio del proyecto y ejecute el
siguiente comando:

```bash
git clone https://github.com/hojas-adrian/certificados-kainos.git
```

```bash
cd certificados-kainos && npm install
```

> Requiere vpn

## Ejecutar

```bash
cd src && node index.js
```
