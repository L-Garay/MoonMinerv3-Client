import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, gql } from '@apollo/client';

// Define mutation
const CREATE_USERACCOUNT = gql`
  mutation createUserAccount($name: String!, $email: String!) {
    createUserAccount(name: $name, email: $email) {
      email
      name
    }
  }
`;

const SignupButton = () => {
  const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [createUserAccount, { loading, error, data }] =
    useMutation(CREATE_USERACCOUNT);

  const handleSignup = async () => {
    // NOTE
    // NOTE
    // NOTE when the code to create the user account in the DB is run BEFORE calling auth0, the mutation is called and the resolver in the server is run
    // when the code to create the user account is run AFTER calling auth0, the mutation is not called and the resolver does not run
    // TODO want to refactor how the app is designed/layed out
    // IDEA:
    // make the very first page you are shown the 'unauthenticated' page/title page
    // there will be no navbar, just the logo and the buttons to sign in/ up
    // Once they have done one of those things sucessfully, they will be shown a loading page transition
    // Then from the loading page, they will be brought to the main menu page/home page/etc.
    // this is where they'll have the option to start a new game, load/delete saved games, or update account information
    // the authentication buttons will then be moved to the navbar
    // Regardless of whether or not they are signing in or up, once they have done either, we will push them directly to the loading page
    // IF THEY SIGN UP
    // we will create a new UserAccount record in the DB
    // since it will be a new account, there won't be any extra data to go and fetch
    // so we can then send them to the main/home page
    // IF SIGN IN
    // we'll use their auth0 credentials to go get their userAccount from the DB
    // we'll then use their userAccount id to get any other relevant data we may need
    // then we will send them to the main/home page

    // const userAccount = await createUserAccount({
    //   variables: { name: 'test name', email: 'test@email.com' },
    // });
    // console.log(userAccount);
    setIsSigningIn(true);
    await loginWithRedirect({ screen_hint: 'signup' });
    setIsSigningIn(false);
    // console.log('can i see me');
    // if (user && isAuthenticated) {

    //   const userAccount = await createUserAccount({
    //     variables: { name: user.name, email: user.email },
    //   });
    //   console.log(userAccount);
    // }
  };

  return (
    <button className="btn btn-primary btn-block" onClick={handleSignup}>
      Sign Up
    </button>
  );
};

export default SignupButton;
