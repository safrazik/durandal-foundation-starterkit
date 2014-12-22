define(['durandal/app', 'plugins/dialog', 'durandal/viewEngine', 'jquery'], function(app, dialog, viewEngine, $){

    function enableAutoclose(theDialog, targetOnly){
        if(targetOnly === undefined){
            targetOnly = true;
        }
        if (theDialog.owner && theDialog.owner.autoclose){
            theDialog.$overlay.on('click', function (e) {
                if(!targetOnly || e.target == this){ // only if the target itself has been clicked
                    theDialog.close();
                }
            });
        }
    }

    function onAnimationEnd ($elem, callback) {
        $elem.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', callback);
    }

    function getAnimationClasses(data){
        return [data.animationIn, data.animationOut, data.animationSpeed, data.animationEasing];
    }

    function ensureDialogAnimations(theDialog, defaults){
        var params = ['animationIn', 'animationOut', 'animationSpeed', 'animationEasing'];
        params.forEach(function(param){
            theDialog[param] = theDialog.owner[param] || defaults[param] || '';
        });
        if(theDialog.animationSpeed == 'default'){
            theDialog.animationSpeed = '';
        }
    }


    dialog.addContext('offcanvas', {
        addHost: function(theDialog){
            var model = theDialog.owner;
            var position = model.position || 'left';
            var $host = $('<div style="z-index: 2;"></div>').addClass(['off-canvas', position].join(' '));
            $('.grid-frame').first().before($host);
            var $overlay = $('<div class="modal-overlay is-active ng-enter fast fadeIn" style="z-index: 1;"></div>').appendTo(document.body);
            if(!model.overlay){
                $overlay.css('background', 'transparent');
            }
            theDialog.host = $host.get(0);
            theDialog.$host = $host;
            theDialog.$overlay = $overlay;
        },
        removeHost: function(theDialog){
            theDialog.$host.removeClass('is-active');
            theDialog.$overlay.removeClass('fadeIn ng-enter ng-enter-active')
                .addClass('fadeOut ng-leave ng-leave-active');
            onAnimationEnd(theDialog.$host, function(){
                theDialog.$host.remove();
                theDialog.$overlay.remove();
            });
        },
        compositionComplete: function(child, parent, context){
            var theDialog = dialog.getDialog(context.model);
            window.setTimeout(function(){
                theDialog.$host.addClass('is-active');
                theDialog.$overlay.addClass('ng-enter-active');
            }, 10);
            enableAutoclose(theDialog);
        }
    });

    dialog.addContext('panel', {
        addHost: function(theDialog){
            var model = theDialog.owner;
            var position = model.position || 'left';
            var animationMap = {'left': ['Right', 'Left'], 'right': ['Left', 'Right'], 'top': ['Down', 'Up'], 'bottom': ['Up', 'Bottom']};
            ensureDialogAnimations(theDialog, {
                animationIn: 'slideIn' + animationMap[position][0],
                animationOut: 'slideOut' + animationMap[position][1],
                // animationSpeed: 'fast', 
            });

            if(model.transform){
                theDialog.$host = $('#' + model.transform);
                model.autoclose = true;
                model.getView = function(){
                    return document.createElement('div');
                }
                theDialog.host = document.createElement('div')
                document.body.appendChild(theDialog.host);
                theDialog.isDummy = true;
            }
            else {
                theDialog.$host = $('<div class="panel panel-fixed"></div>')
                .appendTo(document.body);
                theDialog.host = theDialog.$host.get(0);
            }
            theDialog.$host.addClass(['panel-' + position, 'is-active', theDialog.animationIn, theDialog.animationSpeed, theDialog.animationEasing, 'ng-enter'].join(' '));
            theDialog.$overlay = $('<div class="modal-overlay fadeIn ng-enter is-active ' 
                + theDialog.animationSpeed + '" style="z-index: 1;"></div>').insertAfter(theDialog.$host);
            if(!model.overlay){
                theDialog.$overlay.css('background-color', 'transparent');
            }
        },
        removeHost: function(theDialog){
            theDialog.$overlay.removeClass('fadeIn ng-enter ng-enter-active')
                .addClass('fadeOut ng-leave ng-leave-active');
            theDialog.$host.removeClass(theDialog.animationIn + ' ng-enter ng-enter-active')
                .addClass(theDialog.animationOut + ' ng-leave ng-leave-active');
            onAnimationEnd(theDialog.$overlay, function(){
                if(theDialog.isDummy){
                    if(theDialog.host && theDialog.host.parentNode){
                        theDialog.host.parentNode.removeChild(theDialog.host);
                    }
                    theDialog.$host.removeClass(theDialog.animationOut + ' is-active ng-leave ng-leave-active');
                }
                else {
                    theDialog.$host.remove();
                }
                theDialog.$overlay.remove();
            });
        },
        compositionComplete: function(child, parent, context){
            var theDialog = dialog.getDialog(context.model);
            window.setTimeout(function(){
                theDialog.$host.addClass('is-active ng-enter-active');
                theDialog.$overlay.addClass('ng-enter-active');
            }, 10);
            enableAutoclose(theDialog);
        }
    });


    dialog.addContext('notification', {
        addHost: function(theDialog) {
            var model = theDialog.owner;
            if(model.title || model.content){
                model.close = function(){
                    dialog.close(this);
                }
                model.getView = function(){
                    return viewEngine.processMarkup('<div class="grid-block"><a href="#" class="close-button" data-bind="click: close">&times;</a>'
                    + '<!-- ko if: $data.image --><div class="notification-icon"><img alt="Notification Image" data-bind="attr: {src: $data.image}"></div><!-- /ko -->'
                    + '<div class="notification-content"><h1 data-bind="text: $data.title"></h1><p>' + model.content + '</p></div></div>');
                }
            }
            var color = model.color || '';
            var position = model.position || '';
            position = position.split(' ').join('-');
            ensureDialogAnimations(theDialog, {
                animationIn: 'fadeIn',
                animationOut: 'fadeOut',
            });
            var $host = $('<div></div>').addClass([theDialog.animationEasing, theDialog.animationIn, theDialog.animationSpeed,
                 color, position, 'notification', 'is-active', 'ng-enter'].join(' ')).appendTo(document.body);
            theDialog.host = $host.get(0);
            theDialog.$host = $host;
        },
        removeHost: function(theDialog) {
            theDialog.$host.removeClass([theDialog.animationIn, 'ng-enter', 'ng-enter-active'].join(' '))
                .addClass([theDialog.animationOut, 'ng-leave', 'ng-leave-active'].join(' '));
            onAnimationEnd(theDialog.$host, function(){
                theDialog.$host.remove();
            });
        },
        compositionComplete: function(child, parent, context) {
            var theDialog = dialog.getDialog(context.model);
            var $closeButton = $(child).find('.close-button');
            if(!$closeButton.length){
                $closeButton = $('<a href="#" class="close-button"></a>');
                $closeButton.on('click', function(e){
                    e.preventDefault();
                    theDialog.close();
                });
            }
            $closeButton.appendTo(theDialog.$host);
            window.setTimeout(function(){
                theDialog.$host.addClass('ng-enter-active');
            }, 10);
        }
    });




    dialog.addContext('actionsheet', {
        addHost: function(theDialog){
            var model = theDialog.owner;
            if(model.actions){
                model.selectAction = function(action){
                    dialog.close(model, action);
                };
                model.getView = function(){
                    return viewEngine.processMarkup('<p data-bind="text: title"></p>'
                             + '<ul data-bind="foreach: actions">'
                            +'<li><a href="#" data-bind="text: $data, '
                            + 'click: $parent.selectAction"></a></li></ul>');

                };
            }
            theDialog.$target = $(model.target);
            if(!theDialog.$target.length){
                throw new Error('Actionsheet should have a target');
            }
            var position = model.position || 'bottom';
            theDialog.$target.wrap('<div class="action-sheet-target-wrapper"></div>'); 
            theDialog.$target.parent().wrap('<div class="action-sheet-container"></div>');
            var $container = theDialog.$target.parent().parent();
            theDialog.$host = $('<div class="action-sheet ' + position + '" style="z-index: 2000"></div>')
            .appendTo($container);
            theDialog.host = theDialog.$host.get(0);
            theDialog.$overlay = $('<div class="modal-overlay is-active fadeIn ng-enter fast"></div></div>')
            .insertAfter($container);
            if(!model.overlay){
                theDialog.$overlay.css('background-color', 'transparent');
            }
        },
        removeHost: function(theDialog) {
            theDialog.$overlay.removeClass('fadeIn ng-enter ng-enter-active')
                .addClass('fadeOut ng-leave ng-leave-active');
            theDialog.$host.removeClass('is-active');
            onAnimationEnd(theDialog.$host, function(){
                theDialog.$host.parent().before(theDialog.$target);
                theDialog.$host.parent().remove();
                theDialog.$overlay.remove();
            });
        },
        compositionComplete: function(child, parent, context){
            var theDialog = dialog.getDialog(context.model);
            window.setTimeout(function(){
                theDialog.$host.addClass('is-active');
                theDialog.$overlay.addClass('ng-enter-active'); 
            }, 10);
            enableAutoclose(theDialog);
        }
    }); 



    dialog.addContext('popup', {
        addHost: function(theDialog){
            var model = theDialog.owner;
            if(model.content){
                model.getView = function(){
                    return viewEngine.processMarkup('<div>' + model.content + '</div>');

                };
            }
            theDialog.$target = $(model.target);
            if(!theDialog.$target.length){
                throw new Error('Popup should have a target');
            }
            theDialog.$target.wrap('<div class="popup-target-wrapper"></div>'); 
            theDialog.$target.parent().wrap('<div class="popup-container" style="position: relative; display: inline-block;"></div>');
            var $container = theDialog.$target.parent().parent();
            theDialog.$host = $('<div class="padding popup is-active" style="z-index: 2000;'
             // + ' position: absolute; top: -50%; left: -50%;'
             + '"></div>')
            .appendTo($container);
            theDialog.host = theDialog.$host.get(0);
            theDialog.$overlay = $('<div class="modal-overlay is-active fadeIn ng-enter fast"></div></div>')
            .insertAfter($container);
            if(!model.overlay){
                theDialog.$overlay.css('background-color', 'transparent');
            }
        },
        removeHost: function(theDialog) {
            theDialog.$overlay.removeClass('fadeIn ng-enter ng-enter-active')
                .addClass('fadeOut ng-leave ng-leave-active');
            theDialog.$host.removeClass('tether-enabled');
            onAnimationEnd(theDialog.$host, function(){
                theDialog.$host.parent().before(theDialog.$target);
                theDialog.$host.parent().remove();
                theDialog.$overlay.remove();
            });
        },
        compositionComplete: function(child, parent, context){
            var theDialog = dialog.getDialog(context.model);
            window.setTimeout(function(){
                theDialog.$host.addClass('tether-enabled');
                theDialog.$overlay.addClass('ng-enter-active'); 
            }, 10);
            enableAutoclose(theDialog);
        }
    });

    dialog.addContext('default', {
        addHost: function(theDialog) {
            var model = theDialog.owner;
            ensureDialogAnimations(theDialog, {
                animationIn: 'slideInUp',
                animationOut: 'slideOutBottom',
                animationSpeed: 'fast',
                // animationEasing: 'bounceIn',
            });
            var size = model.size || '';
            var style = model.style || '';
            theDialog.$overlay = $('<div class="modal-overlay is-active fadeIn ng-enter ' + theDialog.animationSpeed + '"></div>')
                .appendTo(document.body);
            theDialog.$host = $('<div style="' + style + '" class="' + 
                [size, 'modal', 'is-active', theDialog.animationEasing, theDialog.animationIn, theDialog.animationSpeed, 'ng-enter'].join(' ')
                 + '"></div>').appendTo(theDialog.$overlay);
            theDialog.host = theDialog.$host.get(0);
            if(model.overlay === false){
                theDialog.$overlay.css('background-color', 'transparent');
            }
        },
        removeHost: function(theDialog) {
            theDialog.$overlay.removeClass('fadeIn ng-enter ng-enter-active')
                .addClass('fadeOut ng-leave ng-leave-active');
            theDialog.$host.removeClass(theDialog.animationIn + ' ng-enter ng-enter-active')
                .addClass(theDialog.animationOut + ' ng-leave ng-leave-active');
            onAnimationEnd(theDialog.$overlay, function(){
                theDialog.$host.remove();
                theDialog.$overlay.remove();
            });
        },
        compositionComplete: function(child, parent, context) {
            var theDialog = dialog.getDialog(context.model);
            window.setTimeout(function(){
                theDialog.$overlay.addClass('ng-enter-active');
                theDialog.$host.addClass('ng-enter-active');
            }, 10);

            enableAutoclose(theDialog);

            $(child).find('.autofocus').first().focus();
        }
    });


    dialog.MessageBox.defaultOptions = ['OK'];
    dialog.MessageBox.setDefaults({
        buttonClass: 'button',
        primaryButtonClass: ' autofocus',
        secondaryButtonClass: 'secondary',
        'class': 'messageBox', style: {width: '100%'}
    });

    dialog.MessageBox.defaultViewMarkup = [
    '<div data-view="plugins/messageBox" class="padding" data-bind="css: getClass(), style: getStyle()">',
        // '<h4 class="subheader" data-bind="text: title"></h4>',
        // '<p class="message" data-bind="text: message"></p>',
        '<dl><dt data-bind="text: title"></dt>',
        '<dd data-bind="text: message"></dd></dl>',
        '<div class="footer float-right">',
            '<!-- ko foreach: options -->',
            '<button style="margin: 0;" data-bind="click: function () { $parent.selectOption($parent.getButtonValue($data)); }, text: $parent.getButtonText($data), css: $parent.getButtonClass($index)"></button>',
            '<!-- /ko -->',
            '<div style="clear:both;"></div>',
        '</div>',
    '</div>',
    ].join('\n');

    dialog.MessageBox.prototype.size = 'tiny';

    dialog.MessageBox.prototype.animationIn = 'zoomIn';
    dialog.MessageBox.prototype.animationOut = 'fadeOut';
    dialog.MessageBox.prototype.animationSpeed = 'fast';
    dialog.MessageBox.prototype.animationEasing = 'bounceIn';
    dialog.MessageBox.prototype.style = 'height: auto;';

    ['actionsheet', 'panel', 'offcanvas', 'notification', 'popup'].forEach(function(name){
        var helperName = 'show' + name.substr(0, 1).toUpperCase() + name.substr(1);
        app[helperName] = dialog[helperName].bind(dialog);
    });

});