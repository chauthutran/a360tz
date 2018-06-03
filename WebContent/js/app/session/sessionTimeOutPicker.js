
function SessionTimeOutPicker()
{
	var me = this;

	
	me.init = function()
	{
//		me.checkSessionTimeOut();
//		if( mainPage != undefined )
//		{
//			me.translationObj = mainPage.translationObj;
//		}
//		
//		me.FormPopupSetup();
//		
//		me.updateSessionTimeout();
	};
	
	
//	me.getTimeRemaining = function()
//	{
//		var t = Commons.sessionTimeOut;
//		 
//		var seconds = Math.floor( (t/1000) % 60 );
//		seconds = ( seconds < 10) ? "0" + seconds : seconds;
//		
//		var minutes = Math.floor( (t/1000/60) % 60 );
//		minutes = ( minutes < 10) ? "0" + minutes : minutes;
//		
//		var hours = Math.floor( (t/(1000*60*60)) % 24 );
//		hours = ( hours < 10) ? "0" + hours : hours;
//		
//		return {
//			'total': t,
//			'hours': hours,
//			'minutes': minutes,
//			'seconds': seconds
//		};
//	};
//	
//	me.updateSessionTimeout = function()
//	{
//		var data = me.getTimeRemaining();
//		me.sessionTimeOutTag.html( data.hours + ":" + data.minutes );
//	};
//	
	me.checkSessionTimeOut = function()
	{
		// Monitor the session expired, run every 5 seconds
		setInterval(function() {
			Commons.checkSessionTimeOut( function( sessionExpired, sessionTimeOut ){
				if( sessionExpired )
				{
					Commons.sessionExpiredMsgFormTag.css("display", "bLock");
				}
			});			
		}, Commons.intervalCheckSession );
		
	};
	
	// -------------------------------------------------------------------------
	// RUN init method
	// -------------------------------------------------------------------------
	
	me.init();
	
}