
function RegistrationMode( _mainPage )
{
	var me = this;
	me.translationObj = _mainPage.translationObj;
	me.validationObj = _mainPage.validationObj;
	
	me.clientSearchList = [];
	me.processingCliendIdx = -1;
	
	me.headerTag = $("#event-body");
	me.backToSessionFormBtnTag = $("#back_to_session_form_btn");
	me.switchViewModeBtnTag = $("#switch_view_mode_btn");
	
	
	me.showSearchVoucherFormBtnTag = $("#show_search_voucher_form");
	me.showSearchMobileFormBtnTag = $("#show_search_mobile_form");
	me.showSearchClientFormBtnTag = $("#show_search_client_form");
	
	
	// Back to Session page
	me.checkPasswordDialogFormTag = $("#back_to_session_form");
	me.passwordTag = $("#pin_pass");
	me.checkPinErrorMsgTag = $("#check_pin_error_msg");
	me.checkPinYesBtnTag = me.checkPasswordDialogFormTag.find(".popup_foot_left");
	me.checkPinNoBtnTag = me.checkPasswordDialogFormTag.find(".popup_foot_right");
	
	
	// Search by Voucher code FORM
	me.searchVoucherForm = $("#search_by_voucher_form");
	me.voucherCodeTag = $("#voucher_code");
	me.searchByVoucherBtnTag = $("#search_by_voucher");
	me.cancelSearchByVoucherBtnTag = $("#cancel_search_by_voucher");
	

	// Search by Mobile number FORM
	me.searchMobileForm = $("#search_by_mobile_form");
	me.mobileNumberTag = $("#mobile_number");
	me.searchByMobileBtnTag = $("#search_by_mobile");
	me.cancelSearchByMobileBtnTag = $("#cancel_search_by_mobile");
	
	
	// Search by Client details FORM
	me.searchByClientForm = $("#search_by_client_form");
	me.searchByClientBtnTag = $("#seach_by_client_btn");
	me.cancelSearchByClientBtnTag = $("#cancel_seach_by_client_btn");
	me.firstNameTag = $("#first_name");
	me.lastNameTag = $("#last_name");
	me.motherNameTag = $("#mother_name");
	me.birthDistrictTag = $("#birth_district");
	me.dobTag = $("#date_of_birth");
	
	
	// Search clients RESULT FORM
	me.searchResultFormTag = $("#confirmation_screen");
	me.searchResultTag = me.searchResultFormTag.find(".popup_body");
	me.searchTotalResultTag = $("#search_total_result_msg");
	me.createVoucherEventYesBtnTag = me.searchResultFormTag.find(".popup_foot_left");
	me.createVoucherEventNoBtnTag = me.searchResultFormTag.find(".popup_foot_right");
	
	
	// Search client message FORM
	me.confirmMessageFormTag = $("#confirmation_message_form");
	me.confirmMessageTag = $("#search_confirm_msg");
	me.confirmMessageYesBtnTag = $("#confirmation_message_ok_btn");
	

	// Ask to add new Client Participant if no search result ( use for Client Info search )
    me.confirmNoClientMsgForm = $("#confirmation_client_no_result_message_form");
    me.confirmNoClientMsgInfoTag = $("#confirmation_client_no_result_msg");
    me.confirmNoClientMsgOkBtnTag = $("#confirmation_client_no_result_message_ok_btn");
    me.confirmNoClientMsgCancelBtnTag = $("#confirmation_client_no_result_message_cancel_btn");
    
	        
    
	// Session Information
	me.activeEventListTableTag = $("#table_sessions");
	
	me.init = function()
	{
		me.setupEvents();
	};
	
	me.setData = function( _eventId )
	{
        me.checkPasswordDialogFormTag.css('display', 'none');
        Utils.setHashToUrl( Commons.PAGE_REGISTRATION_VIEW_1 );
		me.eventId = _eventId;
		me.clientSearchList = [];
		me.processingCliendIdx = -1;
	};
	
	me.setupEvents = function()
	{
		// ---------------------------------------------------------------------
		// Header Icons
		
		// Back to Session Screen
	    me.backToSessionFormBtnTag.click( function (e) {
	        e.preventDefault();
	        // Commons.blockscreen();
	        me.passwordTag.val(""); 
	        me.checkPinErrorMsgTag.css("display", "none");
	        me.checkPasswordDialogFormTag.css('display', 'block');
	        me.passwordTag.focus();
	    });
		
	    
	    // ---------------------------------------------------------------------
		// PIN tag
		
		me.checkPinYesBtnTag.click( function (e) {
	    	e.preventDefault();
	    	// Commons.blockscreen();
			me.checkPassword();
	    });
	
	    me.checkPinNoBtnTag.click( function (e) {
	    	e.preventDefault();
	        Commons.unblockscreen();
	    	me.checkPasswordDialogFormTag.css('display', 'none');
	    	Utils.setHashToUrl( Commons.PAGE_REGISTRATION_VIEW_1 );
	    });
	    

	    // ---------------------------------------------------------------------
		// Switch view mode
	    
		me.switchViewModeBtnTag.click( function (e) {
	        e.preventDefault();
	        Commons.unblockscreen();
	        Commons.showMainDiv( Commons.registrationView2 );
	    });
	    

//	    $(document).on('click', '#header_32', function (e) {
//	        e.preventDefault();
//	        $(location).attr('href', 'registration_mode.html');
//	    });
		
	    // ---------------------------------------------------------------------
	    // Search by Voucher FORM
		
		// Show Voucher search form
	    me.showSearchVoucherFormBtnTag.click( function () {
	    	Commons.blockscreen();
	    	me.searchResultFormTag.css('display', 'none');
	    	me.searchVoucherForm.find('.errorMsg').remove();
			
	        me.voucherCodeTag.val("");
	        me.searchVoucherForm.css('display', 'block');
	        me.voucherCodeTag.focus();
	    });
	    
	    // Search by Voucher
	    me.searchByVoucherBtnTag.click( function(e){
	    	e.preventDefault();
	    	Commons.blockscreen();
	    	me.searchResultFormTag.attr("seachedBy", "voucher");
	    	me.findTEIByVoucher();
	    });
	    
	    // Cancel searching by voucher
	    me.cancelSearchByVoucherBtnTag.click( function (e) {
	    	e.preventDefault();
	    	Commons.unblockscreen();
	    	me.searchVoucherForm.css('display', 'none');
	    });
	    
	    
		// ---------------------------------------------------------------------
		// Search by Mobile FORM

	    // Show Mobile search form
		me.showSearchMobileFormBtnTag.click( function (e) {
	        e.preventDefault();
	    	Commons.blockscreen();
	        me.mobileNumberTag.val("");
	        me.searchMobileForm.css('display', 'block');
	    	me.searchMobileForm.find('.errorMsg').remove();
	        
	        me.mobileNumberTag.focus();
	    });

		// Search by Mobile
		me.searchByMobileBtnTag.click( function (e) {
			e.preventDefault();
	    	Commons.blockscreen();
	    	me.searchResultFormTag.attr( "seachedBy", "mobile" );
	    	
	    	me.findTEIByPhoneNumber();
	    });

	    // Cancel searching by voucher
		me.cancelSearchByMobileBtnTag.click( function (e) {
			e.preventDefault();
	    	Commons.unblockscreen();
			me.searchMobileForm.css('display', 'none');
	    });
		
		
		// ---------------------------------------------------------------------
		// Search by Client FORM
		
		me.dobTag.attr("min", "1900-01-01" );
		me.dobTag.attr("max", "2007-12-31" );
		
		// Show Search Form
		me.showSearchClientFormBtnTag.click( function (e) {
	        e.preventDefault();
	    	Commons.blockscreen();
	    	
	        me.firstNameTag.val("");
	        me.lastNameTag.val("");
	        me.motherNameTag.val("");
	        me.birthDistrictTag.val("");
	        me.dobTag.val("");
	        
	        me.searchByClientForm.css('display', 'block');
	        me.searchByClientForm.css('height', '380px');
	        me.searchByClientForm.find(".popup_body").css('height', '280px');
	    	me.searchByClientForm.find('.errorMsg').remove();
	        me.firstNameTag.focus();
	    });

		// Search clients
		me.searchByClientBtnTag.click( function (e) {
			e.preventDefault();
	    	Commons.blockscreen();
			me.searchResultFormTag.attr( "seachedBy", "clientInfo" );
			
			me.findTEIByClientInfo();
	    });
		
		// Cancel Searching
		me.cancelSearchByClientBtnTag.click( function (e) {
			e.preventDefault();
	    	Commons.unblockscreen();
			me.searchByClientForm.css('display', 'none');
	    });
		
		
		// ---------------------------------------------------------------------
		// No result after searching Clients by Client Info FORM
		
		me.confirmNoClientMsgOkBtnTag.click( function(){
			me.createTEIParticipant( "N-WKI" );
		});
		  
	     me.confirmNoClientMsgCancelBtnTag.click( function(){
	    	 Commons.unblockscreen();
	    	 me.confirmNoClientMsgForm.css('display', 'none');
		 });
		    
	
	    // ---------------------------------------------------------------------
	    // Create Transaction Event by VOUCHER
	    
	    me.createVoucherEventYesBtnTag.click( function(e){
	    	e.preventDefault();
	    	var searchBy = me.searchResultFormTag.attr( "seachedBy" );
    		var teiId = me.searchResultTag.find("#teiId").val();
			if( searchBy == "voucher" )
    		{
    			me.createEvent( teiId, "R-VOU" );
    		}
    		else if( searchBy == "mobile" )
    		{
    			me.createEvent( teiId, "R-PHO" );
    		}
    		else if( searchBy == "clientInfo" )
    		{
    			me.createEvent( teiId, "R-SCH" );
    		}
	    });
	    
		me.createVoucherEventNoBtnTag.click( function(e){
			e.preventDefault();
	    	Commons.unblockscreen();
	    	
	    	var searchBy = me.searchResultFormTag.attr( "seachedBy" );
	    	if( searchBy == "voucher"  )
    		{
    			Commons.unblockscreen();
    			me.searchResultFormTag.css("display", "none");

    			me.confirmMessageFormTag.find(".popup_body").css("height", "45px");
    			me.confirmMessageFormTag.css("height", "130px");
    			var message = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_pleaseTryAgain" );
    			me.confirmMessageTag.html( message );
    			me.confirmMessageFormTag.css("display", "block");
    			
    		}
    		else if( searchBy == "mobile" || searchBy == "clientInfo" )
    		{
    			if( me.processingCliendIdx == me.clientSearchList.length )
    			{
	    			me.searchResultFormTag.css("display", "none");
	    			
	    			Commons.unblockscreen();
	    			
	    			me.confirmMessageFormTag.find(".popup_body").css("height", "45px");
	    			me.confirmMessageFormTag.css("height", "130px");
	    			var message = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_pleaseTryAgain" );
	    			me.confirmMessageTag.html( message );
	    			me.confirmMessageFormTag.css("display", "block");
    			}
    			else
    			{
    				me.populateNextClient();
    			}
    		}
	    	
	    });

		
//		// View MODE 2
//	    $('.selector').hover(function () {
//	        $(this).addClass('hover');
//	    }, function () {
//	        $(this).removeClass('hover');
//	    });
	    

	    // ---------------------------------------------------------------------
	    // Search result message
		
		me.confirmMessageYesBtnTag.click( function(){
			
			me.confirmMessageFormTag.css("display", "none");
			var searchBy = me.searchResultFormTag.attr( "seachedBy" );
			
	    	if( searchBy == "voucher"  )
    		{
	    		me.showSearchVoucherFormBtnTag.click();
    		}
	    	else if( searchBy == "mobile"  )
    		{
	    		me.showSearchMobileFormBtnTag.click();
    		}
	    	else if( searchBy == "clientInfo" )
	    	{
	    		me.showSearchClientFormBtnTag.click();
	    	}
		});
		
	}
	
	// -------------------------------------------------------------------------
	// 
	
	me.checkPassword = function( )
	{
		me.checkPasswordDialogFormTag.find('.errorMsg').remove();
		me.checkPinErrorMsgTag.hide();
		
		if( me.validationObj.checkFormEntryTagsData( me.checkPasswordDialogFormTag ) )
		{
			Commons.runAjax( function(){
				$.ajax(
				{
					type: "POST"
					,url: "user/checkPassword"
					,headers: {
				        'pwd': me.passwordTag.val()
				    }
					,dataType: "json"
		            ,contentType: "application/json;charset=utf-8"
	    			,beforeSend: function( xhr ) {
	    				var message = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_checkingPin" );
	    				MsgManager.appBlock( message + " ..." );
	    			}
					,success: function( response ) 
					{
						if( response.msg == "success")
						{
							Utils.setHashToUrl( Commons.PAGE_SESSION_INFORMATION );
							Commons.showMainDiv( Commons.sessionInfoDivTag );
							resizeForm();
							me.checkPasswordDialogFormTag.hide();
						}
						else
						{
							me.checkPinErrorMsgTag.show();
						}
					}
				}).always( function( data ) {
					Commons.unblockscreen();
					MsgManager.appUnblock();
				});
			});
		}
	};


	me.findTEIByVoucher = function()
	{
		me.searchVoucherForm.find('.errorMsg').remove();
		me.searchTotalResultTag.hide();
		
		if( me.validationObj.checkFormEntryTagsData( me.searchVoucherForm ) )
		{
			Commons.runAjax( function(){
				$.ajax(
				{
					type: "POST"
					,url: "client/searchByVoucher?voucherCode=" + me.voucherCodeTag.val()
					,dataType: "json"
		            ,contentType: "application/json;charset=utf-8"
	    			,beforeSend: function( xhr ) {
	    				var message = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_searchingClients" );
	    				MsgManager.appBlock( message + " ..." );
	    			}
					,success: function( response ) 
					{
						var clientData = response.relationships;
						if( clientData === undefined )
						{
							me.searchVoucherForm.css('display', 'none');

							var message1 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_voucherNotFound" );
							var message2 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_pleaseTryAgain" );
							
							me.confirmMessageFormTag.find(".popup_body").css("height", "45px");
			    			me.confirmMessageFormTag.css("height", "130px");
			    			me.confirmMessageTag.html( message1 + " " + me.voucherCodeTag.val() + ".\n " + message2 + ".");
			    			me.confirmMessageFormTag.css("display", "block");
						}
						else
						{
							clientData = clientData[0];
							var clientId = clientData.trackedEntityInstanceB;
		    				var attrValues = clientData.relative.attributes;
							var clientName = me.getAttrValue( attrValues, "nR9d9xZ5TRJ" ) + " " + me.getAttrValue( attrValues, "RsvOTmR2DjO" ).charAt(0);
							var dob = me.getAttrValue( attrValues, "wSp6Q7QDMsk" );
							if( dob !== "" )
						    {
								dob = ", " + Utils.formatDate_DisplayDate( response.created );
						    }


							var message1 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_voucher" );
							var message2 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_isRegisteredTo" );
							var message = message1 + " " + me.voucherCodeTag.val() + " " + message2 + " " + clientName + dob;
							
							me.searchResultTag.find("#teiId").val( clientId );
							me.searchResultTag.find("#teiId").attr( "clientName", clientName );
							me.searchResultTag.find("#p_first_and_last_name").html( message );
				            
					        me.searchVoucherForm.css('display', 'none');
					        me.searchResultFormTag.css("display", "block");
						}
						
					}
				}).always( function( data ) {
					MsgManager.appUnblock();
				});
			});
		}
		
	}
	
	me.findTEIByPhoneNumber = function()
	{
		me.searchMobileForm.find('.errorMsg').remove();
		me.searchTotalResultTag.hide();
		
		if( me.validationObj.checkFormEntryTagsData( me.searchMobileForm ) )
		{
			var phoneNumber = me.mobileNumberTag.attr("altval");
			
			Commons.runAjax( function(){
				$.ajax(
				{
					type: "POST"
					,url: "client/searchByPhoneNumber?phoneNumber=" + phoneNumber
					,dataType: "json"
		            ,contentType: "application/json;charset=utf-8"
	            	,beforeSend: function( xhr ) {
	            		var message = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_searchingClients" );
	        			MsgManager.appBlock( message+ " ..." );
	    			}
					,success: function( response ) 
					{
						me.searchMobileForm.css('display', 'none');
						me.searchTotalResultTag.hide();
						var clientList = response.rows;
						if( clientList.length == 0 )
						{
							var message1 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_notFoundMobile" );
							var message2 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_pleaseTryAgain" );
							
					        me.searchMobileForm.css('display', 'none');
							

							me.confirmMessageFormTag.find(".popup_body").css("height", "45px");
			    			me.confirmMessageFormTag.css("height", "130px");
			    			me.confirmMessageTag.html( message1 + " " + me.mobileNumberTag.val() + ".\n " + message2 + ".");
							me.confirmMessageFormTag.css("display", "block");
						}
						else
						{
							me.clientSearchList = response;
							me.processingCliendIdx = -1;
							me.populateNextClient();

					        me.searchResultFormTag.css("display", "block");
						}
					},
					error: function(a,b,c)
					{
						me.searchMobileForm.css('display', 'none');
						alert("Searching Error.")
					}
				}).always( function( data ) {
					Commons.unblockscreen();
					MsgManager.appUnblock();
				});
			});
		}
		
	};
	
	me.findTEIByClientInfo = function()
	{
		me.searchByClientForm.find('.errorMsg').remove();
        me.searchByClientForm.css('height', '380px');
        me.searchByClientForm.find(".popup_body").css('height', '280px');
        
		if( me.validationObj.checkFormEntryTagsData( me.searchByClientForm ) )
		{
			var data = {};
			data.firstName = me.firstNameTag.val();
			data.lastName = me.lastNameTag.val();
			data.motherName = me.motherNameTag.val();
			data.birthDistrict = me.birthDistrictTag.val();
			data.dob = me.dobTag.val();
			
			
			Commons.runAjax( function(){
				$.ajax(
				{
					type: "POST"
					,url: "client/searchByClientInfo"
					,dataType: "json"
					,data: JSON.stringify( data )
		            ,contentType: "application/json;charset=utf-8"
	            	,beforeSend: function( xhr ) {
	            		var message = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_searchingClients" );
	        			MsgManager.appBlock( message + " ...");
	    			}
					,success: function( response ) 
					{
						me.searchByClientForm.css('display', 'none');
						var clientList = response.rows;
						if( clientList.length == 0 )
						{ 
							var message = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_notFoundClientInfo" );
					        var msg = message + " ";
					        msg += "<br> - " + me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_firstName" ) + " : <b>" + data.firstName + "</b>";
					        msg += "<br> - " + me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_lastName" ) + " : <b>" + data.lastName + "</b>";
					        msg += "<br> - " + me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_motherName" ) + " : <b>" + data.motherName + "</b>";
					        msg += "<br> - " + me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_birthDistrict" ) + " : <b>" + data.birthDistrict + "</b>";
					        msg += "<br> - " + me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_birthDate" ) + " : <b>" + data.dob + "</b>";
					        msg += "<br><br>" + me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_confirmRegisterNewParticipant" ) + " ?"
							
							me.confirmNoClientMsgInfoTag.html( msg );
							me.confirmNoClientMsgForm.css("display", "block");
						}
						else
						{
							me.clientSearchList = response;
							me.processingCliendIdx = -1;
							me.populateNextClient();

					        me.searchResultFormTag.css("display", "block");
						}
					},
					error: function(a,b,c)
					{
						Commons.unblockscreen();
						me.searchByClientForm.css('display', 'none');
						alert("Searching Error.")
					}
				}).always( function( data ) {
					MsgManager.appUnblock();
				});
			});
		}
		else
		{

	        me.searchByClientForm.css('height', '470px');
	        me.searchByClientForm.find(".popup_body").css('height', '380px');
		}
	};
	
	me.createTEIParticipant = function( checkIn )
	{
		if( me.validationObj.checkFormEntryTagsData( me.searchByClientForm ) )
		{
			var data = {};
			data.firstName = me.firstNameTag.val();
			data.lastName = me.lastNameTag.val();
			data.motherName = me.motherNameTag.val();
			data.birthDistrict = me.birthDistrictTag.val();
			data.dob = me.dobTag.val();
			data.gender = 'F';
			data.age = Utils.calculateAge(data.dob);
			
			data.event = {};
			data.event.eventId =  me.eventId;
			data.event.checkIn = checkIn;
			
			Commons.runAjax( function(){
				$.ajax(
				{
					type: "POST"
					,url: "client/createParticipant"
					,dataType: "json"
					,data: JSON.stringify( data )
		            ,contentType: "application/json;charset=utf-8"
	            	,beforeSend: function( xhr ) {
	            		var message = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_registeringParticipant" );
	        			MsgManager.appBlock( message + " ..." );
	    			}
					,success: function( response ) 
					{
						// Update PAX value of selected Event
					    me.setPAXValue( true );
					    
						me.confirmNoClientMsgForm.css("display", "none");
						
						Commons.unblockscreen();
						MsgManager.appUnblock();
						
						var message1 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_thanks" );
						var message2 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_forRegisteringToday" );
						var message3 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_session" );
						var message4 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_participantRegistered" );
						var locationStr = Commons.registrationView1.find("[name='event_details_title']").html().split(", ")[0];
						var clientName = me.firstNameTag.val() + ", " + me.lastNameTag.val().charAt(0); 
						var message = message1 + " " + clientName + " " + message2 + " " + locationStr + " " + message3 + ".\n" + message4;
						
						me.confirmMessageFormTag.find(".popup_body").css("height", "65px");
		    			me.confirmMessageFormTag.css("height", "150px");
		    			me.searchResultFormTag.attr( "seachedBy", "thankInfo" );
		    			me.confirmMessageTag.html( message );
		    			me.confirmMessageFormTag.css("display", "block");
						
					},
					error: function(a,b,c)
					{
						me.searchMobileForm.css('display', 'none');
						alert("Searching Error.");
						
						Commons.unblockscreen();
						MsgManager.appUnblock();
					}
				});
			});
		}
	};
	
	// -------------------------------------------------------------------------
	
	me.populateNextClient = function()
	{
		me.processingCliendIdx++;
		
		if( me.processingCliendIdx < me.clientSearchList.rows.length )
		{
			// Update the Client index information ( 1 of 10 )
			if( me.clientSearchList.rows.length > 1 )
			{
				var index = me.processingCliendIdx + 1;
				me.searchTotalResultTag.html( index + " of " + me.clientSearchList.rows.length );
				me.searchTotalResultTag.show();
			}
			else
			{
				me.searchTotalResultTag.hide();
			}
			
			// Show next Client
			var clientData = me.clientSearchList.rows[me.processingCliendIdx];
			var metaData = me.clientSearchList.headers;
			var clientId = clientData[0];
			
			var clientName = me.getAttrValueByArr( metaData, clientData, "nR9d9xZ5TRJ" ) + " " + me.getAttrValueByArr( metaData, clientData, "RsvOTmR2DjO" ).charAt(0);
			var dob = me.getAttrValueByArr( metaData, clientData, "wSp6Q7QDMsk" );
			if( dob != "" )
			{
				dob = ", " + Utils.formatDate_DisplayDate( dob );
			}
	
			var message = "";
			var searchBy = me.searchResultFormTag.attr( "seachedBy" );
	    	if( searchBy == "mobile" )
	    	{
				var message1 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_mobile" );
				var message2 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_isRegisteredTo" );
	    		message = message1 + " " + me.mobileNumberTag.val() + " " + message2 + " " + clientName + dob;
	    	}
			else if( searchBy == "clientInfo" )
			{
				message = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_foundClient" ) + " " + clientName + dob;
			}
	    	
			me.searchResultTag.find("#teiId").val( clientId );
			me.searchResultTag.find("#teiId").attr( "clientName", clientName );
			
			me.searchResultTag.find("#p_first_and_last_name").html( message );
		}
		else
		{
			me.searchResultFormTag.css("display", "none");
			

			me.confirmMessageFormTag.find(".popup_body").css("height", "45px");
			me.confirmMessageFormTag.css("height", "130px");
			var message = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_pleaseTryAgain" );
			me.confirmMessageTag.html( message );
			me.confirmMessageFormTag.css("display", "block");
		}
	};
	
	me.getAttrValueByArr = function( metaData, clientData, attrId )
	{
		for( var i in metaData )
		{
			var headerData = metaData[i];
			if( headerData.name == attrId )
			{
				idx = i;
				return clientData[i];
			}
		}
		
		return "";
	};
	
	me.createEvent = function( teiId, checkIn )
	{
		
		// STEP 1. Create Event JSON Data
		var data = {};
        
		data.eventId =  me.eventId;
		data.teiId = teiId;
		data.checkIn = checkIn;
		
		// STEP 2. Create Event
		Commons.runAjax( function(){
			$.ajax(
			{
				type: "POST"
				,url: "event/createParticipant"
				,dataType: "json"
	            ,contentType: "application/json;charset=utf-8"
	            ,data: JSON.stringify( data )
	            ,beforeSend: function( xhr ) {
	            	var message = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_registrationParticipant" );
	        		MsgManager.appBlock( message + " ...");
				}
				,success: function( response ) 
				{
					// Update PAX value of selected Event
				    me.setPAXValue( true );
					 
					me.searchResultFormTag.css("display", "none");
					
			    	Commons.unblockscreen();
					MsgManager.appUnblock();
					
					var message1 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_thanks" );
					var message2 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_forRegisteringToday" );
					var message3 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_session" );
					var message4 = me.translationObj.getTranslatedValueByKey( "registrationMode1_msg_participantRegistered" );
					var locationStr = Commons.registrationView1.find("[name='event_details_title']").html().split(", ")[0];
					var clientName = me.searchResultTag.find("#teiId").attr( "clientName" ); 
					var message = message1 + " " + clientName + " " + message2 + " " + locationStr + " " + message3 + ".\n" + message4;


					me.confirmMessageFormTag.find(".popup_body").css("height", "65px");
	    			me.confirmMessageFormTag.css("height", "150px");
	    			me.searchResultFormTag.attr( "seachedBy", "thankInfo" );
	    			me.confirmMessageTag.html( message );
	    			me.confirmMessageFormTag.css("display", "block");
				},
				error: function(a,b,c)
				{
			    	Commons.unblockscreen();
					MsgManager.appUnblock();
				}
			});
		});
	};
	
	me.setPAXValue = function( isIncreaseVal )
	{
		var title = Commons.eventDetailsTitleTag.html();
		var eventId = Commons.eventParticipantDivTag.attr("eventId");;
		var arrTitles = ( title.split(" - ")[0] ).split(", "); 
		var paxValue = eval( Commons.sessionInfoDivTag.find("tr[eventId='" + eventId + "']").attr("pax") );
		if( isIncreaseVal )
		{
			paxValue++;
		}
		else
		{
			paxValue--;
		}
		
		me.setPAXValueInTitle( paxValue );
	}
	
	me.setPAXValueInTitle = function( paxValue )
	{
		var title = Commons.eventDetailsTitleTag.html();
		var eventId = Commons.eventParticipantDivTag.attr("eventId");
		var eventDate = title.substring( title.lastIndexOf("-") + 2, title.length );
		var arrInfo = title.substring(0, title.lastIndexOf("-") - 1 ).split(", ");
		
		
		title = arrInfo[0] + ", " + arrInfo[1] + ", " + paxValue + " PAX" + " - " + eventDate ;
		Commons.eventDetailsTitleTag.html( title );
		Commons.sessionInfoDivTag.find("tr[eventId='" + eventId + "']").attr( "pax", paxValue );
		Commons.sessionInfoDivTag.find("tr[eventId='" + eventId + "']").find("td:nth-child(2)").html( title );
	}
	
	
	
	me.populateHeaderInfo = function( eventDetails )
	{
		// STEP 1. Populate event details in header
		var eventType = "";
		var location = "";
		var participants = "";
		var daughterNo = "";
		
		var eventDate = Utils.formatDate_DisplayDate( eventDetails.eventDate );
		
		var dataValues = eventDetails.dataValues;
		for( var i in dataValues )
		{
			var deId = dataValues[i].dataElement;
			var value = dataValues[i].value;
			if( deId == Commons.DEID_A360_EventType )
			{
				eventType = Commons.eventType[value];
			}
			else if( deId == Commons.DEID_A360_Location )
			{
				location = value;
			}
			else if( deId == Commons.DEID_A360_Participants )
			{
				participants = value;
			}
		}
		
		var eventDataStr = location + ", " + eventType + ", " + participants + " PAX";
		
		me.headerTag.attr( "eventId", eventDetails.event );
		me.headerTag.html( eventDataStr + " - " + Utils.formatDate_DisplayDate( eventDetails.eventDate ) );
		
	};
	
	me.getAttrValue = function( attrValues, attrId )
	{
		for( var i in attrValues )
		{
			var attrValue = attrValues[i];
			if( attrValue.attribute == attrId )
			{
				return attrValue.value;
			}
		}
		
		return "";
	};
	
	
	// -------------------------------------------------------------------------
	// RUN init method
	
	me.init();
}