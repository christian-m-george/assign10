import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

//STEP 1: we already use statess so lets setup states in our Auth function 
const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  // //Setup a new state for Loading
  // const [isLoading, setIsLoading] = useState(false);

  // //Setup a new State for Error
  // //intitially we have not error so it set to undefined
  // const [error, setError] = useState();


  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  
 //STEP 1: first convert this function to an async
  const authSubmitHandler = async event => {
    event.preventDefault();


    //STEP 3 - we only want to send this to "singup request" if we are in SIGNUP mode
    if(isLoginMode){

       //STEP 5 - copy the TRY/CATCH for the Signup request
      try
      {
        //chank this to a LOGIN route
        const response = await fetch('http://localhost:3001/api/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          //just email and password
          body: JSON.stringify(   
            {
              //'name': formState.inputs.name.value,  
              'email': formState.inputs.email.value,
              'password': formState.inputs.password.value,
          
          })
        });

        //when using Fetch API the reesponse has all response data
        //but does not have parsed body 
        const responseData = await response.json();
        console.log(responseData);

      } catch (err) {
        console.log(err);
      }
    }
    else 
    {
      //STEP 2
      //instead of console.log any inputs we will not send HTTP request
      //lets use the fetch() method which is a built in API
      //console.log(formState.inputs);
      //fetch takes 2 arguents (route and request config)
      //1) the rout path
      //2) HTTP method
      //3) header
      //NOTE: fetch returns a promise and returns a response
      try
      {
        const response = await fetch('http://localhost:3001/api/users/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify(
            {
              'name': formState.inputs.name.value,
              'email': formState.inputs.email.value,
              'password': formState.inputs.password.value,
          
          })
        });

        //when using Fetch API the reesponse has all response data
        //but does not have parsed body 
        const responseData = await response.json();
        console.log(responseData);

      } catch (err) {
        console.log(err);
      }
}
  //NOTE: this will only run when we are done with parsing the response 
    auth.login();
  };

  return (
    <Card className="authentication">
      <h2>Please Login</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <Input
            element="input"
            id="name"
            type="text"
            label="Your Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name."
            onInput={inputHandler}
          />
        )}
        <Input
          element="input"
          id="email"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid password, at least 5 characters."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? 'LOGIN' : 'REGISTER'}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
         {isLoginMode ? 'REGISTER' : 'LOGIN'}
      </Button>
    </Card>
  );
};

export default Auth;
