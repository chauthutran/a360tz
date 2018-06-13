$(function () {
	
	/* $( document ).ready( function() 
	{
		new A360TZApp( "../", function( translationObj ) {
			new LoginForm();
		}, "getTranslation");
	}); */
	
	
//	$(document).ready(function(){
//		new LoginForm();
//	});
	
});

function LoginForm( _translationObj, _storageObj )
{
	var me = this;
	me.translationObj = _translationObj;
	me.storageObj = _storageObj;
	me.validationObj = new Validation( _translationObj );
	
	me.loginFormTag = $("#loginForm");
	me.userNameTag = $("#log_username");
	me.passwordTag = $("#log_password");
	me.messageTag = $("#log_message");
	me.loginBtnTag =  $("#btn_log");
	
	
	me.spanCurrentDateTag = $("#spanCurrentDate");
	me.spanCurrentVersionTag = $("#spanCurrentVersion");
	
	me.init = function()
	{
		me.clear();
		
		me.userNameTag.focus();
		
		me.storageObj.removeData( Commons.CURRENT_PAGE );
		me.storageObj.removeData( Commons.EVENTID );

		me.spanCurrentDateTag.html( Commons.BUILD_DATE );
		me.spanCurrentVersionTag.html( Commons.VERSION );
		
		me.setupEvents();
	};
	
	me.setupEvents = function()
	{
		me.loginBtnTag.click( function(){
			me.login();
		});
		
		
		me.userNameTag.change( function( e ){
			me.messageTag.html("");
		});
		
		me.userNameTag.keypress( function( e ){
			var key = window.event ? event.keyCode : event.which;
			if (e.which == 13) // Enter key press
			{
				me.login();
			}
		});
		
		
		me.passwordTag.change( function(){
			me.messageTag.html("");
			
		});
		
		// Allow to enter number only
		me.passwordTag.keypress( function( e ){
			var key = window.event ? event.keyCode : event.which;
			if (e.which == 13) // Enter key press
			{
				me.login();
			}
			else if (event.keyCode === 8 || event.keyCode === 46) {
		        return true;
		    } else if ( key < 48 || key > 57 ) {
		        return false;
		    } else {
		        return true;
		    }
		});
		
		
	};
	
	me.clear = function()
	{
		$.get( "clearSession" );
	};
	
	me.login = function()
	{
		if( me.validationObj.checkFormEntryTagsData( me.loginFormTag ) )
		{
			MsgManager.appBlock("Logging ...");
			
			$.ajax(
				{
					type: "POST"
					,url: "login"
					,dataType: "json"
					,headers: {
				        'usr': me.userNameTag.val()
				        ,'pwd': me.passwordTag.val()
				    }
		            ,contentType: "application/json;charset=utf-8"
					,success: function( response ) 
					{
						if( response.status == "successed" )
						{
							window.location.href = "session_information.html#" + Commons.PAGE_SESSION_INFORMATION;
						}
						else 
						{
							if( response.status == "notInGroup" )
							{
								me.messageTag.html("Your user is not authorized as a A360 facilitator - Please contact your system administrator");
								me.userNameTag.focus();
								MsgManager.appUnblock();
							}
							else if( response.status == "notInProgram" )
							{
								me.messageTag.html("Your user is not assigned to the TZ - A360 Sessions - Please contact your system administrator");
								me.userNameTag.focus();
								MsgManager.appUnblock();
							}
							else
							{
								me.messageTag.html("User Name or PIN incorrect");
								me.userNameTag.focus();
								MsgManager.appUnblock();
							}
						}
					},
					error: function(a,b,c)
					{
						me.messageTag.html("User Name or PIN incorrect");
						MsgManager.appUnblock();
					}
				});
		}
	};
	
	// -------------------------------------------------------------------------
	
	me.init();
}