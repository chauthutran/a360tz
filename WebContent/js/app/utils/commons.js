

function Commons() {}

Commons.VERSION = "v 1.0";
Commons.BUILD_DATE = "Jun 14, 20018";


Commons.CURRENT_PAGE = "curPage";
Commons.PAGE_LOGN = "login";
Commons.PAGE_SESSION_INFORMATION = "sessionInfo";
Commons.PAGE_EVENT_PARTICIPANT_LIST = "eventParticipant";
Commons.PAGE_REGISTRATION_VIEW_1 = "registrationView1";

Commons.EVENTID = "eventId";

Commons.ajaxGetRequests = [];

Commons.eventType = {
	"KM-GC" : "KM - Girls’ Clinic"
	,"KM-ICP" : "KM - In-Clinic Pop-up "
	,"KM-OCP" : "KM - Out-Clinic Pop-up"
	,"KM-PC" : "KM - Parents’ Clinic"
};

Commons.checkIn = {
	"N-WKI" : "New: Walk-In"
	,"R-VOU" : "Ref: Voucher"
    ,"R-PHO" : "Ref: Phone #"
	,"R-SCH" : "Ref: Search"
}


Commons.sessionTimeOut = 60 * 60 * 1000;; // Get from [web.xml] configuration file
Commons.intervalCheckSession = 60000; // 1 minute

Commons.sessionExpiredMsgFormTag = $("#session_expired_msg_form");



// -------------------------------------------------------------------------
// IDs

Commons.DEID_A360_EventType = "PjP2gCDbAmu";
Commons.DEID_A360_Location = "yJH6o6I2gsQ";
Commons.DEID_A360_Participants = "jwVaTNV9nnI";
Commons.DEID_A360_DaughterNo = "Cdc5xGAUuxt";


//-------------------------------------------------------------------------
// Commons methods


Commons.getDEValue = function( dataValues, attrId )
{
	for( var i in dataValues )
	{
		var deId = dataValues[i].dataElement;
		var value = dataValues[i].value;
		if( deId == attrId )
		{
			return value;
		}
	}
	
	return "";
};


//-------------------------------------------------------------------------
// Main Div Tags

Commons.eventHeaderTag = $("#event_header");
Commons.registrationParticipantHeaderTag = $("#registration_participant_header");

Commons.eventDetailsTitleTag = $("[name='event_details_title']");

Commons.mainDivTag = $(".mainDiv");
Commons.sessionInfoDivTag = $("#session_information_div");
Commons.eventParticipantDivTag = $("#event_participant_div");
Commons.registrationView1 = $("#registration_view_1");
Commons.registrationView2 = $("#registration_view_2");

Commons.bodyTag = $("body");
Commons.footerTag = $("#footer");


Commons.showMainDiv = function( divTag )
{
	if( divTag.hasClass("registration_tag"))
	{
		Commons.eventHeaderTag.hide();
		Commons.registrationParticipantHeaderTag.show();

		Commons.bodyTag.removeAttr("class");
		Commons.footerTag.removeClass("bk_pineapple");
		
		Commons.bodyTag.addClass("bk_mint");
		Commons.footerTag.addClass("bk_mint");
	}
	else
	{
		Commons.registrationParticipantHeaderTag.hide();
		Commons.eventHeaderTag.show();
		
		Commons.bodyTag.removeAttr("class");
		Commons.footerTag.removeClass("bk_mint");
		
		Commons.bodyTag.addClass("bk_pineapple");
		Commons.footerTag.addClass("bk_pineapple");
	}
	
	Commons.unblockscreen();
	Commons.mainDivTag.hide();
	divTag.show();
};

//-------------------------------------------------------------------
// Block Form

Commons.blockscreen = function() {
  $(".pointer").css('pointer-events', 'none');
}

Commons.unblockscreen = function() {
	$(".pointer").css('pointer-events', 'auto');
}


//-------------------------------------------------------------------
// Session


Commons.runAjax = function( ajaxFunc ) 
{
	Commons.checkSession( function( isInSession ) {
			if ( isInSession ) {
				ajaxFunc();
			}
			else
			{
				Commons.sessionExpiredMsgFormTag.css("display", "bLock");
			}
		});
			
};

Commons.checkSession = function( returnFunc )
{		
	$.ajax( {
		type: "GET"
		,url: "checkSession"
		,dataType: "json"
        ,contentType: "application/json;charset=utf-8"
		,success: function( response ) 
		{	
			var expired = Commons.checkForSessionExpired( response );
			if( !expired )
			{
				Commons.sessionTimeOut = eval( response.sessionTimeOut ) * 1000; // convert seconds to miliseconds
			}
			
			returnFunc( !expired );
		}
		,error: function(response)
		{
			returnFunc( false );
		}
	});
};

Commons.checkForSessionExpired = function( response )
{
	return ( response && response.msg && response.msg == 'session_expired' );
};

Commons.checkSessionTimeOut = function( returnFunc )
{
	Commons.sessionTimeOut = Commons.sessionTimeOut - Commons.intervalCheckSession;
	var expired = ( Commons.sessionTimeOut <=0 );
	returnFunc( expired, Commons.sessionTimeOut );
};
