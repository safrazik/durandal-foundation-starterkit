define(['knockout', 'plugins/router'], function(ko, router){
	var Demo = function(){
		this.router = router.createChildRouter()
	        .makeRelative({
	            moduleId:'demo',
	            fromParent:true
	        }).map([
	            { route: '',      moduleId: 'list/list',       title: 'Demo List',
	        	  depth: 0
	        	},
	            { route: 'detail/:id',      moduleId: 'detail/detail',       title: 'Demo List',
	              depth: 1 // depth is important for reverse transitions to work
		        },
	        ]).buildNavigationModel();
		this.activate = function(){
		}
	}
	return Demo;
})