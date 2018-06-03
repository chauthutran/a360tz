

function EventParticipant( _mainPage )
{
	var me = this;

	me.translationObj = _mainPage.translationObj;
	me.validationObj = _mainPage.validationObj;
	me.registrationMode = _mainPage.registrationMode;
	me.storageObj = _mainPage.storageObj;
	me.lockEventObj = new LockEvent();
	
	me.backToSessionBtnTag = $("#back_to_session");
	me.showRegistrationPageTag = $("#close_registration");
	
	
	me.tableListTag = $("#event_list").find("tbody");
	me.selectedEventStatusTag = $("#selected_event_status");
	me.completedBtnTag = $("#complete_btn");
	
	me.showDeleteAllParticipantDialogBtn = $("#del_event");
	me.deleteAllEventsDialog = $("#delete_all_events_dialog");
	me.deleteAllParticipantBtnTag = $("#delete_event_participant_btn");
	me.closeAllParticipantDialogBtnTag = $("#cancel_delete_event_participant_btn");
	

	me.activeEventListTableTag = $("#table_sessions");
	me.closedEventListTbTag = $("#closed_event_list")
	me.closedEventListTbodyTag = me.closedEventListTbTag.find("tbody");
	
	
	// -------------------------------------------------------------------------
	// INIT method
	
	me.init = function()
	{
		me.setupEvents();
	};

	me.setData = function( _eventData, _eventTitle )
	{
        Utils.setHashToUrl( Commons.PAGE_EVENT_PARTICIPANT_LIST );
        
		me.eventData = JSON.parse( _eventData );
		me.eventId = me.eventData.event;
		me.eventTitle = _eventTitle;

		me.selectedEventStatusTag.removeClass("complete_status");
		me.selectedEventStatusTag.removeClass("active_event_status");
		me.selectedEventStatusTag.removeClass("lock_event_status");
		
		me.lockEventObj.loadProgramDetails( function(){
			
			me.loadEventParticipantList( function(){

		        var curPage = me.storageObj.getData( Commons.CURRENT_PAGE );
				if( curPage == Commons.PAGE_EVENT_PARTICIPANT_LIST )
				{
					me.storageObj.removeData( Commons.CURRENT_PAGE );
					me.storageObj.removeData( Commons.EVENTID );
				}
				else if( curPage == Commons.PAGE_REGISTRATION_VIEW_1 )
				{
			        me.showRegistrationPageTag.click();
			        me.storageObj.removeData( Commons.CURRENT_PAGE );
					me.storageObj.removeData( Commons.EVENTID );
				}

				me.storageObj.addData( Commons.EVENTID, Commons.eventParticipantDivTag.attr("eventId") );
			});
			
			var eventLockedStatus = me.lockEventObj.checkEventLocked( me.eventData );
			Commons.eventParticipantDivTag.attr("locked", eventLockedStatus );
			Commons.eventParticipantDivTag.attr("eventId", me.eventId );
			
	        if( eventLockedStatus == me.lockEventObj.EVENT_STATUS_EXPIRED 
					|| eventLockedStatus == me.lockEventObj.EVENT_STATUS_LOCK 
					||  me.eventData.status == "COMPLETED" )
	        {
	        	me.selectedEventStatusTag.addClass("complete_status");
	        	me.completedBtnTag.hide();
	        }
	        else
	        {
				me.selectedEventStatusTag.addClass("active_event_status");
				me.completedBtnTag.show();
        	}

	        Utils.setHashToUrl( Commons.PAGE_EVENT_PARTICIPANT_LIST );
	        
			me.storageObj.addData( Commons.EVENTID, Commons.eventParticipantDivTag.attr("eventId") );
			
		});
		
	};
	
	me.setupEvents = function()
	{	 
		me.backToSessionBtnTag.click( function (e) {
	        e.preventDefault();
	        Utils.setHashToUrl( Commons.PAGE_SESSION_INFORMATION );
			Commons.showMainDiv( Commons.sessionInfoDivTag );
	    });

		me.completedBtnTag.click( function(e){
	        e.preventDefault();
			me.completeEvent( me.eventId );
		});

		
		me.showDeleteAllParticipantDialogBtn.click( function(e){
	        e.preventDefault();
	        var eventLockedStatus =  Commons.eventParticipantDivTag.attr("locked");
	        if( eventLockedStatus == me.lockEventObj.EVENT_STATUS_EXPIRED 
					|| eventLockedStatus == me.lockEventObj.EVENT_STATUS_LOCK )
	        {
	        	var eventDate = Utils.convertDate_StrToObj( me.eventData.eventDate );
	        	var validRange = me.lockEventObj.calExpiredDateRange( eventDate );
	        	var expiredDate = Utils.formatDate_DisplayDateObject( validRange.expiredDate );
	        	var message = me.translationObj.getTranslatedValueByKey( "eventParticipant_msg_warningExpireSession" ) + " " + expiredDate;
	        	alert( message );
	        }
	        else if( me.eventData.status == "COMPLETED" )
	        {
	        	var message = me.translationObj.getTranslatedValueByKey( "eventParticipant_msg_notAllowToDeleteCompleteSession" )
	        	alert( message );
	        }
	        else
	        {
	        	me.deleteAllEventsDialog.css('display', 'block');
        	}
		});
		

		me.deleteAllParticipantBtnTag.click( function (e) {
	        e.preventDefault();
        	var eventRowTags = me.tableListTag.find("tr");	
			me.totalParticipantEvent = eventRowTags.length;
			me.processing = 0;

			if( eventRowTags.length > 0 )
			{
				eventRowTags.each( function(){
					var eventParticipantId = $(this).attr("eventId");
					me.deleteEvent( eventParticipantId, function(){
						me.processing++;
						if( me.processing == me.totalParticipantEvent )
						{
							me.deleteEvent( me.eventId, function(){
								Commons.sessionInfoDivTag.find("tr[eventId='" + me.eventId + "']").remove();
								Commons.showMainDiv( Commons.sessionInfoDivTag );
								MsgManager.appUnblock();
							});
						}
					} );
				});
			}
			else
			{
				me.deleteEvent( me.eventId, function(){
					Commons.sessionInfoDivTag.find("tr[eventId='" + me.eventId + "']").remove();
					Commons.showMainDiv( Commons.sessionInfoDivTag );
					MsgManager.appUnblock();
				});
			}
			
	    });

		me.closeAllParticipantDialogBtnTag.click( function (e) {
	        e.preventDefault();
	        $('.dialog').css('display', 'none');
	        $('.popup').css('display', 'block');
	    });
		
		me.showRegistrationPageTag.click( function () {
			var eventLockedStatus = Commons.eventParticipantDivTag.attr("locked");
			if( eventLockedStatus == me.lockEventObj.EVENT_STATUS_EXPIRED 
					|| eventLockedStatus == me.lockEventObj.EVENT_STATUS_LOCK 
					|| me.eventData.status == "COMPLETED" )
			{
				// me.showRegistrationPageTag.css('pointer-events', "none" );
			}
			else
			{
		        var eventId = Commons.eventParticipantDivTag.attr("eventId");
		        me.registrationMode.setData( eventId );
		        Commons.showMainDiv( Commons.registrationView1 );
				
				var height = $(window).height();
				var width = $(window).width();
				resizeForm( height, width );
			}

			
	       
	    });
	}
	
	// -------------------------------------------------------------------------
	// 
	
	me.loadEventParticipantList = function( exeFunc )
	{
		var eventId = me.eventData.event;
		var eventDate = me.eventData.eventDate.substring( 0, 10 );
		
		Commons.runAjax( function(){
			$.ajax(
			{
				type: "POST"
				,url: "event/eventParticipants?eventId=" + eventId + "&eventDate=" + eventDate
				,dataType: "json"
	            ,contentType: "application/json;charset=utf-8"
            	,beforeSend: function( xhr ) {
            		var message = me.translationObj.getTranslatedValueByKey( "eventParticipant_msg_loadingParticipantList" );
            		MsgManager.appBlock( message + " ..." );
            		
            		Commons.eventDetailsTitleTag.html("");
            		me.tableListTag.html("");            		
	    		}
				,success: function( response ) 
				{
					me.populateHeaderInfo();
					
					var rows = response.rows;
					for( var i=rows.length - 1; i>=0; i-- )
					{
						me.populateDataInRow( rows[i], i + 1 );
					}
					
					// Check if we need to update PAX value of selected event
					var paxVal = eval( Commons.sessionInfoDivTag.find("tr[event='" + eventId + "']").attr("pax") );
					if( paxVal !== rows.length )
					{
						me.updateEventPAX(eventId, rows.length,function(){
							var title = Commons.eventDetailsTitleTag.html();
							var arrTitles = ( title.split(" - ")[0] ).split(", "); 
							title = arrTitles[0] + ", " + arrTitles[1] + ", " + rows.length + " PAX" + " - " + arrTitles[1];
							Commons.eventDetailsTitleTag.html( title );
							Commons.sessionInfoDivTag.find("tr[event='" + eventId + "']").attr( "pax", rows.length );
							Commons.sessionInfoDivTag.find("tr[event='" + eventId + "']").find("td:nth-child(2)").html( title );
							
							Commons.showMainDiv( Commons.eventParticipantDivTag );
							MsgManager.appUnblock();
						});
					}
					else
					{
						Commons.showMainDiv( Commons.eventParticipantDivTag );
						MsgManager.appUnblock();
					}
					
					if( exeFunc !== undefined ) exeFunc();
			       
				}
			}).always( function( data ) {
				MsgManager.appUnblock();
			});
		});
	};
	
	me.populateHeaderInfo = function()
	{
		var eventDate = me.eventData.eventDate.substring( 0, 10 );
		Commons.eventDetailsTitleTag.html( me.eventTitle + " - " + Utils.formatDate_DisplayDate( eventDate ) );
	};
	
	
	me.populateDataInRow = function( rowData, idx )
	{
		var eventId = rowData[0];
		var birthDate = rowData[3];
		if( birthDate != "" )
		{
			birthDate = ", "+ Utils.calculateAge( birthDate ) + " yrs";
		}
		var col1Val = idx;
		var col2Val = rowData[1] + ", "+ rowData[2].charAt(0) + birthDate;
		var col3Val = Commons.checkIn[rowData[4]];
		
		var rowTag = $("<tr eventId='" + eventId + "'></tr>");
		rowTag.append("<td class='width_ct1_ep'>" + col1Val + "</td>");
		rowTag.append("<td class='width_ct2_ep'>" + col2Val + "</td>");
		rowTag.append("<td class='width_ctck_ep'>" + col3Val + "</td>");
		rowTag.append("<td class='del_line pointer width_ct1_ep'><img src='img/btn_del.svg'></td>");
		rowTag.append("<td class='width_nbsp'></td>");
		
		me.tableListTag.append( rowTag );
		
		me.setUp_EventRow( rowTag );
	};
	
	
	me.setUp_EventRow = function( rowTag )
	{
		rowTag.find("td.del_line").find("img").click( function(){

			var validEventRange = me.lockEventObj.getValidEventDateRange();
	        var eventLockedStatus =  Commons.eventParticipantDivTag.attr("locked");
	        if( eventLockedStatus == me.lockEventObj.EVENT_STATUS_EXPIRED 
					|| eventLockedStatus == me.lockEventObj.EVENT_STATUS_LOCK )
	        {
	        	var eventDate = Utils.convertDate_StrToObj( me.eventData.eventDate );
	        	var validRange = me.lockEventObj.calExpiredDateRange( eventDate );
	        	var expiredDate = Utils.formatDate_DisplayDateObject( validRange.expiredDate );
	        	var message = me.translationObj.getTranslatedValueByKey( "eventParticipant_msg_warningExpireSession" ) + " " + expiredDate;
	        	alert( message );
	        }
	        else if( me.eventData.status == "COMPLETED" )
	        {
	        	var message = me.translationObj.getTranslatedValueByKey( "eventParticipant_msg_notAllowToDeleteCompleteSession" )
	        	alert( message );
	        }
	        else
	        {
				var message = me.translationObj.getTranslatedValueByKey( "eventParticipant_msg_confirmDeleteParticipant" );
				var msg = message + " " + rowTag.find("td:nth-child(2)").html() + " ?";
				
				if( confirm( msg ) )
				{
					var eventParticipantId = rowTag.attr("eventId");
					me.deleteEvent( eventParticipantId, function(){
						
						// Update PAX data value of selected event
						var eventId = Commons.eventParticipantDivTag.attr("eventId");
						me.updateEventPAX( eventId, function(){
							
							me.setPAXValue( false );
							MsgManager.appUnblock();
						} );
					} );
				}
	        }
			
		});
		
	}
	
	// -------------------------------------------------------------------------
	// Event methods
	
	me.completeEvent = function( eventId )
	{
		var msg = me.translationObj.getTranslatedValueByKey( "eventParticipant_msg_confirmCompleteSession" );
		if( confirm( msg ) )
		{
			Commons.runAjax( function(){
				$.ajax(
				{
					type: "POST"
					,url: "event/complete?eventId=" + eventId
					,dataType: "json"
		            ,contentType: "application/json;charset=utf-8"
	            	,beforeSend: function( xhr ) {
	            		var message = me.translationObj.getTranslatedValueByKey( "eventParticipant_msg_completingSession" );
	        			MsgManager.appBlock( message + " ..." );
	        			
	        			
	    			}
		            ,success: function( response ) 
					{
						me.selectedEventStatusTag.removeClass("complete_status");
						me.selectedEventStatusTag.removeClass("active_event_status");
						me.selectedEventStatusTag.addClass("lock_event_status");
						
						var eventRowTag = me.activeEventListTableTag.find("tr[eventId='" + eventId + "']");
						eventRowTag.remove();
						
						var rowTag = eventRowTag.clone();
						var eventData = JSON.parse( rowTag.attr("eventData") );
						eventData.status = "COMPLETED";
						eventData.completedDate = Utils.getTodayStr();
						rowTag.attr("eventData", JSON.stringify( eventData ) );
						me.setUp_Event_A360EventRow( rowTag );
						me.closedEventListTbodyTag.prepend( rowTag );

						me.showRegistrationPageTag.css('pointer-events', "none" );
						
						me.completedBtnTag.hide();
						
					}
				}).always( function( data ) {
					MsgManager.appUnblock();
				});
			});
		}
	};
	

	me.setUp_Event_A360EventRow = function( rowTag )
	{
		rowTag.find("td").click( function (e) {
	        e.preventDefault();
			Commons.showMainDiv( Commons.eventParticipantDivTag );
	        var height = $(window).height();
			var width = $(window).width();
			resizeForm( height, width ); // Call from screenPage.js
		
	        var eventData = rowTag.attr("eventData"); 
	        var eventTitle = rowTag.find("td:nth-child(2)").html();
	        me.setData( eventData, eventTitle );
	        
	    });
	}
	
	me.deleteEvent = function( eventId, execFunc )
	{
		var eventRowTag = me.tableListTag.find("tr[eventId='" + eventId + "']");
		
		Commons.runAjax( function(){
			$.ajax(
			{
				type: "POST"
				,url: "event/delete?eventId=" + eventId
				,dataType: "json"
	            ,contentType: "application/json;charset=utf-8"
        		,beforeSend: function( xhr ) {
        			var message = me.translationObj.getTranslatedValueByKey( "eventParticipant_msg_deletingEvent" );
        			MsgManager.appBlock( message + " ..." );
        		}
				,success: function( response ) 
				{
					eventRowTag.remove();
					
					if( execFunc !== undefined ) execFunc();
					
				}
			}).always( function( data ) {
				MsgManager.appUnblock();
			});
		});
	};
	
	
	me.updateEventPAX = function( eventId, paxVal, exeFunc )
	{
		Commons.runAjax( function(){
			$.ajax(
			{
				type: "POST"
				,url: "event/updatePax?eventId=" + eventId + "&pax=" + paxVal
				,dataType: "json"
	            ,contentType: "application/json;charset=utf-8"
	            ,async: false
	    		,beforeSend: function( xhr ) {
	    			var message = me.translationObj.getTranslatedValueByKey( "eventParticipant_msg_updatingParticipantNumber" );
	    			MsgManager.appBlock( message + " ..." );
	    		}
				,success: function( response ) 
				{
					if( exeFunc !== undefined ) exeFunc();
					
					MsgManager.appUnblock();
				}
			}).always( function( data ) {
				MsgManager.appUnblock();
			});
		});
	};
	
	
	me.setPAXValue = function( isIncreaseVal )
	{
		var title = Commons.eventDetailsTitleTag.html();
		var eventId = Commons.eventParticipantDivTag.attr("eventId");
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
		var arrTitles = ( title.split(" - ")[0] ).split(", ");
		
		title = arrTitles[0] + ", " + arrTitles[1] + ", " + paxValue + " PAX" + " - " + arrTitles[1] ;
		Commons.eventDetailsTitleTag.html( title );
		Commons.sessionInfoDivTag.find("tr[eventId='" + eventId + "']").attr( "pax", paxValue );
		Commons.sessionInfoDivTag.find("tr[eventId='" + eventId + "']").find("td:nth-child(2)").html( title );
	}
	
	
	// -------------------------------------------------------------------------
	// RUN init method
	
	me.init();
}