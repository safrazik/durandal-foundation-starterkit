define(['knockout', 'plugins/dialog', 'jquery'], function(ko, dialog, $){

	var SayHello = function(){
		this.name = ko.observable();
		this.showCloseButton = ko.observable(true);
		this.activate = function(params){
			params = params || {};
			['target', 'autoclose', 'overlay', 'position', 'color', 'size',
			'animationIn', 'animationOut', 'animationSpeed', 'animationEasing'].forEach(function(prop){
				this[prop] = params[prop];
			}.bind(this));
			if(params.showCloseButton !== undefined){
				this.showCloseButton(params.showCloseButton);
			}
		}
		this.attached = function(view){
			$(view).find('input').focus();
		}
		this.close = function(){
			dialog.close(this);
		}
	}

	return new SayHello(); // return as singleton
})