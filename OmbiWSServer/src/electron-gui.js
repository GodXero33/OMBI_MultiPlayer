
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV !== 'development';
const isMac = process.platform === 'darwin';

function createMainWindow () {
	const mainWindow = new BrowserWindow({
		title: 'Image Resizer',
		width: isDev ? 1000 : 500,
		height: 600
	});

	// Open devtools if in dev env.
	if (isDev) mainWindow.webContents.openDevTools();

	mainWindow.loadFile(path.join(__dirname, '../public/status-api.html'));
}

const menu = [
	...(isMac ? [
		{
			label: app.name
		}
	] : [
		{
			label: 'Help'
		}
	]),
	{
		role: 'fileMenu'
	}
];

app.on('ready', () => {
	createMainWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
	});

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') app.quit();
	});

	const mainMenu = Menu.buildFromTemplate(menu);
	Menu.setApplicationMenu(mainMenu);
});
