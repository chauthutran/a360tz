
	
    function resizeForm( height, width )
	{
    	if( height === undefined )
    	{
    		height = $(window).height();
    		width = $(window).width(); 
    	}
		var usr_nav = $('#selsr').val();
		if (usr_nav == 'U303120') {
			$('header').css('margin-top', '0px');
			$('.back_to_session_form_btn img').css('display', 'none');
		}
		if (usr_nav == 'U303125') {
			$('.back_to_session_form_btn img').css('display', 'block');
			//$('.main').css('display', 'none');
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
		
//		$(".session_ic tbody").removeAttr("suggestedheight");
		
		$('body').css('height', height);
		
		
		setContenedorHeight( height );
		var mainVisibleHeight = $('.mainDiv:visible').height();
		alt = $('.mainDiv:visible').find('.form_aside').height();
//		setContenedorHeight( height );
	    
		if( $('.mainDiv:visible').hasClass("registration_tag"))
		{
			$('.mainDiv:visible').find(".data_app_page").css( 'height', '100%' );
			$("#menu_log").css("margin-top", "0px");

			$("#back_to_session_form_btn").show();
			$('.main').hide();
			$('.mainDiv:visible').find('aside').css( 'width', '100%' );
			$('.mainDiv:visible').find('aside').css( 'padding-left', '1%' );
			$('.mainDiv:visible').find('aside').css( 'padding-right', '10px' );
			// $('.mainDiv:visible').find('.reg_pad').css('padding-top', '10px');
			
			$('.rg_cont').css("height", "95%");
			
			// if (window.orientation == 0) 
			if( height > width )
			{
				$('header').css("height", "15%");
				$("#back_to_session_form_btn").find("img").width( $("#switch_view_mode_btn").find("img").width() );
				$("#back_to_session_form_btn").css("margin-right", "0px");
				
				//$("#back_to_session_form_btn").find("img").css("width", "40px");
				$('header').css("height", "15%");
				$('.title_usr').css('font-size', '140%');
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
				$('header').css("height", "20%");
				
				$("#back_to_session_form_btn").find("img").width( "30%" );
				$("#back_to_session_form_btn").css("margin-right", "15px");
				
				
				$('.title_usr').css('font-size', '240%');
				// $('.mainDiv:visible').find('.reg_pad').css('padding-top', '0%');
				//$("#back_to_session_form_btn").find("img").css("width", "20px");
				
				$('#show_search_voucher_form, #show_search_mobile_form, #show_search_client_form').css({
					'float': 'left',
					'width': "20%",
					'margin-left': '10%'
				});
			}
		}
		else
		{	
			if( $('.mainDiv:visible').attr("id") == "event_participant_div" )
			{
				// $('.mainDiv:visible').find(".data_app_page").css( 'height', '80%' );
			}
			else
			{
				$('.mainDiv:visible').find(".data_app_page").css( 'height', '100%' );
			}
			
			$("#back_to_session_form_btn").hide();
			
			if( height > width )
			{
				$('header').css("height", "15%");
				$("#menu_log").css("margin-top", "10px");
				
//				var session_ic_height = $('.mainDiv:visible').find('.form_aside').height() - $('.mainDiv:visible').find('.session_ia').height() - $('.mainDiv:visible').find('#closed_session_btn').height() - $('#no_active_event_msg').height() - 40;
//				$('.mainDiv:visible').find('.session_ic tbody').height(session_ic_height);
				$('.mainDiv:visible').find('.session_ic tbody').height(alt / 1.8);
				// //$('.mainDiv:visible').find('.event_p tbody').height(alt - 190);
				
				var detailEventHeight = $('.mainDiv:visible').find('.form_aside').height() - $('.mainDiv:visible').find('.nav').height() - $("#footer").height() - 60;
				$('.mainDiv:visible').find('.event_p tbody').height( detailEventHeight );
				
				// $('.mainDiv:visible').find('.session_ic tbody').height(mainVisibleHeight / 3);

			
				$('.main').hide();
				$('.back_to_session_form_btn img').css('display', 'block');
				$('.mainDiv:visible').find('.event-body').css('font-size', '100%');
				
				$('footer').css('padding-top', '1%');
				$('.mainDiv:visible').find('aside').css( 'width', '100%' );
				
			} else {
				$('header').css("height", "20%");
				$("#menu_log").css("margin-top", "10px");
				$('.mainDiv:visible').find('.session_ic tbody').height(alt / 3.3);
				
				if (width <= 640) {
					$('.main').hide();
					$('.back_to_session_form_btn img').css('display', 'block');
						
					$('.mainDiv:visible').find('aside').css( 'width', '100%' );
					$('.mainDiv:visible').find('aside').css( 'padding-left', '10px' );
					$('.mainDiv:visible').find('aside').css( 'padding-right', '10px' );
						
				} else {
					$('.mainDiv:visible').find('.main').show();
					$('.back_to_session_form_btn img').css('display', 'none');

					$('.main').css( 'width', '25%' );
					$('.main').css( 'padding', '0%' );
						
					$('.mainDiv:visible').find('aside').css( 'width', '75%' );
					$('.mainDiv:visible').find('aside').css( 'padding-left', '10px' );
					$('.mainDiv:visible').find('aside').css( 'padding-right', '10px' );
					
				}
				
				// $('.event-body').css('margin-top', '20px');
				// $('.mainDiv:visible').find('.reg_pad').css('padding-top', '0%');
				// $('.mainDiv:visible').find('.session_ic').css('width', '50px');
			}
			

			setContenedorHeight( height );
			
//			var session_ic_height = $('.mainDiv:visible').find('.form_aside').height() - $('.mainDiv:visible').find('.session_ia').height() - $('.mainDiv:visible').find('#closed_session_btn').height() - 20;
//			$('.mainDiv:visible').find('.session_ic tbody').height(session_ic_height );
//			$('.mainDiv:visible').find('.session_ic tbody').height(alt / 3.3);
			
			$('.mainDiv:visible').find('.event_p tbody').height(alt - 150);
			$('.mainDiv:visible').find('.event-body').css('font-size', '100%');
			
			
			Utils.resizeClosedSessionTable( $("#closed_event_list").find("tbody") );
//			// Utils.resizeClosedSessionTable( $("#event_list").find("tbody") );
		}
		

	}

	function setContenedorHeight( height )
	{
		var tags = $('.contenedor');
		var headerHeight = $("header").height();
		var containerHeight = height - headerHeight - 30
		for( var i=0;i<tags.length;i++)
		{
			$(tags[i]).css('height', containerHeight );
			$(tags[i]).find(".bg").css("background-size", containerHeight );
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
        	$(".session_ic tbody").removeAttr("suggestedheight");
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