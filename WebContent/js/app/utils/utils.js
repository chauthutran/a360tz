

function Utils() {};


Utils.disableTag = function( tag, isDisable )
{
	tag.prop( 'disabled', isDisable);
	
	for( var i=0; i<tag.length; i++ )
	{
		var element = $(tag[i]);
		if( element.prop( "tagName" ) == 'SELECT' || element.prop( "tagName" ) == 'INPUT' || element.prop( "tagName" ) == 'BUTTON' )
		{
			if( isDisable )
			{
				element.css( 'background-color', '#FAFAFA' ).css( 'cursor', 'auto' );
				if( element.prop( "tagName" ) == 'BUTTON' && element.find("span").length > 0  )
				{
					element.find("span").css( 'color', 'gray' );
				}
				else
				{
					element.css( 'color', 'gray' );
				}
			}
			else
			{
				element.css( 'background-color', 'white' ).css( 'cursor', '' ).css( 'color', '' );
				if( element.prop( "tagName" ) == 'BUTTON' && element.find("span").length > 0  )
				{
					element.find("span").css( 'color', '' );
				}
			}
		}
	}
};

// ------------------------------------------------------------------------------------
// Check Variable Related

Utils.checkValue = function( input ) {

	if ( Utils.checkDefined( input ) && input.length > 0 ) return true;
	else return false;
};

Utils.checkDefined = function( input ) {

	if( input !== undefined && input != null ) return true;
	else return false;
};

Utils.trim = function( input )
{
	return input.replace( /^\s+|\s+$/gm, '' );
};

Utils.startsWith = function( fullVal, val )
{
	return ( fullVal.indexOf( val ) == 0 );
};

Utils.isNumberDigit = function( val )
{
	var patt = new RegExp("^[0-9]*$");
    return patt.test(val);
}

//-------------------------------------------------------------------
//Date Utils


Utils.MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
Utils.DAYS = ["Sunday", "Monday", "Tuesday", "Webnesday", "Thursday", "Friday", "Saturday"];
Utils.MONTH_INDEXES = {"Jan" : "01", "Feb" : "02", "Mar" : "03", "Apr" : "04", "May" : "05", "Jun" : "06", "Jul" : "07", "Aug" : "08", "Sep" : "09", "Oct" : "10", "Nov" : "11", "Dec" : "12"};

Utils.convertDate_StrToObj = function( dateStr ) {
	var year = dateStr.substring( 0, 4 );
	var month = eval( dateStr.substring( 5,7 ) ) - 1;
	var day = eval( dateStr.substring( 8, 10 ) );
	
	var hour = "00";
	var minute = "00";
	var second = "00";
	if( dateStr.length > 10 )
	{
		hour = dateStr.substring( 11, 13);
		minute = dateStr.substring( 14, 16 );
		second = dateStr.substring( 17, 19 );
	}

	var date = new Date( year, month, day, hour, minute, second );
	
	return date;
};


Utils.convertDate_ObjToDbStr = function( dateObj ) {
	
	var year = dateObj.getFullYear();
	
	var month = dateObj.getMonth() + 1;
	month = ( month < 10 ) ? "0" + month : "" + month;
	
	var dayInMonth = dateObj.getDate();
	dayInMonth = ( dayInMonth < 10 ) ? "0" + dayInMonth : dayInMonth;
	
	return year + "-" + month + "-" + dayInMonth;
};

///** 
// * dataStr : MM/dd/yyyy
// * Return : yyyy-MM-dd
// */
//Utils.convertDate_InputStrToDbStr = function( dateStr ) {
//	var arrDate = dateStr.split("/")
//	
//	return arrDate[2] + "-" + arrDate[0] + "-" + arrDate[1];
//};

/** 
 * Convert date from UTC time to local time
 * dateStr : A UTC time date string ( 2017-01-02 )
 * Result : 02 Jan 2017 ( local time )
 * **/
Utils.formatDate_DisplayDateObject = function( date )
{
	var year = date.getFullYear();
	var month = date.getMonth()
	var dayInMonth = date.getDate();
	dayInMonth = ( dayInMonth < 10 ) ? "0" + dayInMonth : dayInMonth;
	
	return dayInMonth + " " + Utils.MONTHS[month] + " " + year;
};


/** 
 * Convert date from UTC time to local time
 * dateStr : A UTC time date string ( 2017-01-02 )
 * Result : 02 Jan 2017 ( local time )
 * **/
Utils.formatDate_DisplayDate = function( dateStr )
{
	var date = Utils.convertDate_StrToObj( dateStr );
	
	var year = date.getFullYear();
	var month = date.getMonth()
	var dayInMonth = date.getDate();
	dayInMonth = ( dayInMonth < 10 ) ? "0" + dayInMonth : dayInMonth;
	
	return dayInMonth + " " + Utils.MONTHS[month] + " " + year;
};

// Return yyy-mm-dd
Utils.getTodayStr = function( )
{
	var date = new Date();
	
	var year = date.getFullYear();
	
	var month = date.getMonth() + 1;
	month = ( month < 10 ) ? "0" + month : "" + month;
	
	var dayInMonth = date.getDate();
	dayInMonth = ( dayInMonth < 10 ) ? "0" + dayInMonth : dayInMonth;
	
	return year + "-" + month + "-" + dayInMonth;
};


//-------------------------------------------------------------------
//Utils URL

Utils.getURLParameterByName = function( url, name )
{
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(url);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

Utils.setHashToUrl = function( hashName )
{
	// location.href = location.href.split("#")[0] + "#" + hashName;
	document.location.hash = "#" + hashName;
};


//-------------------------------------------------------------------
// Table


Utils.tableSorter = function( table, sortList )
{
	if(sortList==undefined) sortList = [[0,0]];
	
	table.tablesorter(); 
	
	if( table.find("tbody").children().size() > 0 )
	{
		table.trigger("sorton",[sortList]);
	}
};


Utils.calculateAge = function( birthDateStr )
{
	var today = new Date();
    var birthDate = new Date( birthDateStr );
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if ( m < 0 || ( m === 0 && today.getDate() < birthDate.getDate() ) ) 
    {
        age--;
    }
    return age;
};

