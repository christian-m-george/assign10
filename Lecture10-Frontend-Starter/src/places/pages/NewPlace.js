import React from "react";

import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./PlaceForm.css";

import { useHttpClient } from "../../shared/hooks/http-hook";

const NewPlace = () => {
  const { isLoading, sendRequest } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      file: {
        value: "",
        isValid: true,
      },
    },
    false
  );

  //STEP 5 - setup history object
  const history = useHistory();

  //STEP 3 - lets use of custom HTTP hook
  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);

    try {
      console.log(formState);
      await sendRequest(
        "http://localhost:3001/api/places",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          image: formState.inputs.file.value,
          coordinates: {
            lat: 39.709973,
            lng: -75.1213819,
          },
          creator: "u1",
        }),
        {
          "Content-Type": "multipart/form-data",
        }
      );

      //STEP 4
      //Note that we want to redirect user to another page when done
      //if we succeed then we redirect
      //need to IMPORT "userHistory" hook from React-Router-DOM
      //HISTORY object has a PUSH and a REPLACE methods
      //1) go to new page by push to add on a stack
      //2) replacing the current page
      history.push("/");
    } catch (err) {}
  };

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      />
      <Input
        type="file"
        id="place-image"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
  );
};

export default NewPlace;
