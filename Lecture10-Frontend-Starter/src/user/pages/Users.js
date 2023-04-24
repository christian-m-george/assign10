//lets import useState to manage response data
import React, {useEffect, useState } from 'react';

import UsersList from '../components/UsersList';

//STEP 1: import our custom HTTP hook
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {

   //STEP 2
   const { isLoading, sendRequest } = useHttpClient();

  //data state
  const [loadUsers, setLoadedUsers] = useState();

  //useEffect does not want a function that returns a promise 
  //go against what useEffect expects so modify as follows
  useEffect( ()=> {
    const fetchUsers = async () => {
     
      try
      {

        //this is a GET request so don't need to set HTTP method or headers
        const responseData = await sendRequest('http://localhost:3001/api/users');
        
        setLoadedUsers(responseData.users);

      
      } catch (err) {
        console.log(err.message);
  
      }
    };
    fetchUsers();
  },[sendRequest] //specific sendrequest as a depedency, this is a depedent of useEffect
  );

  console.log(loadUsers);
  
  //we should not display this if loadedUsers is undefined 
  return (
    <React.Fragment>
    {!isLoading && loadUsers && <UsersList items={loadUsers} /> }
    </React.Fragment>
    );
};

export default Users;
