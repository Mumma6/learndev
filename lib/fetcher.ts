interface Response {
  error: {
    message: string
  }
  payload: any
}

// Replace this with a generic fetcher function using Axios.

export const fetcher = (...args: [string, Object]) => {
  return fetch(...args)
    .then(async (res) => {
      let payload
      try {
        if (res.status === 204) return null // 204 does not have body
        payload = await res.json()
      } catch (e) {
        /* noop */
      }
      if (res.status === 401) {
        console.log(payload)
        return { error: payload?.error || "Email or password is incorrect" }
      }
      if (res.ok) {
        return payload
      } else {
        return { error: payload?.error || payload?.message } || new Error("Something went wrong")
      }
    })
    .catch((e) => {
      console.log(e, " error catch")
    })
}

/*
////////////  FETCHER /////////////////
import axios from 'axios';

interface Data {
  // Declare the shape of the data you expect to receive from the API
  // For example:
  id: number;
  name: string;
  email: string;
}

interface Options {
  method?: 'GET' | 'POST';
  data?: any;
  headers?: any
}

import axios, { AxiosResponse } from 'axios';

// Add a try-catch here.
const fetcher = <T>(url: string, options: Options = {}): Promise<AxiosResponse<T>>  =>
  axios.request<T>({
    url,
    method: options.method || 'GET',
    data: options.data,
  }).then((res) => res.data);

export default fetcher;

/////////////// Post Fetcher

import axios from 'axios';

interface Options {
  data?: any;
  onSuccess?: (data: any) => void;
}

const fetcher = <T>(url: string, options: Options = {}) =>
  axios.post<T>(url, options.data).then((res) => {
    if (options.onSuccess) options.onSuccess(res.data);
    return res.data;
  });

export default fetcher;

Sen använda den såhär i t ex create modal

import { useSWRMutation } from 'swr';
import fetcher from './fetcher';

function CreateUserForm() {
  const [mutate, { data, error, loading }] = useSWRMutation(
    '/api/users',
    fetcher,
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    mutate({
      data: { name, email },
      onSuccess: (user: User) => {
        console.log(`Successfully created user with ID: ${user.id}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>Failed to create user</div>}
      {loading ? (
        <div>Creating user...</div>
      ) : (
        <>
          <label>
            Name:
            <input type="text" name="name" />
          </label>
          <br />
          <label>
            Email:
            <input type="email" name="email" />
          </label>
          <br />
          <button type="submit">Create</button>
        </>
      )}
    </form>
  );
}

*/
