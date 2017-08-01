+function($){
	'use strict';
	
	var xuiClass = {
		xuiRadio: function(e){
			$(this)		
			.addClass('xui-radio-checked')
			.parent().siblings().find('.xui-radio').removeClass('xui-radio-checked');
			
			//$(this).data("getValue", $(this).next().text().trim());			
			
			return false;
		},
		xuiCheckbox: function(event){
			
			$(this).toggleClass('xui-checkbox-checked');
			
			return false;
			
		},
		xuiSelect: function(){
			
			var _this = $(this);
			_this.toggleClass('xui-select-change');
			if(_this.hasClass('xui-select-change')){
				_this.next().removeClass('slide-up-leave-active').addClass('slide-up-enter-active');
			}else{
				_this.next().removeClass('slide-up-enter-active').addClass("slide-up-leave-active");
			}
			
			_this.next().find('li').click(function(){
				_this.find('.xui-select-value').text($(this).text()).show().prev().hide();
				_this.next().removeClass('slide-up-enter-active').addClass("slide-up-leave-active");
				_this.removeClass('xui-select-change');
				
				return false;
			})		
			
			event.stopPropagation();			
		},
		xuiSwitch: function(){
		  $(this).toggleClass('xui-switch-checked');
		},
		xuiCollapse: function(){
			var _this = this;
			$(_this).next().slideToggle()			
			.parent().toggleClass('xui-collapse-active').end()			
			.parent().siblings().removeClass('xui-collapse-active').find('.xui-collapse-body').slideUp();
		}
	}
	
	
	
	//单选按钮	
	$.fn.Radio = function(){
		this.click(xuiClass.xuiRadio);
		return this;
	}
	
	//多选按钮
	$.fn.CheckBox = function(){
		this.click(xuiClass.xuiCheckbox);
		
		return this;
	}
	
	//select选择框
	$.fn.Select = function(){
		this.find('.xui-select-selection').click(xuiClass.xuiSelect);
		return this;
	}
	
	//switch开关
	$.fn.Switch = function(){
		this.click(xuiClass.xuiSwitch);
		return this;
	}
	
	//mode对话框
	$.fn.Modal = function(option){
		var defaultSetting = {};
		var setting = $.extend(defaultSetting,option);
		
		var _this = this;
		$(_this).addClass('fadeIn').removeClass('fadeOut').show();
		
		
		//点击关闭
		$(_this)
		.find('.xui-model-close').click(function(){Close()})
		.end()
		.find('.xui-model-footer .xui-model-cancel').click(function(){Close()})
		
		$(document).bind('keydown', 'esc',function (event){
			Close();
		})
		
		
		$(setting.cancel).click(function(){Close()})
		
		
		//关闭
		function Close(){
			$(_this).removeClass('fadeIn').addClass('fadeOut');
			
			setTimeout(function(){
				$(_this).hide();
			}, 300)
			
		}
		
	}
	
	//Collapse 折叠面板
	$.fn.Collapse = function(){
		this.click(xuiClass.xuiCollapse);
		return this;
	}
	
	
	
	$('.xui-radio').Radio();
	
	$('.xui-checkbox').CheckBox();

	$('.xui-select').Select();
	
	$('.xui-switch').Switch();
	
	$('.xui-collapse-header').Collapse();
	
	
	//点击隐藏select下拉菜单
	$(document).not($(".xui-select")).click(function() {
		$(".xui-select .xui-select-selection").removeClass('xui-select-change')
		.next().removeClass('slide-up-enter-active').addClass("slide-up-leave-active");
    });

	
	
	
	$.extend({
		
		//$.Messgae() 全局提示框
		Message : function(option){
			var defaultSetting = {
				message:'这是一条提示信息',
				type:'info',
				isIcon: true,
				time: 2
			}
			var setting = $.extend(defaultSetting,option);
			
			var str = $('<div class="xiu-message-container"><div class="xiu-message fadeInDown"><div class="xui-message-notice-content xui-message-info-icon"><span class="xui-message-icon"><i class="xui-icon ion-information-circled"></i></span><div class="xui-message-body">'+ setting.message +'</div></div></div></div>');	
			
			$('body').append(str);
			
			setTimeout(function(){				
				str.find(".xiu-message").removeClass('fadeInDown').addClass('fadeInUp');		
				
				//500毫秒后删除
				setTimeout(function(){
					str.remove();
				},500);
			}, setting.time * 1000)
			
		}
		
		
	});
	
}(jQuery)