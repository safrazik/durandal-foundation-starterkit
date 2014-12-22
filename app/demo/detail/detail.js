define(['../items', 'knockout'], function(items, ko){
	var Detail = function(){
		var self = this;
		self.activeAccordion = ko.observable(1);
		self.makeActive = function(i){
			self.activeAccordion(i);
		}
		self.activate = function(id){
			items.forEach(function(item){
				if(item.id == id){
					self.item = item;
				}
			});
		}
	}
	return Detail;
});