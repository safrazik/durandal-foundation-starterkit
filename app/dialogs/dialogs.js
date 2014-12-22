define(['knockout', 'plugins/dialog'], function(ko, dialog){

	var ViewModel = function(){

		this.showDialog = function(variant, params){
			if(variant == 'Modal'){
				variant = '';
			}
			return dialog['show' + variant]('dialogs/hello', params);
		}

		// Modal
		this.showBasicModal = function(){
			this.showDialog('Modal', {autoclose: true});
		}
		this.showAdvancedModal = function(){
			this.showDialog('Modal', {
				autoclose: true,
				animationIn: 'hingeInFromMiddleX',
				animationOut: 'hingeOutFromMiddleX',
				animationSpeed: '',
				animationEasing: 'bounceIn',
				size: 'large',
			});
		}
		// end Modal

		// Offcanvas
		this.showBasicOffcanvas = function(){
			this.showDialog('Offcanvas', {autoclose: true});
		}
		this.showAdvancedOffcanvas = function(){
			this.showDialog('Offcanvas', {
				autoclose: true,
				position: 'right',
				overlay: true,
			});
		}
		this.showOffcanvasVariant = function(position){
			return this.showDialog('Offcanvas', {
				autoclose: true,
				position: position,
			});
		}
		this.showTopOffcanvas = function(){
			this.showOffcanvasVariant('top');
		}
		this.showRightOffcanvas = function(){
			this.showOffcanvasVariant('right');
		}
		this.showBottomOffcanvas = function(){
			this.showOffcanvasVariant('bottom');
		}
		// end Offcanvas

		// Panel
		this.showBasicPanel = function(){
			this.showDialog('Panel', {autoclose: true});
		}
		this.showAdvancedPanel = function(){
			this.showDialog('Panel', {
				autoclose: true,
				position: 'right',
				overlay: true,
				// animationSpeed: 'fast',
				animationIn: 'hingeInFromRight',
				animationOut: 'hingeOutFromRight',
				animationEasing: 'bounceIn',
			});
		}
		this.showPanelVariant = function(position){
			return this.showDialog('Panel', {
				autoclose: true,
				position: position,
			});
		}
		this.showTopPanel = function(){
			this.showPanelVariant('top');
		}
		this.showRightPanel = function(){
			this.showPanelVariant('right');
		}
		this.showBottomPanel = function(){
			this.showPanelVariant('bottom');
		}
		this.showTransformingPanel = function(){
			dialog.showPanel({
				transform: 'secondary-side-bar',
				overlay: false,
				position: 'right',
			});
		}
		// end Panel

		// Actionsheet
		this.whereToShare = ko.observable();
		this.showBasicActionsheet = function(data, event){
			dialog.showActionsheet({
				target: event.target,
				autoclose: true,
				// overlay: true,
				title: 'Share this',
				actions: ['Twitter', 'Facebook', 'Mail'],
				// position: 'top',
			}).then(function(action){
				if(!action){
					this.whereToShare(null);
					return;
				}
				this.whereToShare(action);
			}.bind(this));
		}
		this.showAdvancedActionsheet = function(data, event){
			this.showDialog('Actionsheet', {
				target: event.target,
				position: 'top',
				autoclose: true,
				overlay: true,
			});
		}
		// end Actionsheet

		// Popup
		this.showBasicPopup = function(data, event){
			dialog.showPopup({
				target: event.target,
				autoclose: true,
				// overlay: true,
				content: "If the girl you love moves in with another guy once, it's more than enough. Twice, it's much too much. Three times, it's the story of your life.",
			});
		}
		this.showAdvancedPopup = function(data, event){
			this.showDialog('Popup', {
				target: event.target,
				position: 'top',
				autoclose: true,
				overlay: true,
			});
		}
		// end Popup

		// Notification
		this.showBasicNotification = function(){
			dialog.showNotification({
				autoclose: true,
				title: 'My Notification',
				content: 'Content of notification',
				image: 'http://www.clipartbest.com/cliparts/acq/X8R/acqX8RdcM.jpeg',
				position: 'bottom left',
				color: 'dark',
			});
		}
		this.showAdvancedNotification = function(){
			this.showDialog('Notification', {
				position: 'bottom right',
				color: 'alert',
			})
		}
		// end Notification

		// MessageBox
		this.showBasicMessageBox = function(){
			dialog.showMessage('This is a basic alert!', 'Message');
		}
		this.userIsCrazy = ko.observable();
		this.showAdvancedMessageBox = function(){
			dialog.showMessage('Are You Crazy?', 'Self Evaluation', ['Yes', 'No']).then(function(result){
				this.userIsCrazy(result == 'Yes');
			}.bind(this));
		}
		// end MessageBox
	}


	return ViewModel;

});