//lets import useState to manage response data
import React, {useEffect, useState } from 'react';

import UsersList from '../components/UsersList';


const Users = () => {

  // //setup some states in this component
   const [isLoading, setIsLoading] = useState(false);
  
  // //error state
  // const [error, setError] = useState();

  //data state
  const [loadUsers, setLoadedUsers] = useState();


  //Comment our DUMMY users
  // const USERS = [
  //   {
  //     id: 'u1',
  //     name: 'Rowan Student',
  //     image:
  //       'http://elvis.rowan.edu/~burnse/assets/profs-logo.png',
  //     places: 1
  //   }
  // ];

  //Now lets call HTTP request when this page loads 
  //NOTE: we could use fetch(), but request would always send when componenet re-renders
  //which it does when it gets response data and change something on page
  //we would get an infinite loop

  //NOTE: lets use a REACT HOOK  call useEffect 
  //the useEffect allows us to run certain code only when certain dependencies change
  //useEffect has 2 arguments
  //1) code that runs is first arugment
  //2) an arry of depedencies 

    //NOTE: do not turn this function into an ASYNC function 
  // useEffect( ()=> {
  //   fetch('http://localhost:3001/api/users')
  // },[]
  // );

  //useEffect does not want a function that returns a promise 
  //go against what useEffect expects so modify as follows
  useEffect( ()=> {
    const sendRequest = async () => {
      setIsLoading(true);
      try
      {

        const response = await fetch('http://localhost:3001/api/users')

        const responseData = await response.json();

        if(!response.ok) {
          return response.status(500).json( { message: responseData.message  });
        }
        
        setLoadedUsers(responseData.users);

      
      } catch (err) {
        console.log(err.message);
  
      }
      setIsLoading(false);

    };
    sendRequest();
  },[]
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
