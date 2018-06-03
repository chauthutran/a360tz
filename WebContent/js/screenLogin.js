$(function () {
	
	function resizeForm( height, width )
	{	
		if ( window.orientation == undefined || window.orientation == 0 || window.orientation== 90 ) {
			var usr_nav = $('#selsr').val();
			if (usr_nav == 'U303120') {
				$('header').css('margin-top', '0px');
				$('.back_to_session_form_btn img').css('display', 'none');
				$('body').addClass("bk_pineapple");
			}
			if (usr_nav == 'U303125') {
				$('.back_to_session_form_btn img').css('display', 'none');
				$('.main').css('display', 'none');
				$('body').addClass("bk_pineapple");
			}
			if (usr_nav == 'U5404685') {
				$('body').addClass("bk_mint");
				$('.main').css("display", "block");
			   $('#header_2').css("width", "60%");
			}
			var AvailableWidth = screen.availWidth;
			var AviableHeight = screen.availHeight;
			
			$('body').css('height', height);
			$('.contenedor').css('height', '100%');
			alt = $('.form_aside').height();
			
			
			if (window.orientation == 0) {
				$('.main').hide();
				$('.contenedor').css('height', height);
				$('.title_usr').css('font-size', '140%');
				$('footer').css('padding-top', '1%');
				$('aside').css({
					'width': '100%'
				});
				
			} else {
				$('.contenedor').css('height', height);
				$('.title_usr').css('font-size', '240%');
				
				if (width <= 640) {
					$('.main').hide();
					$('aside').css("width", "100%");
					$('aside').css( "padding", "0%");
					
				} else {
					$('.main').show();
					$('main').css("width", "25%");
					$('main').css('padding', '0%');
					
					$('aside').css("width", "75%");
					$('aside').css( "padding", "0%");
				}
				
			}
		
			$("#log_language").width( $("#log_password").width() );
		}
	}

	
	 $(window).resize(function () {
		var height = $(window).height();
		var width = $(window).width();
		resizeForm( height, width );
	}); 

	
    $(document).ready(function () {
        $(window).bind("orientationchange", function (event) {
            // location.reload();
			var height = $(window).height();
			var width = $(window).width();
			resizeForm( height, width );// In this case, when we rotate, hight is width, and width is a hight
        });
		
		var height = $(window).height();
		var width = $(window).width();
		resizeForm( height, width );
    });
});