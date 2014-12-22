var bower = '../../bower_components';

requirejs.config({
  paths: {
    'jquery': bower + '/jquery/jquery',
    'knockout': bower + '/knockout.js/knockout.debug',
    'text': bower + '/requirejs-text/text',
    'durandal': bower + '/durandal/js',
    'plugins': bower + '/durandal/js/plugins',
    'transitions': bower + '/durandal/js/transitions',
    'fastclick': bower + '/fastclick/lib/fastclick',
    'IconicJS': bower + '/foundation-apps/js/vendor/iconic.min',
  },
  deps: [
  	bower + '/durandal-foundation/dialog',
  	bower + '/durandal-foundation/motion',
  	bower + '/durandal-foundation/bindings',
  ],
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'fastclick'], 
	function(system, app, viewLocator, FastClick){

	FastClick.attach(document.body);
	
	//>>excludeStart("build");
	system.debug(true);
	//>>excludeEnd("build");

	app.title = 'Durandal Starter Kit';

	app.configurePlugins({
	    router:true,
	    dialog: true,
	});

	app.start().then(function() {
	    //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
	    //Look for partial views in a 'views' folder in the root.
	    viewLocator.useConvention();

	    //Show the app by setting the root view model for our application with a transition.
	    app.setRoot('shell/shell', 'motion');
	});

});