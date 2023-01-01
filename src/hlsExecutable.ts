import { Executable, window } from 'coc.nvim';
import { hlsName } from '../package.json';
import { execSync } from 'child_process';
import rimraf from 'rimraf';
import path from 'path';
import fs from 'fs';


interface HlsExecutable extends Executable {
   command: string
}
type Path = string;


function createHlsVenvPosix(): Path {
   const venvPath = path.join(path.dirname(__dirname), '.venv');
   const pipPath = path.join(venvPath, 'bin', 'pip');
   const hlsExecutablePath = path.join(venvPath, 'bin', hlsName);

   if (fs.existsSync(venvPath)) {
      rimraf.sync(venvPath);
   } 

   try {
      execSync(`python3 -m venv .venv`);
   } catch (e) {
      window.showErrorMessage(
         'Something went wrong creating .venv. Make sure python3-venv is installed.'
      )
      throw e;
   }

   try {
      execSync(`${pipPath} install -U pip jedi-language-server`);
   } catch (e) {
      window.showErrorMessage(`Something went wrong installing ${hlsName} from PyPI.`);
      throw e;
   }

   window.showMessage(`${hlsName} installed`);

   return hlsExecutablePath;
}


export function getHlsExecutable(): HlsExecutable {
   const hlsExecutablePath = createHlsVenvPosix();
   return {
      command: hlsExecutablePath
   }
}
