package psi.a360tz.app;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import psi.a360tz.service.Utils;

public class ClearSession extends HttpServlet
{
	private static final long serialVersionUID = -302963909853738077L;

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */ 
	protected void doGet( HttpServletRequest request, HttpServletResponse response )
    throws ServletException, IOException
	{
	    HttpSession session = request.getSession(true);
	    
	    session.setAttribute( Utils.KEY_LOGIN_ORGUNITID, "" );
		session.setAttribute( Utils.KEY_LOGIN_USERNAME, "" );
		session.setAttribute( Utils.KEY_LOGIN_PASSWORD, "" );
		session.setAttribute( Utils.KEY_LOGIN_ORGUNITNAME, "" );
	
		session.setAttribute( Utils.KEY_A360PROGRAM_DETAILS, "" );
		
	}
}