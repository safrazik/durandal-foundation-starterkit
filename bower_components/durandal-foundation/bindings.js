define(['knockout', 'durandal/binder', 'jquery', 'IconicJS'], function(ko, binder, $, IconicJS){

	var iconic = new IconicJS();
    var originalBinding = binder.binding;

    binder.binding = function(obj, view, instruction) {
    	$(view).find('[zf-iconic]').each(function(){
    		iconic.inject(this);
    	});
    	originalBinding(obj, view, instruction);
    };

  	return {};
})