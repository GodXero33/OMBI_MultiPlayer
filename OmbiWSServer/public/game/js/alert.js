export default class AlertManager {
	constructor (messageDOM, toggleBtn) {
		this.messageDOM = messageDOM;
		this.toggleBtn = toggleBtn;
	}

	alert (message, type) {
		this.messageDOM.textContent = message;
		this.toggleBtn.checked = false;
	}
}
