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
		xuiCheckbox: function(){
			
			$(this).toggleClass('xui-checkbox-checked');
			
			return false;
			
		}
	}
	
	
	
	
	
	
		
	$.fn.Radio = function(){
		this.click(xuiClass.xuiRadio);
		
		return this;
	}
	$.fn.CheckBox = function(){
		this.click(xuiClass.xuiCheckbox);
		
		return this;
	}
	
	

	
	
	$('.xui-radio').Radio();
	
	$('.xui-checkbox').CheckBox()


	
}(jQuery)