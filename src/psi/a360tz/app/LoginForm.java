package psi.a360tz.app;


import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;

import psi.a360tz.service.ResponseInfo;
import psi.a360tz.service.Utils;

public class LoginForm extends HttpServlet {
	private static final long serialVersionUID = -302963909853738077L;

    private static final String PARAM_LOGIN_USERNAME = "@PARAM_LOGIN_USERNAME";
    
    
    // -------------------------------------------------------------------------
    // URLs
    // -------------------------------------------------------------------------

    private static String URL_QUERY_METADATA = Utils.LOCATION_DHIS_SERVER
        + "/api/organisationUnits.json?filter=code:eq:" + LoginForm.PARAM_LOGIN_USERNAME + "&fields=id,name,organisationUnitGroups[id,name],attributeValues[value,attribute[id]],programs[id,name]";
	
    private static final String URL_TZA360_PROGRAMDETAILS = Utils.LOCATION_DHIS_SERVER + "/api/programs/" + Utils.ID_PROGRAM_TZA360 + ".json?fields=expiryPeriodType,expiryDays,completeEventsExpiryDays";

    
    // -------------------------------------------------------------------------
    // POST methods
    // -------------------------------------------------------------------------
    
    
    protected void doPost( HttpServletRequest request, HttpServletResponse response )
        throws ServletException, IOException
    {
        try
        {
            // STEP 1. Get username/password from request
            
            String accessServerUsername = Utils.ACCESS_SERVER_USERNAME;
            String accessServerPassword = Utils.ACCESS_SERVER_PASSWORD;

            String loginUsername = request.getHeader( Utils.REQUEST_PARAM_USERNAME );
            String loginPassword = request.getHeader( Utils.REQUEST_PARAM_PASSWORD );
            
           
            // STEP 2. Check username/password
         
            ResponseInfo responseInfo = LoginForm.processPostMsg( request, loginUsername, loginPassword, accessServerUsername, accessServerPassword );
            HttpSession session = request.getSession( true );                
            if ( responseInfo.responseCode == 200 )
            {
                if( responseInfo.data.getJSONArray( "organisationUnits").length() > 0 )
                {
                	boolean flag = false;
                	String status = "successed";
                	JSONObject orgUnit = responseInfo.data.getJSONArray( "organisationUnits" ).getJSONObject(0);
                	JSONArray ouGroupList = orgUnit.getJSONArray( "organisationUnitGroups");
                	JSONArray programList = orgUnit.getJSONArray( "programs");
                	JSONArray attrValueList = orgUnit.getJSONArray( "attributeValues");
                	
                	// Check PIN
            		for( int i =0; i<attrValueList.length(); i++ )
            		{
            			String attrId = attrValueList.getJSONObject(i).getJSONObject("attribute").getString("id");
            			String value = attrValueList.getJSONObject(i).getString("value");
            			if( attrId.equals( Utils.ATTR_OU_PIN) && value.equals( loginPassword ) )
            			{
            				flag = true;
            			}
            		}
                	
            		if( !flag )
            		{
            			status = "wrongPin";
            		}
            		else // Check TZ A360 Group
            		{
            			flag = false;
            			
            		    if( ouGroupList.length() > 0 )
            			{
	                		for( int i = 0; i<ouGroupList.length(); i++ )
	                		{
	                			String ouGroupId = ouGroupList.getJSONObject(i).getString("id");
	                			if( ouGroupId.equals( Utils.OUGROUP_TZ_A360 ) )
	                			{
	                				flag = true;
	                			}
	                		}
            			}
            		    
            		    if( !flag)
            		    {
            		    	status = "notInGroup";
            		    }
            		}
            		
            		if( flag ) // Check program assigned
            		{
            			flag = false;
            			
            			if( programList.length() > 0 )
            			{
	                		for( int i = 0; i<programList.length(); i++ )
	                		{
	                			String programId = programList.getJSONObject(i).getString("id");
	                			if( programId.equals( Utils.ID_PROGRAM_TZA360 ) )
	                			{
	                				flag = true;
	                			}
	                		}
            			}
            			
            			if( !flag)
            		    {
            				status = "notInProgram";
            		    }
            		}
            		

            		session.setAttribute( Utils.KEY_LOGGED_STATUS, status );
            		
            		if( flag )
            		{
            			session.setAttribute( Utils.KEY_LOGIN_ORGUNITID, orgUnit.getString("id") );
            			session.setAttribute( Utils.KEY_LOGIN_USERNAME, loginUsername );
                		session.setAttribute( Utils.KEY_LOGIN_PASSWORD, loginPassword );
                		session.setAttribute( Utils.KEY_LOGIN_ORGUNITNAME, orgUnit.getString("name") );

                		ResponseInfo responseInfo_Programs = LoginForm.getA360ProgramDetails();
                		session.setAttribute( Utils.KEY_A360PROGRAM_DETAILS, responseInfo_Programs.data.toString() );
            		}
                    
                }
                else
                {
                    session.setAttribute( Utils.KEY_LOGGED_STATUS, "failed" );
                }
            }
            else
            {
                session.setAttribute( Utils.KEY_LOGGED_STATUS, "failed" );
            }

            responseInfo.outMessage = "{\"status\":\"" + session.getAttribute( Utils.KEY_LOGGED_STATUS ) + "\"}";
            
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

    // -----------------------------------------------------------
    // ----- 'GET'/'POST' RELATED Methods -----------------------

    public static ResponseInfo processPostMsg( HttpServletRequest request, String loginUsername, String loginPassword, String accessServerUsername, String accessServerPassword )
        throws UnsupportedEncodingException, ServletException, IOException, Exception
    {
        ResponseInfo responseInfo = null;

        try
        {
            String requestUrl = LoginForm.URL_QUERY_METADATA;
            requestUrl = requestUrl.replace( LoginForm.PARAM_LOGIN_USERNAME, loginUsername );
           
            responseInfo = Utils.sendRequest( Utils.REQUEST_TYPE_GET, requestUrl, null, null );
        }
        catch ( Exception ex )
        {
            System.out.println( "Exception: " + ex.toString() );
        }

        return responseInfo;
    } 
    
    private static ResponseInfo getA360ProgramDetails()
    {
    	ResponseInfo responseInfo = null;
        try
        {
        	String url = LoginForm.URL_TZA360_PROGRAMDETAILS;
            responseInfo = Utils.sendRequest( Utils.REQUEST_TYPE_GET, url, null, null );
        }
        catch ( Exception ex )
        {
            ex.printStackTrace();
        }

        return responseInfo;
    }
}
