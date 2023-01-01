import { ExtensionContext, services, workspace, window, LanguageClient } from 'coc.nvim';
import { hlsName, hlsVersion } from '../package.json';
import { getHlsExecutable } from './hlsExecutable';


export async function activate(context: ExtensionContext): Promise<void> {
	const config = workspace.getConfiguration('coc-helios');
	const isEnabled = config.get<boolean>('enable', true)
	if (!isEnabled) {
		return
	}

	const serverOptions = getHlsExecutable();
	const clientOptions = {
		documentSelector: ['*.hl', 'hl']
	};
	const client = new LanguageClient(
		'coc-helios',
		'coc-helios',
		serverOptions,
		clientOptions
	);
	context.subscriptions.push(services.registLanguageClient(client));

   client.onReady().then(() => {
      window.showMessage(`${hlsName} v${hlsVersion} running successfully.`);
   })
}
