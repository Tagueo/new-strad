# new-strad
**Nouvelle version du bot Discord Strad pour le serveur Stradivarius**

## Informations

Le bot est développé par Tagueo et les contributeurs (voir ci-dessous pour la liste). Il est développé en JavaScript grâce au runtime [nodejs](https://nodejs.org/en/) et utilise la librairie [discord.js](https://discord.js.org/#/). Le logo du bot a été fait par Superdelphi.

Pour en savoir plus sur la contribution au développement du bot, rendez-vous [ici](https://github.com/Tagueo/new-strad/blob/master/CONTRIBUTING.md) !

## Installation

Pour faire fonctionner ce bot en local, c'est très simple :
- Installez [nodejs](https://nodejs.org/en/)
- Clonez le repository
- Ouvrez une invite de commande/terminal dans le dossier du repository et exécutez : `npm install`
- Selon votre système d'exploitation, installez les outils pour l'utilisation de node-canvas comme ceci :
  - Windows : [wiki](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows) de node-canvas
  - Linux : `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`
  - Mac : (en utilisant [Homebrew](https://brew.sh/)) `brew install pkg-config cairo pango libpng jpeg giflib librsvg`
- Remplissez le fichier de config avec le token et les ids des channels
- Exécutez `npm run start` dans l'invite de commande/terminal