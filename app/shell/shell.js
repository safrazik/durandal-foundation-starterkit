define(['plugins/router', 'plugins/dialog', 'knockout'], function(router, dialog, ko){

  var vm = {};

  vm.settings = {
    transition: ko.observable('motion'),
    animationIn: ko.observable('hingeInFromRight'),
    animationOut: ko.observable('hingeOutFromLeft'),
    animationSpeed: ko.observable('fast'),
    animationEasing: ko.observable('bounceIn'),
  };

  vm.showMainSidebar = function(){
    vm.panel = {
      transform: 'main-sidebar',
      overlay: true,
      animationSpeed: 'fast',
      animationEasing: 'ease',
    };
    dialog.showPanel(vm.panel);
  }

  vm.closeMainSidebar = function(){
    if(vm.panel){
      dialog.close(vm.panel);
    }
    return true;
  }

  vm.openSettings = function(){
    dialog.show('settings/settings', vm.settings);
  }

  vm.getTitle = function(){
    if(vm.router.activeInstruction()){
      return vm.router.activeInstruction().config.title;
    }
  }

  vm.activate = function(){
    vm.router = router.map([
      { route: ['','welcome'],  moduleId: 'welcome/welcome',  nav: true, title:'Welcome' },
      { route: 'dialogs',        moduleId: 'dialogs/dialogs',   nav: true, title: 'Dialogs' },
      { route: 'demo*details',        moduleId: 'demo/demo',   nav: true, title: 'Demo'},
      { route: 'flickr',        moduleId: 'flickr/flickr',   nav: true },
    ]).buildNavigationModel();

    return vm.router.activate();

  }

  return vm;

});
