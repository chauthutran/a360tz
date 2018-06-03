
function A360TZApp( baseUrl, exeFunc, option )
{
	var me = this;
	me.exeFunc = exeFunc;
	
	me.init = function()
	{	
		MsgManager.appBlock( "Loading translation...", true );

		
		var storageObj = new Storage();
		var translationObj = new Translation( baseUrl, storageObj );
		
		translationObj.getKeywordsFromStorage( function(){
			translationObj.loadProjectDetails( option, function(){
				translationObj.translatePage( function(){
					MsgManager.appUnblock();
					if( me.exeFunc !== undefined ) me.exeFunc( translationObj, storageObj );
				});
			});
		});
	};
	
	
	// -----------------------------------------------------------------------
	// RUN Init method
	// -----------------------------------------------------------------------
	
	me.init();
}