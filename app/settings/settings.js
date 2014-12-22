define(['knockout', 'plugins/dialog'], function(ko, dialog){
	var Settings = function(){
		this.autoclose = true;

	    this.enterAnimations = [
	      'slideInDown',
	      'slideInUp',
	      'slideInLeft',
	      'slideInRight',
	      'fadeIn',
	      'hingeInFromTop', // hingeOutFromBottom
	      'hingeInFromBottom', // hingeOutFromTop
	      'hingeInFromRight', // hingeOutFromLeft
	      'hingeInFromLeft',
	      'hingeInFromMiddleX',
	      'hingeInFromMiddleY',
	      'zoomIn',
	      'spinIn',
	      'spinInCCW',
	    ];
	    this.leaveAnimations = this.enterAnimations.map(function(anim){
	      return anim.replace('In', 'Out');
	    });
	    this.animationEasings = ['linear', 'ease', 'easeIn', 'easeOut', 'easeInOut', 'bounceIn', 'bounceOut', 'bounceInOut'];

		this.settings = {};
		this.done = function(){
			dialog.close(this);
		}
		this.activate = function(settings){
			if(settings){
				this.settings = settings;
			}
		}
	}
	return Settings;
})