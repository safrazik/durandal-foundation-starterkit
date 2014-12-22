define('transitions/motion', ['durandal/system', 'jquery'], function(system, $) {

    function getReverseAnimation(animation){
        var reverseMap = {
            'slideInLeft': 'slideInRight',
            'slideOutLeft': 'slideOutRight',
            'spinIn': 'spinInCCW',
            'spinOut': 'spinOutCCW',
            'hingeInFromLeft': 'hingeInFromRight',
            'hingeOutFromLeft': 'hingeOutFromRight',
            'hingeInFromTop': 'hingeInFromBottom',
            'hingeOutFromTop': 'hingeOutFromBottom',
            'slideInUp': 'slideInDown',
            'slideOutUp': 'slideOutDown',

        };
        for(var anim in reverseMap){
            if(animation == anim){
                return reverseMap[anim];
            }
            if(animation == reverseMap[anim]){
                return anim;
            }
        }
        return animation;
    }

    function getReverseAnimationOut(animationOut){
        return getReverseAnimation(animationOut);
    }

    function getReverseAnimationIn(animationIn){
        return getReverseAnimation(animationIn);
    }

    var animationEasingDefault = 'ease';
    var animationSpeedDefault = '';

    var animationInDefault = 'fadeIn';
    var animationOutDefault = 'fadeOut';

    var workaroundStartValues = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    };
    var workaroundEndValues = {
        position: '',
        width: '',
        height: '',
        overflow: '',
        top: '',
        left: '',
        right: '',
        bottom: '',
    };

    function guessReverseTransition (context) {
        if(!context.activeView){
            return false;
        }
        var router = context.model.router;
        if(!router && context.bindingContext && context.bindingContext.$data && context.bindingContext.$data.router){
            router = context.bindingContext.$data.router;
        }
        if(!router){
            return false;
        }

        var activeViewId = $(context.activeView).data('view');
        var childId = $(context.child).data('view');
        var sameParent = false, childLevel = 0, activeViewLevel = 0;
        router.routes.forEach(function(route){
            if(activeViewId == route.moduleId){
                sameParent = true;
                activeViewLevel = route.depth || 0;
            }
            if(childId == route.moduleId){
                childLevel = route.depth || 0;
            }
        });
        return sameParent && (childLevel < activeViewLevel);
        return false;
    }

    function getContextValue(context, property){
        if(typeof context[property] === 'function'){
            return context[property]();
        }
        return context[property];
    }

    var motion = function(context) {
        return system.defer(function(dfd) {

            var isReverse = guessReverseTransition(context);

            var animationIn = getContextValue(context, 'animationIn'),
             animationOut = getContextValue(context, 'animationOut');

            if(isReverse){
                animationIn = getReverseAnimationIn(animationIn || animationInDefault);
                animationOut = getReverseAnimationOut(animationOut || animationOutDefault);
            }
            else {
                animationIn = animationIn || animationInDefault;
                animationOut = animationOut || animationOutDefault;
            }

            var animationEasing = getContextValue(context, 'animationEasing') || animationEasingDefault;
            var animationSpeed = getContextValue(context, 'animationSpeed') || animationSpeedDefault;

            function endTransition() {
                dfd.resolve();
            }

            var $child = $(context.child);
            var $activeView = $(context.activeView);

            if (!$child.length) {
                $activeView.fadeOut(300, endTransition);
                return;
            }

            function startTransition() {
                window.setTimeout(function(){
                	context.triggerAttach();
                	$child.show();
                	$child.css({display: '', opacity: '' });
                    $child.addClass('ng-enter-active');
                }, 1);
    			$child.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                    $child.removeClass([animationIn, animationOut, animationEasing, animationSpeed,
                        'ng-enter', 'ng-enter-active', 'ng-leave', 'ng-leave-active'].join(' '));
                    $child.css(workaroundEndValues);
    				endTransition();
    			});
            }

            $child.removeClass([animationOut, 'ng-leave', 'ng-enter-active', 'ng-leave-active'].join(' '));
            $child.addClass([animationIn, 'ng-enter', animationEasing, animationSpeed].join(' '));

            $child.css(workaroundStartValues);

            startTransition();

            if(!$activeView.length) {
                return;
            }

        	$activeView.show();
        	$activeView.css({display: '', opacity: ''});
        	$activeView.css(workaroundStartValues);

            $activeView.removeClass([animationIn, 'ng-enter', 'ng-leave-active', 'ng-enter-active'].join(' '));
			$activeView.addClass([animationOut, 'ng-leave', animationEasing, animationSpeed].join(' '));

            window.setTimeout(function(){
            	$activeView.addClass('ng-leave-active');
    			$activeView.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                    $activeView.removeClass([animationIn, animationOut, animationEasing, animationSpeed,
                        'ng-enter', 'ng-enter-active', 'ng-leave', 'ng-leave-active'].join(' '));
    				$activeView.css(workaroundEndValues);
    			});
            }, 1);
        }).promise();
    };

    return motion;
});