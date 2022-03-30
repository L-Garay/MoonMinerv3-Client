import * as React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';

// NOTE may need to rework these interfaces
interface UserAccount {
  id: number;
  name: string;
  email: string;
  games: any[];
}

interface UserAccountData {
  user: UserAccount | null;
  isLoading: boolean;
  errors: boolean;
  errorMessages: (string | undefined)[];
}

// Define Query
const USERACCOUNT = gql`
  query GetUserAccount($email: String) {
    userAccount(email: $email) {
      email
      name
      id
      games {
        id
        updatedAt
        name
      }
    }
  }
`;

// Define mutation
const CREATE_USERACCOUNT = gql`
  mutation createUserAccount($name: String!, $email: String!) {
    createUserAccount(name: $name, email: $email) {
      email
      name
      id
      games {
        id
        updatedAt
        name
      }
    }
  }
`;

const UserAccountContext = React.createContext<UserAccountData>(
  {} as UserAccountData
);
export function UserAccountProvider(props: { children: React.ReactNode }) {
  const [userAccount, setUserAccount] = React.useState<UserAccount | null>(
    null
  );
  const [hasFetchedAccount, setHasFetchedAccount] =
    React.useState<boolean>(false);
  // NOTE there are three different possible loading, error and data sources
  // one source is auth0, second source is getUserAccount query, third source is createUserAccount mutation
  // TODO need to iron out the logic of when to show each possible outcome and how
  const { isLoading, error, user, isAuthenticated } = useAuth0();
  const auth0Account = React.useMemo(() => user, [user]);
  const [
    getUserAccount,
    { loading: getLoading, error: getError, data: getData },
  ] = useLazyQuery(USERACCOUNT, { variables: { email: auth0Account?.email } });
  const [
    createUserAccount,
    { loading: createLoading, error: createError, data: createData },
  ] = useMutation(CREATE_USERACCOUNT);

  // Check for an auth0 account
  // Use auth0 account to try and get UserAccount from DB, if it exists
  React.useEffect(() => {
    if (auth0Account) {
      const asyncAccount = async () => {
        const account = await getUserAccount();
        // Only set state if there is actual data, otherwise leave it null
        if (
          account.data &&
          account.data !== null &&
          account.data.userAccount !== null
        ) {
          setUserAccount(account.data.userAccount);
        }
        setHasFetchedAccount(true);
      };
      asyncAccount();
    }
  }, [auth0Account, userAccount, getUserAccount]);

  // This indicates that the person has an auth0 account but no account in our DB
  // Therefore we need to create a new UserAccount in DB
  React.useEffect(() => {
    if (auth0Account && userAccount === null && hasFetchedAccount) {
      const asyncCreateAccount = async () => {
        const userAccount = await createUserAccount({
          variables: { name: auth0Account.name, email: auth0Account.email },
        });
        setUserAccount(userAccount.data.createUserAccount);
      };
      asyncCreateAccount();
    }
  }, [auth0Account, userAccount, createUserAccount, hasFetchedAccount]);

  let errorMessages: string[] = [];
  if (getError) errorMessages.push(getError.message);
  if (createError) errorMessages.push(createError.message);
  let state = {
    user: userAccount,
    isLoading,
    errors: !!getError || !!createError,
    errorMessages,
  };

  return (
    <UserAccountContext.Provider value={state}>
      {props.children}
    </UserAccountContext.Provider>
  );
}

export function useUserAccount() {
  return React.useContext(UserAccountContext);
}
