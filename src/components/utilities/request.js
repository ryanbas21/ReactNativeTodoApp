import { NativeModules } from 'react-native';
import { API_URL } from '@env';

const { ForgeRockModule } = NativeModules;

async function request(method, resource = '', body = null) {
  const json = await ForgeRockModule.getAccessToken();
  const tokens = JSON.parse(json);
  const { tokenType, value } = tokens;
  try {
    const res = await fetch(`${API_URL}todos/${resource}`, {
      method,
      body: body && JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        authorization: `${tokenType} ${value}`,
      },
    });
    if (method === 'DELETE') return;

    const response = await res.json();
    return response;
  } catch (err) {
    console.error(err);
  }
}

export { request };
