package psi.a360tz.service;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class UserAccountController extends HttpServlet {
	
	   
    /**
	 * 
	 */
	private static final long serialVersionUID = 1195934925264490034L;

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

                // Get event list
                if ( key.equals( Utils.KEY_USER_CHECKPASSWORD ) )
                {
                	String checkedPassword = request.getHeader( Utils.REQUEST_PARAM_PASSWORD );
                	 
                	HttpSession session = request.getSession( true );
                	String loginPassword = (String) session.getAttribute( Utils.KEY_LOGIN_PASSWORD );
                	
                	if( checkedPassword.equals( loginPassword ) )
                	{
                		responseInfo.outMessage = "{\"msg\":\"success\"}";
                	}
                	else
                	{

                		responseInfo.outMessage = "{\"msg\":\"fail\"}";
                	}
                	responseInfo.responseCode = 200;
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
    
}
