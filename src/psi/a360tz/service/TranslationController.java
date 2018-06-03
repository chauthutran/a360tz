package psi.a360tz.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

public class TranslationController extends HttpServlet {

	private static final long serialVersionUID = -7438526424322302791L;
	
	private static final String DEFAULT_LANGUAGE = "en";

	/**
	 * 
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		try {
			JSONObject responseData = new JSONObject(); 
			
			String[] queryPathList = request.getPathInfo().split("/");
			
			String key = queryPathList[1];
			if( key.equals( Utils.KEY_TRANSLATION_LIST ))
			{
				String language = Utils.getRequestParamValStr( request, "lang");	
				if( language == null  )
				{
					language = TranslationController.DEFAULT_LANGUAGE;
				}		
				responseData = TranslationController.getTranslationList( Utils.KEY_TRANSLATION_KEYWORDS_PROJECT_ID, "language=" + language );
			}
			else if( key.equals( Utils.KEY_TRANSLATION_PROJECT_DETAILS ))
			{
				responseData = TranslationController.getTranslationList( Utils.KEY_TRANSLATION_VERSION_PROJECT_ID, "language=" + DEFAULT_LANGUAGE );
			}
			
			PrintWriter out = response.getWriter();
			response.setContentType("application/json");
			response.setStatus(200);
			out.print(responseData.toString());
			out.flush();

		} catch (Exception e) {

			e.printStackTrace();
		}
	}
	
	public static JSONObject getTranslationList( String projectId, String moreData )
    {
        JSONObject result = new JSONObject();
        
        try
        {
            String url = "https://poeditor.com/api/";
            String data = "api_token=5c217d3fd2a9ea3546fad304b1a6b9cd&action=view_terms&id=" + projectId + "&"
                + moreData;

            HttpURLConnection conn = (HttpURLConnection) new URL( url ).openConnection();

            conn.setRequestProperty( "Accept", "application/json" );
            conn.setRequestProperty( "X-Api-Key", "myApiKey" );
            conn.setRequestMethod( "GET" );
            conn.setDoOutput( true );
            conn.setDoInput( true );

            OutputStreamWriter wr = new OutputStreamWriter( conn.getOutputStream() );
            wr.write( data );
            wr.flush();

            StringBuilder responseMsg = new StringBuilder();
            BufferedReader reader = new BufferedReader( new InputStreamReader( conn.getInputStream() ) );
            String line;
            while ( (line = reader.readLine()) != null )
            {
                responseMsg.append( line );
            }
            reader.close();

            JSONObject list = convertTranslationlist( new JSONObject( responseMsg.toString() ) );
            result.put( "list", list );
                
        }
        catch ( Exception e )
        {

            e.printStackTrace();
        }

        return result;
    }

	public static JSONObject convertTranslationlist( JSONObject translationList )
    {
        JSONObject list = new JSONObject();
        JSONArray jsonArray = translationList.getJSONArray( "list" );
        
        for ( int i = 0; i < jsonArray.length(); i++ )
        {
            String key = jsonArray.getJSONObject( i ).getString( "term" );
            String value = jsonArray.getJSONObject( i ).getJSONObject( "definition" ).getString( "form" );
            list.put( key, value );
        }
        
        return list;
    }
	
}
