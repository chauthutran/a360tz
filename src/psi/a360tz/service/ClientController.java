package psi.a360tz.service;

import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;


public class ClientController extends HttpServlet {
	
	private static final long serialVersionUID = 1195934925264490034L;

	private static final String PARAM_SEARCH_ORGUNITID = "@PARAM_SEARCH_ORGUNITID";
	private static final String PARAM_SEARCH_VALUE = "@PARAM_SEARCH_VALUE";

	private static final String PARAM_SEARCH_FIRSTNAME_VALUE = "@PARAM_SEARCH_FIRSTNAME_VALUE";
	private static final String PARAM_SEARCH_LASTNAME_VALUE = "@PARAM_SEARCH_LASTNAME_VALUE";
	private static final String PARAM_SEARCH_MOTHERNAME_VALUE = "@PARAM_SEARCH_MOTHERNAME_VALUE";
	private static final String PARAM_SEARCH_BIRTHDISTRICT_VALUE = "@PARAM_SEARCH_BIRTHDISTRICT_VALUE";
	private static final String PARAM_SEARCH_DOB_VALUE = "@PARAM_SEARCH_DOB_VALUE";
	
	
	private static final String PARAM_CLIENT_ID = "@PARAM_CLIENT_ID";
	
	// -------------------------------------------------------------------------
    // URLs
    // -------------------------------------------------------------------------
  
	// FvUGp8I75zV;WFFJSzhyMAO
	private static final String URL_QUERY_SEARCHBY_VOUCHER = Utils.LOCATION_DHIS_SERVER + "/api/trackedEntityInstances/query.json?ou=" + ClientController.PARAM_SEARCH_ORGUNITID + "&ouMode=ALL&program=" + Utils.ID_PROGRAM_VOUCHER 
			+ "&filter=" + Utils.ID_ATTR_VOUCHERCODE + ":eq:" + ClientController.PARAM_SEARCH_VALUE;
	
	private static final String URL_QUERY_SEARCHBY_PHONENUMBER = Utils.LOCATION_DHIS_SERVER + "/api/trackedEntityInstances/query.json?ou=" + ClientController.PARAM_SEARCH_ORGUNITID + "&ouMode=ALL&program=" + Utils.ID_PROGRAM_CLIENT 
			+ "&filter=" + Utils.ID_ATTR_PHONENUMBER + ":eq:" + ClientController.PARAM_SEARCH_VALUE;

	private static final String URL_GET_CLIENT_BY_ID = Utils.LOCATION_DHIS_SERVER + "/api/trackedEntityInstances/" + ClientController.PARAM_CLIENT_ID + ".json?fields=*";
	
	private static final String URL_QUERY_SEARCHBY_CLIENTINFO = Utils.LOCATION_DHIS_SERVER + "/api/trackedEntityInstances/query.json?ou=" + ClientController.PARAM_SEARCH_ORGUNITID + "&ouMode=ALL&program=" + Utils.ID_PROGRAM_CLIENT 
			+ "&filter=" + Utils.ID_ATTR_FIRSTNAME + ":LIKE:" + ClientController.PARAM_SEARCH_FIRSTNAME_VALUE
			+ "&filter=" + Utils.ID_ATTR_LASTNAME + ":LIKE:" + ClientController.PARAM_SEARCH_LASTNAME_VALUE
			+ "&filter=" + Utils.ID_ATTR_MOTHERNAME + ":LIKE:" + ClientController.PARAM_SEARCH_MOTHERNAME_VALUE
			+ "&filter=" + Utils.ID_ATTR_BIRTHDISTRICT + ":LIKE:" + ClientController.PARAM_SEARCH_BIRTHDISTRICT_VALUE
			+ "&filter=" + Utils.ID_ATTR_DOB + ":eq:" + ClientController.PARAM_SEARCH_DOB_VALUE;
	
	
	private static final String URL_CREATE_TEI = Utils.LOCATION_DHIS_SERVER + "/api/trackedEntityInstances/";
	
	private static final String URL_ENROLLMENT_TEI = Utils.LOCATION_DHIS_SERVER + "/api/enrollments/";
		
	// -------------------------------------------------------------------------
    // POST method
    // -------------------------------------------------------------------------
 
	protected void doPost( HttpServletRequest request, HttpServletResponse response )
        throws ServletException, IOException
    {
        try
        {         
            // STEP 1. Check loginUsername/password
            ResponseInfo responseInfo = new ResponseInfo();
            
            if ( request.getPathInfo() != null && request.getPathInfo().split( "/" ).length >= 2 )
            {
                String[] queryPathList = request.getPathInfo().split( "/" );
                String key = queryPathList[1];

            	HttpSession session = request.getSession( true );
            	String orgUnitId = (String) session.getAttribute( Utils.KEY_LOGIN_ORGUNITID );
            	
            	
                // Get event list
                if ( key.equals( Utils.KEY_SEARCHBY_VOUCHER ) )
                {
                	String voucherCode = request.getParameter("voucherCode");
                	responseInfo = ClientController.searchClientByVoucher( voucherCode, orgUnitId );
                	
                	if( responseInfo.responseCode == 200 )
                	{
                		JSONArray resultData = responseInfo.data.getJSONArray( "rows" );
                		if( resultData.length() > 0 )
                		{
                			String teiId = resultData.getJSONArray(0).getString(0);
                			responseInfo = ClientController.getClientById( teiId );
                		}
                	}
            		responseInfo.outMessage = responseInfo.data.toString();
                }
                else if( key.equals( Utils.KEY_SEARCHBY_PHONENUMBER ) )
                {
                	String phoneNumber = request.getParameter("phoneNumber");
                	responseInfo = ClientController.searchClientByPhoneNumber( phoneNumber, orgUnitId );
            		responseInfo.outMessage = responseInfo.data.toString();
                }
                else if( key.equals( Utils.KEY_SEARCHBY_CLIENTINFO ) )
                {
            		JSONObject requestData = Utils.getJsonFromInputStream( request.getInputStream() );
                	
                	responseInfo = ClientController.searchClientByClientInfo( requestData, orgUnitId );
            		responseInfo.outMessage = responseInfo.data.toString();
                }
                else if( key.equals( Utils.KEY_CREATE_TEI_PARTICIPANT ) )
                {
            		JSONObject requestData = Utils.getJsonFromInputStream( request.getInputStream() );
                	
                	responseInfo = ClientController.createTEI( requestData, orgUnitId );

                	if( responseInfo.responseCode == 200 )
                	{
                		Utils.processResponseMsg( responseInfo, null );
                    	String teiId = responseInfo.referenceId;
                		responseInfo.data.put( "trackedEntityInstance", teiId );
                		
                		// Enroll TEI to Client program
                		ResponseInfo responseInfo_Enroll = ClientController.enrollmentTEI( teiId, orgUnitId );

                		// Create Event Participant
                		if( responseInfo_Enroll.responseCode == 200 )
                		{
                			JSONObject eventData = requestData.getJSONObject("event");
                			eventData.put( "teiId", teiId );
                        	responseInfo = EventController.createEventParticipant( eventData );
                        	responseInfo.outMessage = responseInfo.data.toString();
                		}
                	}
                	
            		responseInfo.outMessage = responseInfo.data.toString();
                }
            }
            
            
            // STEP 3. Send back the messages
            Utils.respondMsgOut( responseInfo, response );

        }
        catch( Exception ex)
        {
        	ex.printStackTrace();
        }
    }


    // -------------------------------------------------------------------------
    // Supportive methods
	
	private static ResponseInfo searchClientByVoucher( String voucherCode, String orgUnitId )
    {
        ResponseInfo responseInfo = null;

        try
        {
            String requestUrl = ClientController.URL_QUERY_SEARCHBY_VOUCHER;
            
            requestUrl = requestUrl.replace( ClientController.PARAM_SEARCH_ORGUNITID, orgUnitId );
        	requestUrl = requestUrl.replace( ClientController.PARAM_SEARCH_VALUE, voucherCode );
        	
            responseInfo = Utils.sendRequest( Utils.REQUEST_TYPE_GET, requestUrl, null, null );
        }
        catch ( Exception ex )
        {
            System.out.println( "Exception: " + ex.toString() );
        }

        return responseInfo;
    }

	private static ResponseInfo searchClientByPhoneNumber( String phoneNumber, String orgUnitId )
    {
        ResponseInfo responseInfo = null;

        try
        {
        	phoneNumber = ClientController.encodeData( phoneNumber );
            String requestUrl = ClientController.URL_QUERY_SEARCHBY_PHONENUMBER;
            requestUrl = requestUrl.replace( ClientController.PARAM_SEARCH_ORGUNITID, orgUnitId );
            requestUrl = requestUrl.replace( ClientController.PARAM_SEARCH_VALUE, phoneNumber );
        	
            responseInfo = Utils.sendRequest( Utils.REQUEST_TYPE_GET, requestUrl, null, null );
        }
        catch ( Exception ex )
        {
            System.out.println( "Exception: " + ex.toString() );
        }

        return responseInfo;
    }
	

	private static ResponseInfo searchClientByClientInfo( JSONObject requestData, String orgUnitId )
    {
        ResponseInfo responseInfo = null;

        try
        {
        	String firstName = ClientController.encodeData( requestData.getString("firstName") );
        	String lastName = ClientController.encodeData( requestData.getString("lastName") );
        	String motherName = ClientController.encodeData( requestData.getString("motherName") );
        	String birthDistrict = ClientController.encodeData( requestData.getString("birthDistrict") );
        	String dob = ClientController.encodeData( requestData.getString("dob") );
        	
            String requestUrl = ClientController.URL_QUERY_SEARCHBY_CLIENTINFO;
            requestUrl = requestUrl.replace( ClientController.PARAM_SEARCH_ORGUNITID, orgUnitId );
            requestUrl = requestUrl.replace( ClientController.PARAM_SEARCH_FIRSTNAME_VALUE, firstName );
            requestUrl = requestUrl.replace( ClientController.PARAM_SEARCH_LASTNAME_VALUE, lastName );
            requestUrl = requestUrl.replace( ClientController.PARAM_SEARCH_MOTHERNAME_VALUE, motherName );
            requestUrl = requestUrl.replace( ClientController.PARAM_SEARCH_BIRTHDISTRICT_VALUE, birthDistrict );
            requestUrl = requestUrl.replace( ClientController.PARAM_SEARCH_DOB_VALUE, dob );
        	
            responseInfo = Utils.sendRequest( Utils.REQUEST_TYPE_GET, requestUrl, null, null );
        }
        catch ( Exception ex )
        {
            System.out.println( "Exception: " + ex.toString() );
        }

        return responseInfo;
    }
	
	private static ResponseInfo getClientById( String teiId )
    {
        ResponseInfo responseInfo = null;

        try
        {
            String requestUrl = ClientController.URL_GET_CLIENT_BY_ID;
            requestUrl = requestUrl.replace( ClientController.PARAM_CLIENT_ID, teiId );
        	
            responseInfo = Utils.sendRequest( Utils.REQUEST_TYPE_GET, requestUrl, null, null );
        }
        catch ( Exception ex )
        {
            System.out.println( "Exception: " + ex.toString() );
        }

        return responseInfo;
    }
	
	private static ResponseInfo createTEI( JSONObject requestData, String orgUnitId )
    {
        ResponseInfo responseInfo = null;

        try
        {
        	JSONObject clientData = ClientController.composeJsonTeiParticipant( requestData, orgUnitId );
            String requestUrl = ClientController.URL_CREATE_TEI;
            responseInfo = Utils.sendRequest( Utils.REQUEST_TYPE_POST, requestUrl, clientData, null );
        }
        catch ( Exception ex )
        {
            System.out.println( "Exception: " + ex.toString() );
        }

        return responseInfo;
    }
	

	private static ResponseInfo enrollmentTEI( String teiId, String orgUnitId )
    {
        ResponseInfo responseInfo = null;

        try
        {
        	JSONObject enrollmentData = ClientController.getEnrollmentJson( teiId, orgUnitId );
     System.out.println("\n\n === \n enrollmentData : " + enrollmentData.toString() );   	
            String requestUrl = ClientController.URL_ENROLLMENT_TEI;
            responseInfo = Utils.sendRequest( Utils.REQUEST_TYPE_POST, requestUrl, enrollmentData, null );
        }
        catch ( Exception ex )
        {
            System.out.println( "Exception: " + ex.toString() );
        }

        return responseInfo;
    }
	
	
	// -------------------------------------------------------------------------
	// Supportive methods
	
	private static String encodeData( String value )
	{
		String encodeValue = URLEncoder.encode( value );
		
		encodeValue = encodeValue.replaceAll("\\+", "%2B");
//		encodeValue = encodeValue.replaceAll(" ", "%20");
//		encodeValue = encodeValue.replaceAll("!", "%22");
//		encodeValue = encodeValue.replaceAll("#", "%23");
//		encodeValue = encodeValue.replaceAll("$", "%24");
//		encodeValue = encodeValue.replaceAll("&", "%26");
//		encodeValue = encodeValue.replaceAll("'", "%27");
//		encodeValue = encodeValue.replaceAll("(", "%28");
//		encodeValue = encodeValue.replaceAll(")", "%29");
//		encodeValue = encodeValue.replaceAll("*", "%2A");
//		encodeValue = encodeValue.replaceAll(",", "%2C");
//		encodeValue = encodeValue.replaceAll(".", "%2E");
//		encodeValue = encodeValue.replaceAll("/", "%2F");
//		encodeValue = encodeValue.replaceAll("‘", "%91"); // UTF 8 --> %E2%80%98
//		encodeValue = encodeValue.replaceAll("’", "%92"); // UTF 8 --> 	%E2%80%99
		
		return encodeValue;
	}

	private static JSONObject composeJsonTeiParticipant( JSONObject attributeData, String orgUnitId )
	{
		JSONArray attributeValues = new JSONArray();
			
		// First name
		JSONObject firstNameValue = new JSONObject();
		firstNameValue.put("attribute", Utils.ID_ATTR_FIRSTNAME);
		firstNameValue.put("value", attributeData.getString("firstName"));
		attributeValues.put( firstNameValue );
		
		// Last name
		JSONObject lastNameValue = new JSONObject();
		lastNameValue.put("attribute", Utils.ID_ATTR_LASTNAME);
		lastNameValue.put("value", attributeData.getString("lastName"));
		attributeValues.put( lastNameValue );
		
		// Mother name
		JSONObject motherNameValue = new JSONObject();
		motherNameValue.put("attribute", Utils.ID_ATTR_MOTHERNAME);
		motherNameValue.put("value", attributeData.getString("motherName"));
		attributeValues.put( motherNameValue );
		
		// Birth District
		JSONObject birthDistrictValue = new JSONObject();
		birthDistrictValue.put("attribute", Utils.ID_ATTR_BIRTHDISTRICT);
		birthDistrictValue.put("value", attributeData.getString("birthDistrict"));
		attributeValues.put( birthDistrictValue );
		
		// DoB
		JSONObject dobValue = new JSONObject();
		dobValue.put("attribute", Utils.ID_ATTR_DOB);
		dobValue.put("value", attributeData.getString("dob"));
		attributeValues.put( dobValue );
		
		
		// Create Client Json Data
		JSONObject clientData = new JSONObject();
		clientData.put( "trackedEntity", Utils.ID_TRACKED_ENTITY_CIENT );
		clientData.put( "orgUnit", orgUnitId );
		clientData.put( "attributes", attributeValues );
		
		return clientData;
	}

	public static JSONObject getEnrollmentJson( String teiId, String orgUnitId )
	{
		String today = Utils.getTodayFormatted();
		
		JSONObject jsonData = new JSONObject();
		jsonData.put( "trackedEntityInstance", teiId );
		jsonData.put( "orgUnit", orgUnitId );
		jsonData.put( "program", Utils.ID_PROGRAM_CLIENT );
		jsonData.put( "enrollmentDate", today );
		jsonData.put( "incidentDate", today );

		return jsonData;
	}
}
