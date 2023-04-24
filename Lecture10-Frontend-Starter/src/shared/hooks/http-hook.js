//STEP 1
//need to import useState to manage loading states
import { useCallback, useState } from 'react';

//STEP 2
//best practice is to prefix with "USE"
export const useHttpClient = () => {

    //STEP 3
    //lets manage the loading state 
    const [isLoading, setIsLoading] = useState(false);


    //STEP 4
    //create a resuable function to send request and should be configuraable
    //NOTE: to avoid infinite loops we will wrap with USECALLBACK
    //so that this function never gets recreated and the component that uses this hook rerenders
    //prevent infinite loops or ineffecient re-render cycles
    const sendRequest =  useCallback( async (url, method = 'GET', body = null, headers = {}) => {

        //STEP 5
        //wrap this into a try/catch to handle error
        setIsLoading(true);
        try {
            //need to call fetch to send to a url and pass configured object params
            const response = await fetch(url, {
                method,
                body,
                headers
            } );

            const responseData = await response.json();

            if(!response.ok) {
                throw responseData.message;            
            }
            
            //want to resturn the response data so that the component that uses this hook
            //and uses this function can handle the data
            setIsLoading(false);
            return responseData;

        }
        catch (err) {
          
            setIsLoading(false);
            throw err; //back to the calling component
        }

    
    }, []); //this function has no depednecies as 2nd argument
    

    //STEP 6
    //return an objectd for all these states and function
    return { isLoading, sendRequest };
};