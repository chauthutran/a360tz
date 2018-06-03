

function Event( _translationObj, _storageObj )
{
	var me = this;
	me.translationObj = _translationObj;
	me.validationObj = new Validation( _translationObj );
	me.lockEventObj = new LockEvent( _translationObj );
	me.storageObj = _storageObj;
    me.registrationMode;
    me.eventParticipant;
	
    
	// -------------------------------------------------------------------------
	// Session Information
	
	me.activeEventListTableTag = $("#table_sessions");
	me.noActiveEventMsgTag = $("#no_active_event_msg");
	
	me.closedSessionHeaderTag = $("#closed_session_btn");
	me.closedSessionTitleTag = $("#closed_session_title");
	me.closedSessionIconTag = $("#closed_session_icon");
	me.closedEventListTbTag = $("#closed_event_list")
	me.closedEventListTbodyTag = me.closedEventListTbTag.find("tbody");
	
	me.showEventFormBtnTag = $("#add_new_event_btn");
	me.addEventFormTag = $("#add_event_form");
	
	// Event DE INPUT tags
	me.createEventFormTag = me.addEventFormTag.find(".popup_body");
	me.eventDateTag = $("#event_date");
	
	
	me.addEventBtnTag = $("#add_event_btn");
	me.cancelEventBtnTag = $("#cancel_add_event_btn");
	
	// Session
	me.moveToLoginPageBtnTag = $("#move_to_login_page_btn");
	
	// Footer data
	
	me.orgUnitCodeTag = $("#orgunit_code");
	me.orgUnitNameTag = $("#orgunit_name");
	me.logoutBtnTag = $("#logout_btn");
    	 
	
	// -------------------------------------------------------------------------
	// INIT methods
	
	me.init = function()
	{ 
		var sessionTimeOutPicker = new SessionTimeOutPicker( me );
		sessionTimeOutPicker.checkSessionTimeOut();
		
		me.registrationMode = new RegistrationMode( me );
	    me.eventParticipant = new EventParticipant( me );
	    
	    me.storageObj.addData( Commons.PREVIOUS_KEY_PAGE, Commons.PAGE_LOGN );
	    
		$('input[type=text]').css({
		    'font-size': '100%',
		    'padding': '5px',
		    'border': '1px solid #bdbdbd',
		    'width': '100%',
		    'border-radius': '2px',
		    'box-sizing': 'border-box'
		});
		
		me.lockEventObj.loadProgramDetails( function(){
			me.getEventList();
			
			me.setupEvents();
			
			me.setup_ButtonsOnBrowser();

	        Utils.setHashToUrl( Commons.PAGE_SESSION_INFORMATION );
	       
		});
	}
	
	me.setupEvents = function()
	{
		// ---------------------------------------------------------------------
		// Session events
		
		me.moveToLoginPageBtnTag.click(function(){
			window.location.href = "index.html";
		});
		
		// ---------------------------------------------------------------------
		// Footer events
		
		me.logoutBtnTag.click( function(){
			window.location.href = "index.html";
		});
		
		
		me.cancelEventBtnTag.click( function (e) {
			$('.popup').css('display', 'none');
		});
		
//		    $(document).on('click', '.popup_foot_right_d', function (e) {
//		        $('.dialog').css('display', 'none');
//		        $('.popup').css('display', 'block');
//		    });


		me.closedSessionHeaderTag.click( function (e) {
	        e.preventDefault();
	        me.closedEventListTbTag.css("display");
	        if ( me.closedEventListTbTag.css("display") == 'none') {
	        	me.closedEventListTbTag.show();
	        	me.closedSessionIconTag.attr("src", "img/expand.svg");
	        } else {
	        	me.closedEventListTbTag.hide();
	        	me.closedSessionIconTag.attr("src", "img/contract.svg");
	        }
	    });
		    
		me.showEventFormBtnTag.click( function(e){
			
			
			if( me.activeEventListTableTag.find("tr").length >= 1 )
			{
				var message = me.translationObj.getTranslatedValueByKey( "sessionInfor_msg_confirmCompleteAllEvent" );
				alert( message );
			}
			else
			{
				me.showAddNewEventForm();
			}
		});
		
		me.addEventBtnTag.click( function(){
			me.createEvent();
		});
		
		
		var validDateRange = me.lockEventObj.getValidEventDateRange();
		me.eventDateTag.attr("min", Utils.convertDate_ObjToDbStr( validDateRange.startDate ) );
		me.eventDateTag.attr("max", Utils.convertDate_ObjToDbStr( validDateRange.endDate ) );
		
	};
	
	
	me.setup_ButtonsOnBrowser = function()
	{
		// Refresh page
		if (performance.navigation.type == 1) {
			var urlHash = location.hash.replace("#", "");
			
			// Save data for refreshings
			me.storageObj.addData( Commons.CURRENT_PAGE, urlHash );
			if( urlHash == Commons.PAGE_EVENT_PARTICIPANT_LIST 
					|| urlHash == Commons.PAGE_REGISTRATION_VIEW_1
					|| urlHash == Commons.PAGE_REGISTRATION_VIEW_2 )
			{
				me.storageObj.addData( Commons.CURRENT_PAGE, urlHash );
			}
			
			Utils.setHashToUrl( urlHash );
		}
		
		window.onhashchange = function(e) {
		  
		   var oldURL = e.oldURL.split('#')[1];
		   var newURL = e.newURL.split('#')[1];

		   if( newURL == oldURL )
		   {
			   
		   }
		  else if( newURL == Commons.PAGE_SESSION_INFORMATION )
		  {
			  if( oldURL == Commons.PAGE_SESSION_INFORMATION )
			  {
				  window.location.href = "index.html";
			  }
			  else if( oldURL == Commons.PAGE_REGISTRATION_VIEW_1 )
			  {
				  me.registrationMode.backToSessionFormBtnTag.click();
			  }  
			  else
			  {
				 Commons.showMainDiv( Commons.sessionInfoDivTag );
			  }
		  }
		  else if( newURL == Commons.PAGE_EVENT_PARTICIPANT_LIST  )
		  {
			  if( oldURL == Commons.PAGE_SESSION_INFORMATION )
			  {
				  Commons.showMainDiv( Commons.sessionInfoDivTag );
				  if( Commons.eventParticipantDivTag.attr("eventId") != undefined 
						  && Commons.eventParticipantDivTag.attr("eventId") != "" )
				  {
					  Commons.showMainDiv( Commons.eventParticipantDivTag );
				  }
				  else
				  {
					  Utils.setHashToUrl( Commons.PAGE_SESSION_INFORMATION );
					  Commons.showMainDiv( Commons.sessionInfoDivTag );
				  }
			  }
			  else if( oldURL == Commons.PAGE_REGISTRATION_VIEW_1 )
			  {
				  me.registrationMode.backToSessionFormBtnTag.click();
			  }
			  else
			  {
				  Commons.showMainDiv( Commons.eventParticipantDivTag );
			  }
		  }
		  else if( newURL == Commons.PAGE_REGISTRATION_VIEW_1 )
		  {
			  if( oldURL == Commons.PAGE_SESSION_INFORMATION )
			  {
				  Utils.setHashToUrl( Commons.PAGE_SESSION_INFORMATION );
			  }
			  else
			  {
				  Commons.showMainDiv( Commons.registrationView1 );
			  }
//			  if( oldURL == Commons.PAGE_EVENT_PARTICIPANT_LIST )
//			  {
//				  Commons.showMainDiv( Commons.eventParticipantDivTag );
//			  }
//			  else
//			  {
//				  Commons.showMainDiv( Commons.registrationView1 );
//			  }
		  }
		  
		 
		  e.preventDefault();

		  return false;
		}
		
	};
	
	me.loadCurPage = function()
	{
		var curPage = me.storageObj.getData( Commons.CURRENT_PAGE );
		
		if( curPage == Commons.PAGE_EVENT_PARTICIPANT_LIST 
				|| curPage == Commons.PAGE_REGISTRATION_VIEW_1 )
		{
			var eventId = me.storageObj.getData( Commons.EVENTID );
			var rowTag = Commons.sessionInfoDivTag.find("tr[eventId='" + eventId + "']");
			if( rowTag.length > 0 )
			{
				rowTag.find("td:first").click();
			}
		}
		
	}
	
	
	// -------------------------------------------------------------------------
	// 
	
	me.showAddNewEventForm = function()
	{
		me.addEventFormTag.find("span.errorMsg").remove();
		
		me.createEventFormTag.find("input,select").val("");
		
		me.eventDateTag.val( Utils.getTodayStr() );
        
        me.addEventFormTag.css({
          'display': 'block'
        });
        
	}
	
	
	// -------------------------------------------------------------------------
	// Get and populate data
	
	me.getEventList = function()
	{
		Commons.runAjax( function(){
			$.ajax(
			{
				type: "POST"
				,url: "event/eventList"
				,dataType: "json"
	            ,contentType: "application/json;charset=utf-8"
        		,beforeSend: function( xhr ) {
        			
        			var message = me.translationObj.getTranslatedValueByKey( "sessionInfor_msg_loadingEventList" );
        			MsgManager.appBlock(message + " ...");
        			
        			me.activeEventListTableTag.html("");
        			me.closedEventListTbodyTag.html("");
        		}
				,success: function( response ) 
				{
//					// Detroy sortable functionality in table
//					$.tablesorter.destroy( me.closedEventListTbodyTag, false, function() {} );
					
					// Login information
					me.orgUnitCodeTag.html( response.orgUnit.code );
					me.orgUnitNameTag.html( response.orgUnit.name );
					
					// Event List
					
					var eventList = response.list.events;
					for( var i in eventList )
					{
						me.populateDataInRow( eventList[i] );
					}
					
					if( me.activeEventListTableTag.find("tr").length == 0 )
					{
//						me.activeEventListTableTag.closest("table").hide();
						me.noActiveEventMsgTag.show();
					}
					else
					{
//						me.activeEventListTableTag.closest("table").show();
						me.noActiveEventMsgTag.hide();
					}
					
					me.closedEventListTbTag.hide();
					
					me.loadCurPage();
					
//					// Update data in $table for sortable functionality
//					me.closedEventListTbodyTag.trigger("update"); 	
//					
//					// Apply sortable function for table
//					Utils.tableSorter( me.closedEventListTbodyTag );
					
				}
			})
			.always( function( data ) {
				MsgManager.appUnblock();
			});
		});
	};
	
	me.populateDataInRow = function( eventData )
	{
		var eventType = "";
		var location = "";
		var participants = "";
		var daughterNo = "";
		
		var eventDate = Utils.formatDate_DisplayDate( eventData.eventDate );
		
		var dataValues = eventData.dataValues;
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
		
		var rowTag = $("<tr class='selector pointer' eventId='" + eventData.event + "' eventData='" + JSON.stringify( eventData ) + "' pax='" + participants + "'></tr>");
		rowTag.append("<td>" + eventDate + "</td>");
		rowTag.append("<td>" + eventDataStr + "</td>");
		
		if( eventData.status == "ACTIVE" )
		{
			me.activeEventListTableTag.append( rowTag );
		}
		else
		{
			me.closedEventListTbodyTag.append( rowTag );
		}
		
		me.setUp_EventRow( rowTag );
	};
	
	me.setUp_EventRow = function( rowTag )
	{
		rowTag.find("td").click( function (e) {
	       // e.preventDefault();
			Commons.showMainDiv( Commons.eventParticipantDivTag );
	        var height = $(window).height();
			var width = $(window).width();
			resizeForm( height, width ); // Call from screenPage.js
		
	        var eventData = rowTag.attr("eventData"); 
	        var eventTitle = rowTag.find("td:nth-child(2)").html();
	        me.eventParticipant.setData( eventData, eventTitle );
	        
	    });
	}
	
	me.completedAllActiveEvents = function()
	{
		var eventRowTags = me.activeEventListTableTag.find("tr");
		me.totalEvent = eventRowTags.length;
		me.processing = 0;
		eventRowTags.each( function(){
			var eventData = JSON.parse( $(this).attr("eventData") );
			var eventId = eventData.event;
			me.completeEvent( eventId, function(){
				me.processing++;
				
				if( me.totalEvent == me.processing )
				{
					me.noActiveEventMsgTag.show();
					me.showAddNewEventForm();
					
					MsgManager.appUnblock();
				}
			} );
		});
		
	};
	
	
	// -------------------------------------------------------------------------
	// Event methods
	
	me.completeEvent = function( eventId, execFunc )
	{
		var eventRowTag = me.activeEventListTableTag.find("tr[eventId='" + eventId + "']");
		Commons.runAjax( function(){
			$.ajax(
			{
				type: "POST"
				,url: "event/complete?eventId=" + eventId
				,dataType: "json"
	            ,contentType: "application/json;charset=utf-8"
	           // ,async: false
            	,beforeSend: function( xhr ) {
            		var message = me.translationObj.getTranslatedValueByKey( "sessionInfor_msg_completingEvent" );
            		MsgManager.appBlock( message + " ..." );
        		}
				,success: function( response ) 
				{
					var eventRowTag = Commons.sessionInfoDivTag.find("tr[eventId='" + eventId + "']");
					var rowTag = eventRowTag.clone();
					me.closedEventListTbodyTag.prepend( eventRowTag.clone() );
					eventRowTag.remove();
					
					me.setUp_EventRow( rowTag );
				
					if( execFunc !== undefined ) execFunc();
				}
			}); 
		}).always( function( data ) {
			MsgManager.appUnblock();
		});;
	};
	
	me.createEvent = function( eventData )
	{
		if( me.validationObj.checkFormEntryTagsData( me.createEventFormTag ) )
		{
			// STEP 1. Create Event JSON Data
			var eventData = {};
			eventData.eventDate = me.eventDateTag.val();
			eventData.dataValues = me.getJSONData( me.createEventFormTag );
			eventData.dataValues[eventData.dataValues.length] = {
				"dataElement" : Commons.DEID_A360_Participants
				,"value" : "0"
			};
			
			// STEP 2. Create Event
			Commons.runAjax( function(){
				$.ajax(
					{
						type: "POST"
						,url: "event/create"
						,dataType: "json"
			            ,contentType: "application/json;charset=utf-8"
			            ,data: JSON.stringify( eventData )
			            ,beforeSend: function( xhr ) {
			            	var message = me.translationObj.getTranslatedValueByKey( "sessionInfor_msg_creatingEvent" );
			    			MsgManager.appBlock( message + " ..." );
			    		}
						,success: function( response ) 
						{
							me.populateDataInRow( response );
							me.noActiveEventMsgTag.hide();
							
							me.eventParticipant.setPAXValue( true );
							
							$('.popup').css('display', 'none');
						},
						error: function(a,b,c)
						{
							MsgManager.appUnblock();
						}
					}).always( function( data ) {
						MsgManager.appUnblock();
					});
			});
			
		}
		else
		{
			$('.popup').css({
		        'display': 'block'
		    });
		}
	};
	
	
	// -------------------------------------------------------------------------
	// Get JSON data
	
	me.getJSONData = function( formTag )
	{
		var dataValues = [];
		formTag.find("input[deId],select[deId]").each( function(){
			var dataValue = {};
			dataValue.dataElement = $(this).attr("deId");
			dataValue.value = $(this).val();
			
			dataValues.push( dataValue );
		});
		
		return dataValues;
	};
	
	
	// -------------------------------------------------------------------------
	// RUN init method
	
	me.init();
}