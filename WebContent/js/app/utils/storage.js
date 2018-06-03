
function Storage()
{
	var me = this;
	
	me.addData = function( key, value )
	{
		me.removeData( key );
		if (typeof(Storage) !== "undefined") { // if (typeof value === "object") {
		    localStorage.setItem( key, value );
		    console.log("The selected language is saved.");
		} else {
		   alert( "Sorry, your browser does not support Web Storage..." );
		}
	};
	
	me.getData = function( key )
	{
		var value = localStorage.getItem( key );
		return ( value === null || value === "null" ) ? "" : value;
	};
	
	me.removeData = function( key )
	{
		sessionStorage.removeItem( key );
		localStorage.removeItem( key );
	}
}
