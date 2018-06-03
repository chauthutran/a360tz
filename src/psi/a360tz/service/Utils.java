package psi.a360tz.service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.codec.binary.Base64;
import org.json.JSONArray;
import org.json.JSONObject;

public final class Utils {
    
    public static String ACCESS_SERVER_USERNAME = "eref.webapp";
    public static String ACCESS_SERVER_PASSWORD = "8frhKmMe";
    
//    public static String LOCATION_DHIS_SERVER = "https://data.psi-mis.org";
    public static String LOCATION_DHIS_SERVER = "https://clone.psi-mis.org";

    public static final String REQUEST_TYPE_GET = "GET";
    public static final String REQUEST_TYPE_POST = "POST";
    public static final String REQUEST_TYPE_PUT = "PUT";
    public static final String REQUEST_TYPE_DELETE = "DELETE";
    public static final String REQUEST_PARAM_USERNAME = "usr";
    public static final String REQUEST_PARAM_PASSWORD = "pwd";


	public static String KEY_TRANSLATION_KEYWORDS_PROJECT_ID = "185733";
	public static String KEY_TRANSLATION_VERSION_PROJECT_ID = "95765";
	public static String KEY_TRANSLATION_LIST = "keywordList";
	public static String KEY_TRANSLATION_PROJECT_DETAILS = "version";
	
	
    public static final String KEY_LOGIN_ORGUNITID = "loginOrgUnitId";
    public static final String KEY_LOGIN_USERNAME = "loginUsername";
    public static final String KEY_LOGIN_PASSWORD = "loginPassword";
    public static final String KEY_LOGIN_ORGUNITNAME = "loginUserCode";
    public static final String KEY_LOGGED_STATUS = "status";
    public static final String KEY_A360PROGRAM_DETAILS = "programDetails";
    
    public static final String KEY_EVENT_LIST = "eventList";
    public static final String KEY_EVENT_COMPLETE = "complete";
    public static final String KEY_EVENT_CREATE = "create";
    public static final String KEY_EVENT_DELETE = "delete";
    public static final String KEY_EVENT_DETAILS = "details";
    public static final String KEY_EVENT_UPDATE_PAX = "updatePax";
    public static final String KEY_EVENT_PROGRAMDETAILS = "programDetails";
    public static final String KEY_EVENT_PARTICIPANT_LIST = "eventParticipants";
    public static final String KEY_USER_CHECKPASSWORD = "checkPassword";
    public static final String KEY_SEARCHBY_VOUCHER = "searchByVoucher";
    public static final String KEY_SEARCHBY_PHONENUMBER = "searchByPhoneNumber";
    public static final String KEY_SEARCHBY_CLIENTINFO = "searchByClientInfo";
    public static final String KEY_CREATE_EVENT_PARTICIPANT = "createParticipant"; // This key is used in EventController
    public static final String KEY_CREATE_TEI_PARTICIPANT = "createParticipant";// This key is used in ClientController
    
    

    public static final String OUGROUP_TZ_A360 = "Zo41oKPsuP1";
    public static final String ATTR_OU_PIN = "TL75hs9nGkH";
    
    public static final String ID_TRACKED_ENTITY_CIENT = "XV3kldsZq0H";
    
    public static final String ID_PROGRAM_TZA360 = "rbgkXW2TkNG";
    public static final String ID_PROGRAMSTAGE_TZA360 = "hB0gFIx08QX";
    public static final String ID_PROGRAM_CLIENT = "A7SRy7lpk1x";
    public static final String ID_PROGRAMSTAGE_TRANSACTION = "G3HhsA7BiNs";
    public static final String ID_PROGRAM_VOUCHER = "PIYbqsRwTBx";

    public static final String ID_DE_TRANSACTIONTYPE = "jjhgtSl7tlA";
    public static final String ID_DE_TZA360_EVENTID = "Uw0LqwBvQGD";
    public static final String ID_DE_CHECKIN = "HzngfV7q0J5";
    public static final String ID_DE_EVENTTYPE = "PjP2gCDbAmu";
    public static final String ID_DE_TZA360_PARTICIPANTS = "jwVaTNV9nnI";
    
    public static final String ID_ATTR_VOUCHERCODE = "RJO3VHQVIvh";
    public static final String ID_ATTR_PHONENUMBER = "uwjJhJ6kjN6";
    public static final String ID_ATTR_FIRSTNAME = "nR9d9xZ5TRJ";
    public static final String ID_ATTR_LASTNAME = "RsvOTmR2DjO";
    public static final String ID_ATTR_MOTHERNAME = "ZWAKgo9UfZk";
    public static final String ID_ATTR_BIRTHDISTRICT = "pL3gzBBWOhh";
    public static final String ID_ATTR_DOB = "wSp6Q7QDMsk";
    
    

	private static String sdf_date = "yyyy-MM-dd";
	private static final String DATEFORMAT = "yyyy-MM-dd'T'HH:mm:ss";
	private static final String DATEFORMAT_NO_T = "yyyy-MM-dd HH:mm:ss";

	private static SimpleDateFormat SD_FORMAT_DATE = new SimpleDateFormat( sdf_date );  
	private static SimpleDateFormat SD_FORMAT_DATE_TIME = new SimpleDateFormat( DATEFORMAT );  
	private static SimpleDateFormat SD_FORMAT_DATE_TIME_NO_T = new SimpleDateFormat( DATEFORMAT_NO_T );  

    
    // --------------------------------------------------------------------------------------------------------------
    // HTTPS GET/POST/PUT request
    // --------------------------------------------------------------------------------------------------------------
    
    // Convert InputStream to String
    public static JSONObject getJsonFromInputStream( InputStream is )
    {
        BufferedReader br = null;
        StringBuilder sb = new StringBuilder();

        String line;
        try
        {
            br = new BufferedReader( new InputStreamReader( is ) );
            while ( (line = br.readLine()) != null )
            {
                sb.append( line );
            }
        }
        catch ( IOException e )
        {
            e.printStackTrace();
        }
        finally
        {
            if ( br != null )
            {
                try
                {
                    br.close();
                }
                catch ( IOException e )
                {
                    e.printStackTrace();
                }
            }
        }

        JSONObject jsonData = new JSONObject( sb.toString() );
        return jsonData;
    }

    public static ResponseInfo sendRequest( String requestType, String url, JSONObject jsonData,
        Map<String, Object> params )
        throws Exception, IOException
    {
        System.out.println( "\n\n ====== \n requestUrl : " + url );

        String username = Utils.ACCESS_SERVER_USERNAME;
        String password = Utils.ACCESS_SERVER_PASSWORD;
        
        ResponseInfo responseInfo = new ResponseInfo();
        StringBuffer responseMsg = new StringBuffer();

        // 2. Open HttpsURLConnection and Set Request Type.
        URL obj = new URL( url );

        try
        {
            if ( obj.getProtocol().equals( "https" ) )
                responseInfo = Utils.sendRequestHTTPS( responseInfo, responseMsg, requestType, url, jsonData, params,
                    username, password );
            else
                responseInfo = Utils.sendRequestHTTP( responseInfo, responseMsg, requestType, url, jsonData, params,
                    username, password );
        }
        catch ( Exception ex )
        {
            responseMsg.append( "{ \"msg\": \"DHIS reponse code: " + responseInfo.responseCode
                + ", No Message - Error occurred during DHIS response processing: " + responseMsg.toString() + "\" }" );
        }

        responseInfo.output = responseMsg.toString();

        return responseInfo;
    }

    private static ResponseInfo sendRequestHTTP( ResponseInfo responseInfo, StringBuffer responseMsg,
        String requestType, String url, JSONObject jsonData, Map<String, Object> params, String username,
        String password )
        throws Exception, IOException
    {
        // responseInfo.sendStr = bodyMessage;
        responseInfo.data = jsonData;

        // 2. Open HttpsURLConnection and Set Request Type.
        URL obj = new URL( url );
        // Since HttpsURLConnection extends HttpURLConnection, we can use this
        // for both HTTP & HTTPS?
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();

        // add Request header
        con.setRequestMethod( requestType );

        con.setRequestProperty( "User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11" );
        con.setRequestProperty( "Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8" );
        con.setRequestProperty( "Accept-Language", "en-US,en;q=0.5" );
        con.setRequestProperty( "Content-Type", "application/json; charset=utf-8" );
        
        String userpass = username + ":" + password;
        String basicAuth = "Basic " + new String( new Base64().encode( userpass.getBytes() ) );
        con.setRequestProperty( "Authorization", basicAuth );

        // 3. Body Message Received Handle
        if ( jsonData != null && jsonData.length() > 0 )
        {
            // Send post request
            con.setDoOutput( true );
            
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(con.getOutputStream(), "UTF-8"));
            bw.write(jsonData.toString());
            bw.flush();
            bw.close();
        }

        if ( params != null && !params.isEmpty() )
        {
            StringBuilder postData = new StringBuilder();
            for ( Map.Entry<String, Object> param : params.entrySet() )
            {
                if ( postData.length() != 0 )
                    postData.append( '&' );

                postData.append( URLEncoder.encode( param.getKey(), "UTF-8" ) );
                postData.append( '=' );
                postData.append( URLEncoder.encode( String.valueOf( param.getValue() ), "UTF-8" ) );
            }

            byte[] postDataBytes = postData.toString().getBytes( "UTF-8" );

            con.setDoOutput( true );

            DataOutputStream wr = new DataOutputStream( con.getOutputStream() );
            wr.write( postDataBytes );
            wr.flush();
            wr.close();
        }

        // 4. Send and get Response
        responseInfo.responseCode = con.getResponseCode();

        // 5. Other response info
        if ( con.getResponseCode() == HttpURLConnection.HTTP_OK ) 
        {
            BufferedReader in = new BufferedReader( new InputStreamReader( con.getInputStream(), "UTF-8" ) );

            String inputLine;
            while ( (inputLine = in.readLine()) != null )
            {
                responseMsg.append( inputLine );
            }

            in.close();
            
        } else 
        {
             String json = Utils.readStream(con.getErrorStream());
             responseMsg.append( json );
        }

        responseInfo.data = new JSONObject( responseMsg.toString() );

        return responseInfo;
    }

    private static ResponseInfo sendRequestHTTPS( ResponseInfo responseInfo, StringBuffer responseMsg,
        String requestType, String url, JSONObject jsonData, Map<String, Object> params, String username,
        String password )
        throws Exception, IOException
    {
        // responseInfo.sendStr = bodyMessage;
        responseInfo.data = jsonData;

        // 2. Open HttpsURLConnection and Set Request Type.
        URL obj = new URL( url );
        // Since HttpsURLConnection extends HttpURLConnection, we can use this
        // for both HTTP & HTTPS?
        HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();

        // add Request header
        con.setRequestMethod( requestType );

        con.setRequestProperty( "User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11" );
        con.setRequestProperty( "Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8" );
        con.setRequestProperty( "Accept-Language", "en-US,en;q=0.5" );
        con.setRequestProperty( "Content-Type", "application/json; charset=utf-8" );
        
        String userpass = username + ":" + password;
        String basicAuth = "Basic " + new String( new Base64().encode( userpass.getBytes() ) );
        con.setRequestProperty( "Authorization", basicAuth );

        // 3. Body Message Received Handle
        if ( jsonData != null && jsonData.length() > 0 )
        {
            // Send post request
            con.setDoOutput( true );
            
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(con.getOutputStream(), "UTF-8"));
            bw.write(jsonData.toString());
            bw.flush();
            bw.close();
        }

        if ( params != null && !params.isEmpty() )
        {
            StringBuilder postData = new StringBuilder();
            for ( Map.Entry<String, Object> param : params.entrySet() )
            {
                if ( postData.length() != 0 )
                    postData.append( '&' );

                postData.append( URLEncoder.encode( param.getKey(), "UTF-8" ) );
                postData.append( '=' );
                postData.append( URLEncoder.encode( String.valueOf( param.getValue() ), "UTF-8" ) );
            }

            byte[] postDataBytes = postData.toString().getBytes( "UTF-8" );

            con.setDoOutput( true );

            DataOutputStream wr = new DataOutputStream( con.getOutputStream() );
            wr.write( postDataBytes );
            wr.flush();
            wr.close();
        }

        // 4. Send and get Response
        responseInfo.responseCode = con.getResponseCode();

        // 5. Other response info
        if ( con.getResponseCode() == HttpURLConnection.HTTP_OK ) 
        {
            BufferedReader in = new BufferedReader( new InputStreamReader( con.getInputStream(), "UTF-8" ) );

            String inputLine;
            while ( (inputLine = in.readLine()) != null )
            {
                responseMsg.append( inputLine );
            }

            in.close();
            
        } else 
        {
             String json = Utils.readStream(con.getErrorStream());
             responseMsg.append( json );
        }

        responseInfo.data = new JSONObject( responseMsg.toString() );

        return responseInfo;
    }

    private static String readStream(InputStream stream) throws Exception {
        StringBuilder builder = new StringBuilder();
        try (BufferedReader in = new BufferedReader(new InputStreamReader(stream))) {
            String line;
            while ((line = in.readLine()) != null) {
                builder.append(line); // + "\r\n"(no need, json has no line breaks!)
            }
            in.close();
        }
        
        return builder.toString();
    }
    
    public static void respondMsgOut( ResponseInfo responseInfo, HttpServletResponse response )
        throws IOException, Exception
    {
        response.setContentType( "application/json" );
        response.setStatus( responseInfo.responseCode );
        
        PrintWriter out = response.getWriter();
        out.print( responseInfo.outMessage );
        out.flush();
    }
    
    // --------------------------------------------------------------------------------------------------------------
    // Utilitizes
    // --------------------------------------------------------------------------------------------------------------

    public static String outputImportResult( String output, String summaryType )
    {
        String referenceId = "";

        JSONObject rec = null;

        JSONObject recTemp = new JSONObject( output );

        if ( summaryType != null && summaryType.equals( "importSummaries" ) )
        {
            if ( recTemp.has( "response" ) )
            {
                JSONObject response = recTemp.getJSONObject( "response" );

                if ( response.has( "importSummaries" ) )
                {
                    JSONArray importSummaries = response.getJSONArray( "importSummaries" );
                    rec = importSummaries.getJSONObject( 0 );
                }
            }
        }
        else
        {
            if ( recTemp.has( "response" ) )
            {
                rec = recTemp.getJSONObject( "response" );
            }
        }

        if ( rec != null && rec.has( "status" ) && rec.getString( "status" ).equals( "SUCCESS" ) )
        {
            JSONObject importCount = rec.getJSONObject( "importCount" );

            // NOTE: In "importSummaries" case, it shows up as 0 for 'imported'
            if ( (importCount.getInt( "imported" ) >= 1 || importCount.getInt( "updated" ) >= 1)
                || summaryType.equals( "importSummaries" ) )
            {
                if ( rec.has( "reference" ) )
                {
                    referenceId = rec.getString( "reference" );
                }
            }
        }

        return referenceId;
    } 
    
    public static void processResponseMsg( ResponseInfo responseInfo, String importSummaryCase )
    {
        if ( responseInfo.responseCode != 200 )
        {
            // If error occured, display the output as it is (received from
            // DHIS).
            // Set return Msg
            responseInfo.outMessage = responseInfo.output;
        }
        else
        {
            // Set return Msg
            responseInfo.referenceId = Utils.outputImportResult( responseInfo.output, importSummaryCase );
            responseInfo.outMessage = "{ \"id\": \"" + responseInfo.referenceId + "\" }";
        }
    }
    
    
    // -------------------------------------------------------------------------
    // Date Methods

	public static Date getDateTimeFromStr( String dateStr ) throws Exception
	{
		Date dateTimeObj = null;
				
		try
		{
			if ( dateStr.length() <= 10 )
			{
				dateTimeObj = getDateFromStr( dateStr );					
			}
			else
			{
				String middleChar = dateStr.substring( 10, 11 );
								
				if ( middleChar.equals( "T" ) )
				{			
					dateTimeObj = SD_FORMAT_DATE_TIME.parse( dateStr );		
				}
				else if ( middleChar.equals( " " ) )
				{
					dateTimeObj = SD_FORMAT_DATE_TIME_NO_T.parse( dateStr );						
				}			
			}
		}
		catch( Exception ex )
		{
			ex.printStackTrace();
		}
		
		return dateTimeObj;
	}
	

	public static Date getDateFromStr( String dateStr ) throws Exception
	{
		Date dateObj = null;
				
		try
		{
			dateObj = SD_FORMAT_DATE.parse( dateStr );		
		}
		catch( Exception ex )
		{
			ex.printStackTrace();
		}
		
		return dateObj;
	}

	public static String getTodayFormatted()
	{	
		Date current = new Date();

		SimpleDateFormat format = new SimpleDateFormat( Utils.sdf_date );
		return format.format( current );
	}
	
	
 	// -------------------------------------------------------------------------
   	// Basic Helper/Util Methods
   	
   	public static String getRequestParamValStr( HttpServletRequest request, String paramName )
   	{
   		String valStr = "";

   		String tempVal = request.getParameter( paramName );
   		if ( tempVal != null ) valStr = tempVal.toString();
   		
   		return valStr;
   	}
   	
}
