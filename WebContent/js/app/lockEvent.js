

function LockEvent()
{
	var me = this;
	
	me.PERIOD_TYPE_LAST_12_MONTHS = "last12Months_MONTH";
	me.PERIOD_TYPE_THIS_YEAR_MONTH = "thisYearMonths_MONTH";
	me.PERIOD_TYPE_LAST_12_WEEKS = "last12Weeks_WEEK";
	me.PERIOD_TYPE_LAST_12_QUARTERS = "last12Quarters_QUARTER";

	me.EVENT_STATUS_EXPIRED = "expired";
	me.EVENT_STATUS_LOCK = "locked";
	me.EVENT_STATUS_OPEN = "open";
	
	me.expiryPeriodType;
	me.expiryDays;
	me.completeEventsExpiryDays;
	
	
	me.loadProgramDetails = function( exeFunc )
	{
		Commons.runAjax( function(){
			$.ajax(
			{
				type: "POST"
				,url: "event/programDetails"
				,dataType: "json"
	            ,contentType: "application/json;charset=utf-8"
				,success: function( response ) 
				{
					me.expiryPeriodType = response.expiryPeriodType;
					me.expiryDays = response.expiryDays;
					me.completeEventsExpiryDays = response.completeEventsExpiryDays;
					
					if( exeFunc !== undefined ) exeFunc();
				},
				error: function(a,b,c)
				{
					// console.log("Error in init of LockEvent.js");
				}
			});
		});
	};
	
	// -------------------------------------------------------------------------
	// Check an event is locked
	
	me.checkEventLocked = function( event )
	{
		var todayStr = me.formatDateObj_YYYYMMDD( new Date() );
		var eventDate = Utils.convertDate_StrToObj( event.eventDate );
		var dateStr = me.formatDateObj_YYYYMMDD( eventDate );
			
		if( me.expiryPeriodType !== "undefined" && me.expiryPeriodType !== "" && event.status == "ACTIVE" )
		{
			var expiredDateRange = me.calExpiredDateRange( new Date() );
			var validMinDateStr = me.formatDateObj_YYYYMMDD( expiredDateRange.validMinDate );
			var expiredDateStr = me.formatDateObj_YYYYMMDD( expiredDateRange.expiredDate );
			
			if( dateStr <= todayStr && validMinDateStr <= dateStr && dateStr <= expiredDateStr )
			{
				return me.checkCompletedEventExpired( event, me.completeEventsExpiryDays, true );
				
			}
			else
			{
				return me.EVENT_STATUS_EXPIRED;
			}
		}
		else
		{
			return me.checkCompletedEventExpired( event );
		}
		
	};
	
	me.checkCompletedEventExpired = function( event )
	{
		if( event.status == "COMPLETED" )
		{		
			if( me.completeEventsExpiryDays !== "undefined" )
			{
				me.completeEventsExpiryDays = eval( me.completeEventsExpiryDays );
				var todayStr = me.formatDateObj_YYYYMMDD( new Date() );
				
				var checkedCompletedEventDate = Utils.convertDate_StrToObj( event.completedDate );
				checkedCompletedEventDate.setDate( checkedCompletedEventDate.getDate() + me.completeEventsExpiryDays );
				var checkedCompletedEventDateStr = me.formatDateObj_YYYYMMDD( checkedCompletedEventDate );

				if ( checkedCompletedEventDateStr >= todayStr )
				{
					return me.EVENT_STATUS_OPEN;
				}
				else
				{
					return me.EVENT_STATUS_LOCK;
				}
			}
			else
			{
				return me.EVENT_STATUS_OPEN; 
			}
		}
		
		return me.EVENT_STATUS_OPEN;
		
	};
	
	me.formatDateObj_YYYYMMDD = function( date )
	{
		var year = date.getFullYear();
		
		var month = date.getMonth() + 1;
		month = ( month < 10 ) ? "0" + month : month;
		
		var date = date.getDate();
		date = ( date < 10 ) ? "0" + date : date;
		
		return "" + year + month + date;
	};
	
	
	// -------------------------------------------------------------------------
	// Create an Valid date range for event date

	me.getValidEventDateRange = function()
	{
		var today = new Date();
	
		if( me.expiryPeriodType !== "undefined" && me.expiryPeriodType !== "" )
		{	
			// Setup expiredDate and expiredDate based today
			var todayExpiredDateRange = me.calExpiredDateRange( today, me.expiryPeriodType, me.expiryDays );
			
			return {
				"startDate": todayExpiredDateRange.validMinDate
				,"endDate": today
			}
		}
		else
		{
			var startDate = new Date();
			startDate.setFullYear( startDate.getFullYear() - 100 );
			
			return {
				"startDate": startDate
				,"endDate": today
			}
		}
	};
  
	
	me.calExpiredDateRange = function( startPeriodDate )
	{
		var expiredDate = me.calExpiredDate( startPeriodDate, me.expiryPeriodType, me.expiryDays );
		var startDate = new Date();
		startDate.setFullYear(startDate.getFullYear() - 100 );
		
		if( me.expiryPeriodType !== "undefined" && me.expiryPeriodType !== "" )
		{
			startDate = me.calStartDateByEventDateAndPeriodType( startPeriodDate, expiredDate, me.expiryPeriodType, me.expiryDays ); 
		}
		
		return {
				"expiredDate" : expiredDate
				,"validMinDate" : startDate
			}
	};
	
	me.calExpiredDate = function( startPeriodDate )
	{
		var expiredDate = new Date( startPeriodDate );
		
		if( me.expiryPeriodType !== "undefined" && me.expiryPeriodType != "" )
		{
			if( me.expiryPeriodType == "Monthly" )
			{
				expiredDate.setMonth( expiredDate.getMonth() + 1 );
				expiredDate.setDate( 1 );
			}
			else if( me.expiryPeriodType == "Weekly" )
			{
				var firstDays = expiredDate.getDate() - expiredDate.getDay() + 1; // First day is the day of the month - the day of the week
				expiredDate.setDate( firstDays + 7 );
			}
			else if( me.expiryPeriodType == "Quarterly" )
			{
				var quarter = Math.floor((expiredDate.getMonth() + 3) / 3);
				
				if (quarter == 4) {
					expiredDate = new Date (expiredDate.getFullYear() + 1, 1, 1);
				} else {
					expiredDate = new Date (expiredDate.getFullYear(), quarter * 3, 1);
				}
				expiredDate.setDate( 1 );
			}
			else if( me.expiryPeriodType == "Yearly" )
			{
				expiredDate.setFullYear( expiredDate.getFullYear() + 1 );
				expiredDate.setMonth( 0 );
				expiredDate.setDate( 1 );
			}
			else if( me.expiryPeriodType == "BiMonthly" )
			{
				var month = expiredDate.getMonth() + 1;
				month = ( month % 2 == 0 ) ? 1 : 2;
				expiredDate.setMonth( expiredDate.getMonth() + month );
				expiredDate.setDate( 1 );
			}
			else if( me.expiryPeriodType == "SixMonthly" )
			{
				var month = expiredDate.getMonth() + 1;
				if( month >= 7 )
				{
					expiredDate.setFullYear( expiredDate.getFullYear() + 1 );
					expiredDate.setMonth( 0 );
				}
				else
				{
					expiredDate.setMonth( 6 );
				}
				expiredDate.setDate( 1 );
			}
			// April-September 2004
			else if( me.expiryPeriodType == "SixMonthlyApril" )
			{
				var month = expiredDate.getMonth() + 1;
				// Next period : April, This year
				if( month < 4 )
				{
					expiredDate.setMonth( 3 );
				}
				// Next period : Oct, This year
				else if( month >= 4 && month <= 9)
				{
					expiredDate.setMonth( 9 ); 
				}
				// Next period : April, Next year
				else if( month > 9 )
				{
					expiredDate.setFullYear( expiredDate.getFullYear() + 1 );
					expiredDate.setMonth( 3 );
				}
				
				expiredDate.setDate( 1 );
			}
			// Apr 2004-Mar 2005
			else if( me.expiryPeriodType == "FinancialApril" )
			{
				var month = expiredDate.getMonth();
				if( month >= 3 )
				{
					expiredDate.setFullYear( expiredDate.getFullYear() + 1 ); // Next year
				}
				
				expiredDate.setMonth( 3 );// April
				expiredDate.setDate( 1 );
			}
			// July 2004-June 2005
			else if( me.expiryPeriodType == "FinancialJuly" )
			{
				var month = expiredDate.getMonth();
				if( month >= 6 )
				{
					expiredDate.setFullYear( expiredDate.getFullYear() + 1 ); // Next year
				}
				
				expiredDate.setMonth( 6 );// July
				expiredDate.setDate( 1 );
			}
			// Oct 2004-Sep 2005
			else if( me.expiryPeriodType == "FinancialOct" )
			{
				var month = expiredDate.getMonth();
				if( month >= 9 )
				{
					expiredDate.setFullYear( expiredDate.getFullYear() + 1 ); // Next year
				}
				
				expiredDate.setMonth( 9 );// Oct
				expiredDate.setDate( 1 );
			}
			
			// Get one date before expired date
			expiredDate.setDate( expiredDate.getDate() + eval(me.expiryDays) - 1 );
			
		}
		
		return expiredDate;
		
	};
	
	
	me.calStartDateByEventDateAndPeriodType = function( startPeriodDate )
	{
		var startDate;
		
		if( startPeriodDate != undefined && me.expiryPeriodType != undefined && me.expiryPeriodType != "" )
		{
			var startDate = new Date( startPeriodDate );
			startDate.setDate( startDate.getDate() - eval(me.expiryDays) );
			
			if( me.expiryPeriodType == "Daily" )
			{
				
			}
			else if( me.expiryPeriodType == "Monthly" )
			{
				// Get Previous Period
				startDate.setDate( 1 );
			}
			else if( me.expiryPeriodType == "Weekly" )
			{
				if( startDate.getDay() == 0 )
				{
					startDate.setDate( startDate.getDate() - 2 );
				}
				var firstDays = startDate.getDate() - startDate.getDay() + 1;
				startDate.setDate( firstDays );
			}
			else if( me.expiryPeriodType == "Quarterly" )
			{
				var quarter = Math.floor(( startDate.getMonth() ) / 3 );
				startDate = new Date( startDate.getFullYear(), quarter * 3, 1 );
				startDate.setDate( 1 );
			}
			else if( me.expiryPeriodType == "Yearly" )
			{
				startDate.setMonth( 0 );
				startDate.setDate( 1 );
			}
			else if( me.expiryPeriodType == "BiMonthly" )
			{
				// startDate.setMonth( startDate.getMonth() - 2 );
				
				var month = startDate.getMonth();
				month = ( month % 2 == 0 ) ? 0 : 1;
				startDate.setMonth( startDate.getMonth() -  month );
				startDate.setDate( 1 );
			}
			else if( me.expiryPeriodType == "SixMonthly" )
			{
				var month = startDate.getMonth() + 1;
				if( month >= 7 )
				{
					startDate.setMonth( 6 );
				}
				else
				{
					startDate.setMonth( 0 );
				}
				startDate.setDate( 1 );
			}
			// April-September 2017
			else if( me.expiryPeriodType == "SixMonthlyApril" )
			{
				var month = startDate.getMonth() + 1;
				// Oct, Last year
				if( month < 4 )
				{
					startDate.setMonth( 9 );
					startDate.setFullYear( startDate.getFullYear() - 1 );
				}
				// April, This year
				else if( month >= 4 && month <= 9)
				{
					startDate.setMonth( 3 );
				}
				// Oct, This year
				else if( month > 9 )
				{
					startDate.setMonth( 9 );
				}
				
				startDate.setDate( 1 );
			}
			// Apr 2004-Mar 2005
			else if( me.expiryPeriodType == "FinancialApril" )
			{			
				var month = startDate.getMonth();
				if( month < 3 )
				{
					startDate.setFullYear( startDate.getFullYear() - 1 ); // Next year
				}
				
				startDate.setMonth( 3 );// April
				startDate.setDate( 1 );
			}
			// July 2004-June 2005
			else if( me.expiryPeriodType == "FinancialJuly" )
			{				
				var month = startDate.getMonth();
				if( month < 6 )
				{
					startDate.setFullYear( startDate.getFullYear() - 1 ); // Next year
				}
				
				startDate.setMonth( 6 );// July
				startDate.setDate( 1 );
			}
			// Oct 2004-Sep 2005
			else if( me.expiryPeriodType == "FinancialOct" )
			{
				var month = startDate.getMonth() + 1;
				if( month < 10 )
				{
					startDate.setFullYear( startDate.getFullYear() - 1 ); // Next year
				}
				
				startDate.setMonth( 9 );// Oct
				startDate.setDate( 1 );
			}
		}
		
		return startDate;
		
	};
	
}