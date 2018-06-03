
function Validation( _translationObj )
{
	var me = this;
	me.translationObj = _translationObj;
	
	// ================================
	// == Tag Validations
	
	
	me.checkFormEntryTagsData = function( formTag )
	{	
		var allValid = true;

		// If any of the tag is not valid, mark it as invalid.
		formTag.find( "input,select" ).each( function() {
			
			if ( !me.checkValidations( $(this) ) )
			{
				allValid = false;
			}
		});
				
		return allValid;
	};
	

	me.checkValidations = function( tag )
	{	
		// Validation Initial Setting Clear
		tag.attr( 'valid', 'true' );
		var divTag = tag.closest( "div" );
		divTag.find( "span.errorMsg" ).remove();
		
		if ( tag.is( ':visible' ) )
		{		
			me.performValidationCheck( tag, 'mandatory', divTag );
			me.performValidationCheck( tag, 'length', divTag );
			me.performValidationCheck( tag, 'phonenumber', divTag );
			
			
			me.performValidationCheck( tag, 'minlength', divTag );
			me.performValidationCheck( tag, 'exactlength', divTag );
			me.performValidationCheck( tag, 'maxlength', divTag );
			me.performValidationCheck( tag, 'maxvalue', divTag );
			me.performValidationCheck( tag, 'minvalue', divTag );
			me.performValidationCheck( tag, 'number', divTag );
			me.performValidationCheck( tag, 'letter', divTag );
		}

		var valid = ( tag.attr( 'valid' ) == 'true' );
		
		// If not valid, set the background color.
		tag.attr( 'background-color', ( valid ) ? '' : me.COLOR_WARNING );
		
		return valid;
	};
	
	me.performValidationCheck = function( tag, type, divTag )
	{		
		// check the type of validation (if exists in the tag attribute)
		// , and if not valid, set the tag as '"valid"=false' in the attribute
		var valid = true;
		var validationAttr = tag.attr( type );
		var rowTag = tag.closest("tr");
		
		// If the validation attribute is present in the tag
		if ( validationAttr && !rowTag.hasClass("logicHide") )
		{						
			if ( type == 'mandatory' ) valid = me.checkRequiredValue( tag, divTag );
			else if ( type == 'length' ) valid = me.checkValueLen( tag, divTag, "length" );
			else if ( type == 'phonenumber' ) valid = me.checkPhoneNumberValue( tag, divTag );
			
			else if ( type == 'minlength' ) valid = me.checkValueLen( tag, divTag, 'min', Number( validationAttr ) );
			else if ( type == 'maxlength' ) valid = me.checkValueLen( tag, divTag, 'max', Number( validationAttr ) );
			else if ( type == 'exactlength' ) valid = me.checkValueLen( tag, divTag, 'exactlength', Number( validationAttr ) );
			else if ( type == 'maxvalue' ) valid = me.checkValueRange( tag, divTag, 0, Number( validationAttr ) );
			else if ( type == 'number' ) valid = me.checkValueNumber( tag, divTag );
			else if ( type == 'integer' ) valid = me.checkValueInteger( tag, divTag );
			else if ( type == 'integerPositive' ) valid = me.checkValueIntegerPositive( tag, divTag );
			else if ( type == 'integerZeroPositive' ) valid = me.checkValueIntegerZeroOrPositive( tag, divTag );
			else if ( type == 'integerNegative' ) valid = me.checkValueIntegerNegative( tag, divTag );
			else if ( type == 'letter' ) valid = me.checkValueLetter( tag, divTag );
			
			
			if ( !valid ) tag.attr( 'valid', false );
		}		
	};
	
	
	// ------------------------------
	// -- Each type validation
	
	me.checkRequiredValue = function( inputTag, divTag )
	{
		var valid = true;
		var value = inputTag.val();

		if( inputTag.attr('mandatory') === 'true' )
		{
			var message = me.translationObj.getTranslatedValueByKey( "common_validation_requiredValue" );
			if( inputTag.attr("type") === "checkbox" && !inputTag.prop("checked") )
			{
				divTag.append( me.getErrorSpanTag( message ) );
				valid = false;
			}
			else if( value === "" || value === null )
			{
				divTag.append( me.getErrorSpanTag( message ) );
				valid = false;
			}
		}
		
		return valid;
	};
	
	me.checkValueLen = function( inputTag, divTag, type, length )
	{		
		var valid = true;
		var value = inputTag.val();
		
		if ( value && type == 'min' && value.length < length )
		{
			divTag.append( me.getErrorSpanTag( 'common_validation_minLength' ) );
			divTag.append( me.getErrorSpanTag( length ) );
			divTag.append( me.getErrorSpanTag( 'common_validation_exactCharacter' ) );
			valid = false;
		}
		else if ( value && type == 'max' && value.length > length )
		{
			divTag.append( me.getErrorSpanTag( 'common_validation_maxLength' ) );
			valid = false;
		}
		else if ( value && type == 'exactlength' && value.length != length )
		{
			divTag.append( me.getErrorSpanTag( 'common_validation_exactLength' ) );
			divTag.append( me.getErrorSpanTag( length ) );
			divTag.append( me.getErrorSpanTag( 'common_validation_exactCharacter' ) );
			valid = false;
		}
		else if( value && type == 'length' )
		{
			valid = false;
			var attrLen = inputTag.attr("length").split(",");
			for( var i in attrLen )
			{
				if( value.length == eval( attrLen[i] ) )
				{
					valid = true;
				}
			}
			
			if( !valid )
			{
				divTag.append( me.getErrorSpanTag( 'common_validation_exactLenChars8Or10' ) );
			}
			
		}
		
		
		return valid;
	};


	me.checkValueRange = function( inputTag, divTag, valFrom, valTo )
	{
		var valid = true;
		var value = inputTag.val();
		
		if ( value && ( valFrom > value || valTo < value ) )
		{
			divTag.append( me.getErrorSpanTag( 'common_validation_valueMax' ) );
			divTag.append( me.getErrorSpanTag( valTo ) );
			valid = false;
		}
		
		return valid;		
	};
	
	me.checkValueInteger = function( inputTag, divTag )
	{
		var value = inputTag.val();
		var valid = isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
		
		if( !valid )
		{
			divTag.append( me.getErrorSpanTag( 'common_validation_valueInteger' ) );
		}
		return valid;	
	};
	
	me.checkValueIntegerPositive = function( inputTag, divTag )
	{
		var value = inputTag.val();
		var valid = ( isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10)) ) && value > 0 ;
		
		if( !valid )
		{
			divTag.append( me.getErrorSpanTag( 'common_validation_valueIntegerPositive' ) );
		}
		return valid;	
	};

	me.checkValueIntegerZeroOrPositive = function( inputTag, divTag )
	{
		var value = inputTag.val();
		var valid = ( isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10)) ) && value >= 0 ;
		
		if( !valid )
		{
			divTag.append( me.getErrorSpanTag( 'common_validation_valueIntegerPositive' ) );
		}
		return valid;	
	};

	me.checkValueIntegerNegative = function( inputTag, divTag )
	{
		var value = inputTag.val();
		var valid = ( isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10)) ) && value < 0 ;
		
		if( !valid )
		{
			divTag.append( me.getErrorSpanTag( 'common_validation_valueIntegerPositive' ) );
		}
		return valid;	
	};
	
	me.checkValueNumber = function( inputTag, divTag )
	{
		var valid = true;
		var value = inputTag.val();
		
		if ( value && !( !isNaN(parseFloat(value)) && isFinite(value) ) )
		{
			divTag.append( me.getErrorSpanTag( 'common_validation_valueNumber' ) );
			valid = false;
		}
		
		return valid;	
	};

	me.checkValueLetter = function( inputTag, divTag )
	{
		var valid = true;
		var value = inputTag.val();
		
		var letters = /^[A-Za-z]+$/;
		if( !value.match(letters) )
		{
			divTag.append( me.getErrorSpanTag( 'common_validation_valueLetter' ) );
			return false;
		}
		
		return valid;	
	};
	
	me.checkPhoneNumberValue = function( inputTag, divTag )
	{
		var valid = true;
		
		// Check if Phone number is in [ 12, 15 ]
		inputTag.attr( 'altval', '' );

		var validationInfo = me.phoneNumberValidation( inputTag.val() );		
		if ( !validationInfo.success ) 
		{
			divTag.append( me.getErrorSpanTag( validationInfo.msg ) );
			valid = false;			
		}
		else
		{
			// If valid phone number, put the converted phone number as attribute to be used later.
			inputTag.attr( 'altval', validationInfo.phoneNumber );
		}
		
		return valid;
	};
	
	
	me.checkNotAllowValue = function( inputTag, divTag )
	{
		var valid = true;
		
		var value = inputTag.val().toUpperCase();
		var valueNotAllow = inputTag.attr("valueNotAllow").toUpperCase();
		
		if ( value && value == valueNotAllow )
		{
			divTag.append( me.getErrorSpanTag( 'common_validation_notAllowClientWith' ) );
			divTag.append( me.getErrorSpanTag( valueNotAllow ) );
			valid = false;
		}
		
		return valid;
	};
	
	me.checkNotAllowSpecialChars = function( inputTag, divTag )
	{
		var valid = true;
		
		var value = inputTag.val();
		var validValueReq = /^[(A-Za-z)( |')]+$/;
	    
	    if ( value && !value.match(validValueReq) ) {
	    	divTag.append( me.getErrorSpanTag( 'common_validation_notAllowSpecialChars' ) );
			valid = false;
	    }
	    return valid;
	};

	me.phoneNumberValidation = function( phoneVal )
	{
		var success = ( phoneVal == "" ) ? true : false;
		if( success ) {
			return { 'success': success, 'phoneNumber': phoneVal, 'msg': '' };
		}
		var msg = '';


		// Trim value
		var value = Utils.trim( phoneVal );
		
		// Starts with '07' --> 10 digits
		if ( Utils.startsWith( value, "07" ) )
		{
			if ( value.length != 10 )
			{
				msg += 'The length should be 10';
			}
			else if( Utils.isNumberDigit(value) )
			{
				value = value.replace("07", "+2557");
				success = true;
			}
			else
			{
				msg += me.translationObj.getTranslatedValueByKey( "common_validation_phoneNumberValid" );
			}
		}
		else if ( Utils.startsWith( value, "00" ) || Utils.startsWith( value, "+" ) )
		{
			var  checkedValue = value.replace( "+", "" );
			if( Utils.isNumberDigit(checkedValue) )
			{
				value = value.replace("00", "+");
				success = true;
			}
			else
			{
				msg += me.translationObj.getTranslatedValueByKey( "common_validation_phoneNumberInvalid" );
			}
		}
		else
		{
			msg += me.translationObj.getTranslatedValueByKey( "common_validation_phoneNumberValid" );
		}

		
		return { 'success': success, 'phoneNumber': value, 'msg': msg };	
	}
	
	// -----------------------------
	// -- Others
	
	me.getErrorSpanTag = function( keyword )
	{
		// var text = me.translationObj.getTranslatedValueByKey( keyword );
		return  $( "<span class='errorMsg' keyword=''><br>" + keyword + "</span>" );		
	};
	
	me.clearTagValidations = function( tags )
	{
		tags.css( "background-color", "" ).val( "" ).attr( "altval", "" );
		
		tags.each( function() {
			$( this ).closest( "div" ).find( "span.errorMsg" ).remove();
		});		
	};	
}