


function Translation( baseURL, storageObj )
{
	var me = this;	
	me.baseURL = baseURL;
	me.storageObj = storageObj;
	
	me.KEY_LANGUAGE = "a360tz_lang";
	me.KEY_VERSION = "a360tz_version";
	me.KEY_VERSION_WITH_OPTION = "a360tz_versionWithOption";
	

	me.languageSelectorTag = $("#log_language");

//	me.translationStatusImg_loadingTag = $("#translationStatusImg_loading");
//	me.translationStatusImg_checkedTag = $("#translationStatusImg_checked");
//	me.translationStatusImg_downloadTag = $("#translationStatusImg_download");
//	me.translationStatusImgTags = $( "img.checkingImages" );
	
	me.lang = "en";
	me.version = "";
	me.autoPush = false;

//	me._TRANSLATE_STATUS_LOADING = "loading";
//	me._TRANSLATE_STATUS_CHECKED = "checked";
//	me._TRANSLATE_STATUS_DOWNLOAD = "download";

	
	me.translatedKeyWords = {};
	
	me.init = function()
	{
		// STEP 1. Get the language which was choice before in local storage
		var configLang = me.storageObj.getData( me.KEY_LANGUAGE );
		if( configLang !== "" && configLang !== "null" ){
			me.lang = configLang;
		}
		me.languageSelectorTag.val( me.lang );
		
		// STEP 2. Set up events for language selector
		me.setup_Events();
	};
	
	me.setup_Events = function()
	{
		me.languageSelectorTag.change( function(event){
			event.preventDefault();
			me.translatePageByLang( me.languageSelectorTag.val() );
		});
	};

	me.translatePageByLang = function( lang )
	{
		me.lang = lang;
		me.translatePage();
		me.storageObj.addData( me.KEY_LANGUAGE, me.lang );		
	}
	
	me.translatePage = function( exeFunc )
	{
		// If the language is not loaded already, load them.		
		if( me.translatedKeyWords[me.lang] !== undefined )
		{
			me.translate();
			if( exeFunc !== undefined ) exeFunc();
		}
		else
		{
			me.getKeywordsFromStorage( function(){
				me.translate();
				if( exeFunc !== undefined ) exeFunc();
			})
		}
	};
	
	me.translateTag = function( tag, exeFunc )
	{
		if( me.translatedKeyWords[me.lang] !== undefined )
		{
			me.covertKeywordTextAndTranslate( tag );
			if( exeFunc !== undefined ) exeFunc();
		}
		else
		{
			me.getKeywordsFromStorage( function(){
				me.covertKeywordTextAndTranslate( tag );
				if( exeFunc !== undefined ) exeFunc();
			})
		}		
	};
	

	me.translate = function( tag )
	{
		var translatedTags = $.find("[keyword]");
		if( tag !== undefined )
		{
			translatedTags = tag.find("[keyword]");
		}
		
		for( var i in translatedTags ){
			var key = $(translatedTags[i]).attr("keyword");
			var value = me.getTranslatedValueByKey( key );
			$(translatedTags[i]).html( value );
		};
		
		me.translatePlaceholderKeywords();
		//console.log('translation');
	};

	me.translatePlaceholderKeywords = function()
	{
		var translatedTags = $.find("[placeholderKey]");
		
		for( var i in translatedTags ){
			var key = $(translatedTags[i]).attr("placeholderKey");
			var value = me.getTranslatedValueByKey( key );
			$(translatedTags[i]).attr( "placeholder", value );
		};
		
		//console.log('translation');
	};
	
	
	
	me.covertKeywordTextAndTranslate = function( tag ){
		me.translatePage(function(){
			var list = me.translatedKeyWords[me.lang];
			var html = tag.html();
			for( var i in list )
			{
				var key = i;
				var value = list[i];
				if( html !== undefined && html.indexOf( key ) >= 0 )
				{
					value = ( value !== "" ) ? value : key; 
					html = html.split(key).join("<span keyword='" + key + "'>" + value + "</span>");
				}
			}
			tag.html(html);
		});
	};
	
	me.getTranslatedValueByKey = function( key )
	{
		var value = me.translatedKeyWords[me.lang][key];
		if( value !== undefined )
		{
			return value;
		}

		return key;
	};
	
	me.getTranslatedSpanStrByKey = function( key )
	{
		return '<span keyword="' + key + '">' + me.getTranslatedValueByKey( key ) + '</span>';		
	};
	
	me.getKeywordsFromStorage = function( exeFunc )
	{ 
		var storedLangkey = "lang_" + me.lang;
		if( me.storageObj.getData( storedLangkey ) !== "" )
		{
			var storedList = JSON.parse( me.storageObj.getData( storedLangkey ) );
			me.translatedKeyWords[me.lang] = storedList.list;
			
			exeFunc();
		}
		else
		{
			me.loadKeywords( exeFunc );
		}
		
	};
	
	me.loadKeywords = function( exeFunc )
	{
		var storedLangkey = "lang_" + me.lang;
		var url = "translation/keywordList?lang=" + me.lang;
		
		Commons.ajaxGetRequests.push( 
			$.ajax(
			{
				type: "POST"
				,url: url
				,dataType: "json"
	            ,contentType: "application/json;charset=utf-8"
				,success: function( response ) 
				{
					me.removeBadKeys( response );
					
					me.storageObj.addData( storedLangkey, JSON.stringify( response ) );
					me.translatedKeyWords[me.lang] = response.list;					
					
					//me.translationStatusImg_checkedTag.show();
					exeFunc();
				}
				,error: function() 
				{
					exeFunc();
				}
			}).always( function( data ) {
//				me.translationStatusImg_checkedTag.show();
			})			
		);
	};
	
	me.removeBadKeys = function( response )
	{
		if ( response && response.list )
		{
			if ( response.list[ 'voucher' ] ) delete response.list[ 'voucher' ];
		}
	};

	
	me.loadProjectDetails = function( option, exeFunc )
	{ 	
		if ( option === undefined )
		{
			console.log( '-- translation retrieval skipped' );
			exeFunc();
		}
		else if ( option === "getTranslation" )
		{
			var url = "translation/version";		
					
			$.ajax({
				type: "POST"
				,url: url
				,dataType: "json"
	            ,contentType: "application/json;charset=utf-8"
				,success: function( response ) 
				{
//					var searchedItem = "v0.012 [push-always]";
					var searchedItem = response.list[me.KEY_LANGUAGE];
					if( searchedItem !== undefined )
					{
						var versionFullText = searchedItem;
						var value = versionFullText.split(" ");
						var version = value[0];
						var pushCase = ( value[1] === "[push]" ) ? true : false;
						var alwaysPush = ( value[1] === "[push-always]" ) ? true : false;
						
						var existingVersion = me.storageObj.getData( me.KEY_VERSION );
						
						// In beginning to open the app, or in case of always push
						if( alwaysPush || existingVersion === "" )
						{							
							me.loadKeywords( function() {

								me.storageObj.addData( me.KEY_VERSION, version );
								me.storageObj.addData( me.KEY_VERSION_WITH_OPTION, versionFullText );
	
								exeFunc();
							} );							
						}
						// If the version on server is different from the browser storage
						else if( existingVersion != version )
						{			
							if( pushCase )
							{					
								// Load keywords again
								me.loadKeywords( function() {

									me.storageObj.addData( me.KEY_VERSION, version );
									me.storageObj.addData( me.KEY_VERSION_WITH_OPTION, versionFullText );
									
									exeFunc();
								} );
							}
							else
							{
								// update available case..	
								exeFunc();
							}							
						}
						else
						{
							// same version case
							
							exeFunc();
						}
					}
					else
					{
						console.log( '-- A360 translation version infomation not found!' );

						exeFunc();
					}
				}
				,error: function() 
				{			
					console.log( '-- Translation retrieval error occurred!' );

					exeFunc();
				}
			});
		}
	};	
	
	// -----------------------------------------------------------------------
	// RUN Init method
	// -----------------------------------------------------------------------
	
	me.init();
}
