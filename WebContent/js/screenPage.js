
    function resizeForm( height, width )
	{
		var usr_nav = $('#selsr').val();
		if (usr_nav == 'U303120') {
			$('header').css('margin-top', '0px');
			$('.back_to_session_form_btn img').css('display', 'none');
		}
		if (usr_nav == 'U303125') {
			$('.back_to_session_form_btn img').css('display', 'block');
			//$('.main').css('display', 'none');
			$('.mainDiv:visible').find('.session_ic').css('display', 'none');
			$('.mainDiv:visible').find('.event-body').css('width', '97%');
		}
		if (usr_nav == 'U5404685') {
			$('body').addClass("bk_mint");
			$('.back_to_session_form_btn img').css('display', 'none');
			//$('.main').css("display", "block");
			$('#header_2').css("width", "60%");
		}
		var AvailableWidth = screen.availWidth;
		var AviableHeight = screen.availHeight;
		
		$('body').css('height', height);
		
		
		setContenedorHeight( height );
		var mainVisibleHeight = $('.mainDiv:visible').height();
		alt = $('.mainDiv:visible').find('.form_aside').height();
		setContenedorHeight( height );
		
		if( $('.mainDiv:visible').hasClass("registration_tag"))
		{
			$('.mainDiv:visible').find('.main').hide();
			$('.mainDiv:visible').find('aside').css( 'width', '100%' );
			$('.mainDiv:visible').find('aside').css( 'padding-left', '0%' );
			$('.mainDiv:visible').find('aside').css( 'padding-right', '0%' );
			$('.mainDiv:visible').find('.reg_pad').css('padding-top', '10%');
			
			if (window.orientation == 0) 
			{
				//$("#back_to_session_form_btn").find("img").css("width", "40px");
				
				$('#show_search_voucher_form, #show_search_mobile_form, #show_search_client_form').css({
					'display': 'inline-block',
					'width': alt / 3.5,
					'margin-top': '1%',
					'margin-bottom': '1%',
					'margin-left': '30%'
				});
			}
			else
			{
				$('.mainDiv:visible').find('.reg_pad').css('padding-top', '0%');
				//$("#back_to_session_form_btn").find("img").css("width", "20px");
				
				$('#show_search_voucher_form, #show_search_mobile_form, #show_search_client_form').css({
					'float': 'left',
					'width': "20%",
					'margin-top': '5%',
					'margin-bottom': '1%',
					'margin-left': '10%'
				});
			}
		}
		else
		{	
			if (window.orientation == 0) {
				$('.mainDiv:visible').find('.session_ic tbody').height(mainVisibleHeight / 3);
				$('.mainDiv:visible').find('.event_p tbody').height(alt - 100);
			
				$('.mainDiv:visible').find('.main').hide();
				$('.back_to_session_form_btn img').css('display', 'block');
				$('.mainDiv:visible').find('.event-body').css('font-size', '100%');
				$('.title_usr').css('font-size', '140%');
				$('footer').css('padding-top', '1%');
				$('.mainDiv:visible').find('aside').css( 'width', '100%' );
				$('.mainDiv:visible').find('.reg_pad').css('padding-top', '10%');
				
				$('.session_ic').css('height', '80px');
			} else {
				$('.mainDiv:visible').find('.session_ic tbody').height(mainVisibleHeight / 10);
				$('.mainDiv:visible').find('.event_p tbody').height(alt - 100);
			
			
				$('.mainDiv:visible').find('.event-body').css('font-size', '100%');
				$('.title_usr').css('font-size', '240%');
				
				if (width <= 640) {
					$('.mainDiv:visible').find('.main').hide();
					$('.back_to_session_form_btn img').css('display', 'block');
						
					$('.mainDiv:visible').find('aside').css( 'width', '100%' );
					$('.mainDiv:visible').find('aside').css( 'padding-left', '10px' );
					$('.mainDiv:visible').find('aside').css( 'padding-right', '10px' );
						
				} else {
					$('.back_to_session_form_btn img').css('display', 'none');

					$('.mainDiv:visible').find('.main').show();
					$('.mainDiv:visible').find('.main').css( 'width', '25%' );
					$('.mainDiv:visible').find('.main').css( 'padding', '0%' );
						
					$('.mainDiv:visible').find('aside').css( 'width', '75%' );
					$('.mainDiv:visible').find('aside').css( 'padding-left', '0%' );
					$('.mainDiv:visible').find('aside').css( 'padding-right', '0%' );
					
				}
				
				// $('.event-body').css('margin-top', '20px');
				$('.mainDiv:visible').find('.reg_pad').css('padding-top', '0%');
				$('.mainDiv:visible').find('.session_ic').css('width', '50px');
			}
		}
	}

	function setContenedorHeight( height )
	{
		var tags = $('.contenedor');
		var headerHeight = $("header").height();
		for( var i=0;i<tags.length;i++)
		{
			$(tags[i]).css('height', height - headerHeight - 30 );
		}			
	}
	
	
	
	//var height = $(window).height();
	//var width = $(window).width();
		
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
			resizeForm( width, height );// In this case, when we rotate, hight is width, and width is a hight
			
			
			
			/* var tempHeight = height;
			var tempWidth = width;
			height = tempWidth;
			width = tempHeight;
			resizeForm( height, width );*/
			
        });
		var height = $(window).height();
		var width = $(window).width();
		resizeForm( height, width );
    });