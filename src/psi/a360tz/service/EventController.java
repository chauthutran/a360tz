package psi.a360tz.service;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;


public class EventController extends HttpServlet
{
	private static final long serialVersionUID = -7623738832715443182L;
	
	
	private static final String PARAM_EVENT_ID = "@PARAM_EVENT_ID";
	private static final String PARAM_EVENT_DATE = "@PARAM_EVENT_DATE";
	
	
	// -------------------------------------------------------------------------
    // URLs
    // -------------------------------------------------------------------------
  
	private static final String URL_QUERY_LIST_A360EVENTS = Utils.LOCATION_DHIS_SERVER + "/api/events.json?skipPaging=true&order=eventDate:desc&program=" + Utils.ID_PROGRAM_TZA360 + "&orgUnit=";
	private static final String URL_ACTION_EVENT = Utils.LOCATION_DHIS_SERVER + "/api/events/";
	private static final String URL_QUERY_LIST_EVENT_PARTICIPANTS = Utils.LOCATION_DHIS_SERVER + "/api/sqlViews/uGUsRj6UBG8/data.json?var=eventId:" + EventController.PARAM_EVENT_ID + "&var=eventDate:" + EventController.PARAM_EVENT_DATE;

	// -------------------------------------------------------------------------
    // POST method
    // -------------------------------------------------------------------------
    
    protected void doPost( HttpServletRequest request, HttpServletResponse response )
        throws ServletException, IOException
    {
        try
        {         
            // STEP 1. Check loginUsername/password
            ResponseInfo responseInfo = null;
            
            if ( request.getPathInfo() != null && request.getPathInfo().split( "/" ).length >= 2 )
            {
                String[] queryPathList = request.getPathInfo().split( "/" );
                String key = queryPathList[1];
                
                // Get event details
                if ( key.equals( Utils.KEY_EVENT_DETAILS ) )
                {
                	String eventId = request.getParameter("eventId");
                	responseInfo = EventController.getEvent( eventId );
                    responseInfo.outMessage = responseInfo.data.toString();
                }
                // Get event list
                else if ( key.equals( Utils.KEY_EVENT_LIST ) )
                {
                	HttpSession session = request.getSession( true );
                	String orgUnitId = (String) session.getAttribute( Utils.KEY_LOGIN_ORGUNITID );
                	String orgUnitName = (String) session.getAttribute( Utils.KEY_LOGIN_ORGUNITNAME );
                	String orgUnitCode = (String) session.getAttribute( Utils.KEY_LOGIN_USERNAME );
                	responseInfo = EventController.getEventList( orgUnitId );
                	

                    JSONObject loginInfo = new JSONObject();
                    loginInfo.put( "name", orgUnitName );
                    loginInfo.put( "code", orgUnitCode );
                    
                    JSONObject resultData = new JSONObject();
                    resultData.put("orgUnit", loginInfo);
                    resultData.put("list", responseInfo.data);
                    
                    responseInfo.outMessage = resultData.toString();
                }
                // Complete event
                else if ( key.equals( Utils.KEY_EVENT_COMPLETE ) )
                {
                	String eventId = request.getParameter("eventId");
                	responseInfo = EventController.completeEvent( eventId );
                	
                    responseInfo.outMessage = responseInfo.data.toString();
                }
                // Create event
                else if ( key.equals( Utils.KEY_EVENT_CREATE ) )
                {
                	HttpSession session = request.getSession( true );
                	String orgUnitId = (String) session.getAttribute( Utils.KEY_LOGIN_ORGUNITID );
                	
                	JSONObject eventData = Utils.getJsonFromInputStream( request.getInputStream() );
                	eventData = EventController.composeJsonEvent( eventData, orgUnitId );
                	responseInfo = EventController.createEvent( eventData );
                	
                	if( responseInfo.responseCode == 200 )
                	{
                    	Utils.processResponseMsg( responseInfo, "importSummaries" );
                		eventData.put( "event", responseInfo.referenceId );
                		
                		responseInfo.data = eventData;
                		responseInfo.outMessage = responseInfo.data.toString();
                	}
                }
                else if ( key.equals( Utils.KEY_EVENT_PROGRAMDETAILS ) )
                {
                	HttpSession session = request.getSession( true );
                	responseInfo = new ResponseInfo();
                	responseInfo.outMessage = (String) session.getAttribute( Utils.KEY_A360PROGRAM_DETAILS );
                	responseInfo.responseCode = 200;
                }
                else if ( key.equals( Utils.KEY_EVENT_PARTICIPANT_LIST ) )
                {
                	String eventId = request.getParameter("eventId");
                	String eventDate = request.getParameter("eventDate");
                	responseInfo = EventController.getEventParticipantList( eventId, eventDate );
                	responseInfo.outMessage = responseInfo.data.toString();
                }
                else if ( key.equals( Utils.KEY_EVENT_DELETE ) )
                {
                	String eventId = request.getParameter("eventId");
                	responseInfo = EventController.deleteEvent( eventId );
                    responseInfo.outMessage = responseInfo.data.toString();
                }
                else if ( key.equals( Utils.KEY_EVENT_UPDATE_PAX ) )
                {
                	String eventId = request.getParameter("eventId");
                	String paxValue = request.getParameter("pax");
                	responseInfo = EventController.getEvent( eventId );
                	if( responseInfo.responseCode == 200 )
                	{
                		JSONObject eventData = EventController.setEventParticipantValue( responseInfo.data, null, paxValue );
                		responseInfo = EventController.updateEvent( eventData );
                	}
                	
                    responseInfo.outMessage = responseInfo.data.toString();
                }
                else if ( key.equals( Utils.KEY_CREATE_EVENT_PARTICIPANT ) )
                {
                	JSONObject requestData = Utils.getJsonFromInputStream( request.getInputStream() );
                	responseInfo = EventController.createEventParticipant( requestData );
                	responseInfo.outMessage = responseInfo.data.toString();
//                	
//                	JSONObject requestData = Utils.getJsonFromInputStream( request.getInputStream() );
//                	
//                	String eventId = requestData.getString( "eventId" );
//                	String teiId = requestData.getString( "teiId" );
//                	String checkIn = requestData.getString( "checkIn" );
//                	
//                	ResponseInfo responseInfo_Event = EventController.getEvent( eventId );
//                	if( responseInfo_Event.responseCode == 200 )
//                	{
//                		JSONObject eventParticipant = EventController.composeJsonEventParticipant( checkIn, teiId, responseInfo_Event.data );
//                		responseInfo = EventController.createEvent( eventParticipant );
//                		
//                		if( responseInfo.responseCode == 200 )
//                		{
//                			JSONObject eventData = EventController.setEventParticipantValue( responseInfo_Event.data, true, ""  );
//                			responseInfo_Event = EventController.updateEvent( eventData );
//                			
//                			if( responseInfo_Event.responseCode == 200 )
//                			{
//                				responseInfo.outMessage = responseInfo.data.toString();
//                			}
//                		}
//                	}
                	    
                	    	
                }
            }

            // STEP 3. Send back the messages
            Utils.respondMsgOut( responseInfo, response );

        }
        catch ( IOException ex )
        {
            System.out.println( "IO Excpetion: " + ex.toString() );
        }
        catch ( Exception ex )
        {
            System.out.println( "Exception: " + ex.toString() );
        }
    }
    
    
    
    // -------------------------------------------------------------------------
    // TZ A360 Events
    

    private static ResponseInfo getEventList( String orgUnitId )
    {
        ResponseInfo responseInfo = null;
        try
        {
        	String url = EventController.URL_QUERY_LIST_A360EVENTS + orgUnitId;
            responseInfo = Utils.sendRequest( Utils.REQUEST_TYPE_GET, url, null, null );
        }
        catch ( Exception ex )
        {
            ex.printStackTrace();
        }

        return responseInfo;
    }
    
    private static ResponseInfo completeEvent( String eventId )
    {
    	ResponseInfo responseInfo = null;
        try
        {
        	responseInfo = EventController.getEvent( eventId );
        	if( responseInfo.responseCode == 200 )
        	{
        		JSONObject eventData = responseInfo.data;
        		eventData.put("status", "COMPLETED");
        		responseInfo = EventController.updateEvent( responseInfo.data );
        	}
        }
        catch ( Exception ex )
        {
            ex.printStackTrace();
        }

        return responseInfo;
    }
    
    private static ResponseInfo getEvent( String eventId )
    {
    	ResponseInfo responseInfo = null;
        try
        {
        	String url = EventController.URL_ACTION_EVENT + eventId + ".json";
            responseInfo = Utils.sendRequest( Utils.REQUEST_TYPE_GET, url, null, null );
        }
        catch ( Exception ex )
        {
            ex.printStackTrace();
        }

        return responseInfo;
    }

    private static ResponseInfo updateEvent( JSONObject eventData )
    {
    	ResponseInfo responseInfo = null;
        try
        {
        	String url = EventController.URL_ACTION_EVENT + eventData.getString("event");
            responseInfo = Utils.sendRequest( Utils.REQUEST_TYPE_PUT, url, eventData, null );
        }
        catch ( Exception ex )
        {
            ex.printStackTrace();
        }

        return responseInfo;
    }


    private static ResponseInfo createEvent( JSONObject eventData )
    {
    	ResponseInfo responseInfo = null;
        try
        {
        	String url = EventController.URL_ACTION_EVENT;
            responseInfo = Utils.sendRequest( Utils.REQUEST_TYPE_POST, url, eventData, null );
        }
        catch ( Exception ex )
        {
            ex.printStackTrace();
        }

        return responseInfo;
    }
    
    private static ResponseInfo deleteEvent( String eventId )
    {
    	ResponseInfo responseInfo = null;
        try
        {
        	String url = EventController.URL_ACTION_EVENT + eventId;
            responseInfo = Utils.sendRequest( Utils.REQUEST_TYPE_DELETE, url, null, null );
        }
        catch ( Exception ex )
        {
            ex.printStackTrace();
        }

        return responseInfo;
    }
    

    private static ResponseInfo getEventParticipantList( String eventId, String eventDate )
    {
        ResponseInfo responseInfo = null;

        try
        {
            String requestUrl = EventController.URL_QUERY_LIST_EVENT_PARTICIPANTS;
            requestUrl = requestUrl.replace( EventController.PARAM_EVENT_ID, eventId );
            requestUrl = requestUrl.replace( EventController.PARAM_EVENT_DATE, eventDate );
       
            responseInfo = Utils.sendRequest( Utils.REQUEST_TYPE_GET, requestUrl, null, null );
        }
        catch ( Exception ex )
        {
            System.out.println( "Exception: " + ex.toString() );
        }

        return responseInfo;
    }
    
    // -------------------------------------------------------------------------
    // Event Participants
    

    public static ResponseInfo createEventParticipant( JSONObject requestData )
    {
        ResponseInfo responseInfo = null;

        try
        {
        	String eventId = requestData.getString( "eventId" ); // A360 EVENT ID
        	String teiId = requestData.getString( "teiId" );
        	String checkIn = requestData.getString( "checkIn" );
        	String program = requestData.getString( "program" );
        	
        	ResponseInfo responseInfo_Event = EventController.getEvent( eventId );
        	if( responseInfo_Event.responseCode == 200 )
        	{
        		JSONObject eventParticipant = EventController.composeJsonEventParticipant( checkIn, teiId, program, responseInfo_Event.data );
        		responseInfo = EventController.createEvent( eventParticipant );

        		if( responseInfo.responseCode == 200 )
        		{
        			JSONObject eventData = EventController.setEventParticipantValue( responseInfo_Event.data, true, ""  );
        			responseInfo_Event = EventController.updateEvent( eventData );
        			
        			if( responseInfo_Event.responseCode == 200 )
        			{
        				responseInfo.outMessage = responseInfo.data.toString();
        			}
        		}
        	}
        }
        catch ( Exception ex )
        {
            System.out.println( "Exception: " + ex.toString() );
        }

        return responseInfo;
    }
    
    // -------------------------------------------------------------------------
    // Supportive methods
    
    private static JSONObject composeJsonEvent( JSONObject eventData, String orgUnitId )
    {
        eventData.put( "program", Utils.ID_PROGRAM_TZA360 );
        eventData.put( "programStage", Utils.ID_PROGRAMSTAGE_TZA360 );

        eventData.put( "orgUnit", orgUnitId );
        
        if( !eventData.has( "status"  ))
        {
            eventData.put( "status", "ACTIVE" );  
        }

        if ( eventData.isNull( "dataValues" ) )
        {
            eventData.put( "dataValues", new JSONArray() );
        }
        
        return eventData;
    }
    
    private static JSONObject composeJsonEventParticipant( String checkIn, String teiId, String program, JSONObject eventData )
    {
    	JSONObject eventParticipantData = new JSONObject();
    	
    	eventParticipantData.put( "eventDate", eventData.getString("eventDate") );
    	eventParticipantData.put( "dataValues", new JSONArray() );
    	
    	
    	// Add data values for Event participant
 
    	JSONArray dataValues = eventParticipantData.getJSONArray("dataValues");
    
    	// DE Transaction Type - Group Session
    	JSONObject dataValue = new JSONObject();
    	dataValue.put( "dataElement", Utils.ID_DE_TRANSACTIONTYPE );
    	dataValue.put( "value", "GSE" );
    	dataValues.put( dataValue );

    	// DE Transaction Type - CheckIn
		JSONObject dataValue1 = new JSONObject();
		dataValue1.put( "dataElement", Utils.ID_DE_CHECKIN );
		dataValue1.put( "value",checkIn );
		dataValues.put( dataValue1 );
		
		// DE Event Type
		JSONObject dataValue2 = new JSONObject();
		dataValue2.put( "dataElement", Utils.ID_DE_EVENTTYPE );
		dataValue2.put( "value", EventController.getDataElementValue( eventData, Utils.ID_DE_EVENTTYPE ) );
		dataValues.put( dataValue2 );

    	// DE Event ID
    	JSONObject dataValue3 = new JSONObject();
    	dataValue3.put( "dataElement", Utils.ID_DE_TZA360_EVENTID );
    	dataValue3.put( "value", eventData.getString("event") );
		dataValues.put( dataValue3 );

    	// DE Program
    	JSONObject dataValue4 = new JSONObject();
    	dataValue4.put( "dataElement", Utils.ID_DE_PARTICIPANTS_PROGRAM );
    	dataValue4.put( "value", program );
		dataValues.put( dataValue4 );
		
		eventParticipantData.put( "program", Utils.ID_PROGRAM_CLIENT );
		eventParticipantData.put( "programStage", Utils.ID_PROGRAMSTAGE_TRANSACTION );
		eventParticipantData.put( "orgUnit", eventData.getString( "orgUnit" ) );
		eventParticipantData.put( "trackedEntityInstance", teiId );
		eventParticipantData.put( "status", "ACTIVE" );  

        
        return eventParticipantData;
    }  
    
    private static JSONObject setEventParticipantValue( JSONObject eventData, Boolean increateParpticipant, String paxValue  )
    {
    	JSONArray dataValues = eventData.getJSONArray("dataValues");
    	String participants = getDataElementValue( eventData, Utils.ID_DE_TZA360_PARTICIPANTS );
    	int participantNo = 1;
    	if( participants != null )
    	{
    		if( increateParpticipant == null )
    		{
    			participantNo = Integer.parseInt( paxValue);
    		}
    		else if( increateParpticipant.booleanValue() )
    		{
    			participantNo = Integer.parseInt( participants ) + 1;
    		}
    		else if( !increateParpticipant.booleanValue() )
    		{
    			participantNo = Integer.parseInt( participants ) - 1;
    		}
    		
    	}
    	
    	for( int i = 0; i < dataValues.length(); i++ )
    	{
    		JSONObject dataValue = dataValues.getJSONObject( i );
    		if( dataValue.get( "dataElement" ).equals( Utils.ID_DE_TZA360_PARTICIPANTS ))
    		{
    			 dataValue.put( "value", participantNo );
    			 dataValues.put(i, dataValue);
    			 break;
    		}
    	}
    	
    	return eventData;
    }
    
    private static String getDataElementValue( JSONObject eventData, String deId )
    {
    	JSONArray dataValues = eventData.getJSONArray("dataValues");
    	for( int i = 0; i < dataValues.length(); i++ )
    	{
    		JSONObject dataValue = dataValues.getJSONObject( i );
    		if( dataValue.get( "dataElement" ).equals( deId ))
    		{
    			return dataValue.getString( "value" );
    		}
    	}
    	
    	return null;
    }

    
}
