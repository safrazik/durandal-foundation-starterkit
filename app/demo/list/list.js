define(['knockout', '../items'], function(ko, items){
	var List = function(){
		this.items = items;
	}
	return List;
})