
// -- Quick Loading Message Util Class/Methods
// -------------------------------------------

function FormBlock() {}

FormBlock.block = function( block, msg, cssSetting, tag )
{
	var msgAndStyle = { message: msg, css: cssSetting };

	if ( tag === undefined )
	{
		if ( block ) $.blockUI( msgAndStyle );
		else $.unblockUI();
	}
	else
	{
		if ( block ) tag.block( msgAndStyle );
		else tag.unblock();
	}
}



// -------------------------------------
// -- Static Classes - Message Manager Class

function MsgManager() {}


// --- App block/unblock ---
MsgManager.cssBlock_Body = { 
	border: 'none'
	,padding: '15px'
	,backgroundColor: '#000'
	,'-webkit-border-radius': '10px'
	,'-moz-border-radius': '10px'
	,opacity: .5
	,color: '#fff'
	,width: '200px'
};

MsgManager.appBlock = function( msg )
{
	if ( !Utils.checkValue( msg ) ) msg = "Processing..";

	FormBlock.block( true, msg, MsgManager.cssBlock_Body );
}

MsgManager.appUnblock = function()
{
	FormBlock.block( false );
}


// -- End of Message Manager Class
// -------------------------------------
