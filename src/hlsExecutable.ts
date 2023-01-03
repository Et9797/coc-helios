import { Executable, window } from 'coc.nvim';
import { hlsName } from '../package.json';
import { execSync } from 'child_process';
import path from 'path';


interface HlsExecutable extends Executable {
   command: string
}
type Path = string;


function createHlsVenvPosix(): Path {
   const venvPath = path.join(path.dirname(__dirname), '.venv');
   const pipPath = path.join(venvPath, 'bin', 'pip');
   const hlsExecutablePath = path.join(venvPath, 'bin', hlsName);

   try {
      execSync(`python3 -m venv ${venvPath}`);
   } catch (e) {
      window.showErrorMessage(
         `Something went wrong creating .venv. Make sure python3-venv is installed.\n ${e}`
      )
      throw e;
   }

   try {
      execSync(`${pipPath} install -U pip helios-language-server`);
   } catch (e) {
      window.showErrorMessage(`Something went wrong installing ${hlsName} from PyPI.\n ${e}`);
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
