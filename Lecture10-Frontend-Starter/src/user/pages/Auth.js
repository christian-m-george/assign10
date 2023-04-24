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


import { useHttpClient } from '../../shared/hooks/http-hook';

//STEP 1: we already use statess so lets setup states in our Auth function 
const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  //STEP 2: to use our custom HTTP hook
  const { isLoading, sendRequest } = useHttpClient();

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

  
  //STEP 3: modify to use our custom HTTP hook
  const authSubmitHandler = async event => {
    event.preventDefault();
 
    if(isLoginMode){

      try {
        //we do not care about the response data for this component
        await sendRequest (
          'http://localhost:3001/api/users/login', 
          'POST',
          JSON.stringify(   
            {
              //'name': formState.inputs.name.value,  
              'email': formState.inputs.email.value,
              'password': formState.inputs.password.value,
          }),
          {
            'Content-Type' : 'application/json'
          }
        );

        auth.login();
        }
        catch(err) {
          console.log(err);
        }
    }
    else 
    {
      try
      {
        await sendRequest(
        'http://localhost:3001/api/users/signup',
        'POST',
        JSON.stringify(
          {
            'name': formState.inputs.name.value,
            'email': formState.inputs.email.value,
            'password': formState.inputs.password.value,
        
          }),
          {
            'Content-Type' : 'application/json'
          },
        );

        auth.login();
      } catch (err) {
        console.log(err);
      }
    }

  };

  return (
    <Card className="authentication">
      <h2>Please Login</h2>
      
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
