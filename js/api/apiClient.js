const API_BASE_URL =
  window.SIMK_CONFIG?.API_BASE_URL ||
  'http://127.0.0.1:8000/api/v1';

class ApiError extends Error {
  constructor(
    message,
    status = 0,
    errors = null
  ) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

const getAccessToken = () => {
  return sessionStorage.getItem(
    'access_token'
  );
};

const clearAccessToken = () => {
  sessionStorage.removeItem(
    'access_token'
  );
};

const apiRequest = async (
  path,
  options = {}
) => {
  const {
    auth = true,
    headers: customHeaders = {},
    body,
    ...fetchOptions
  } = options;

  const headers = {
    Accept: 'application/json',
    ...(body
      ? {
          'Content-Type':
            'application/json',
        }
      : {}),
    ...customHeaders,
  };

  if (auth) {
    const token = getAccessToken();

    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
    }
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...fetchOptions,
        body,
        headers,
      }
    );
  } catch {
    throw new ApiError(
      'Tidak dapat terhubung ke server.',
      0,
      null
    );
  }

  let json = null;

  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok) {
    if (
      response.status === 401 &&
      auth
    ) {
      clearAccessToken();
    }

    throw new ApiError(
      json?.message ||
        'Request gagal.',
      response.status,
      json?.errors || null
    );
  }

  return json;
};

window.ApiError = ApiError;
window.apiRequest = apiRequest;