const AuditApi = {
  getLogs(
    params = {}
  ) {
    const query =
      new URLSearchParams();

    Object.entries(
      params
    ).forEach(
      ([
        key,
        value,
      ]) => {
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          value === 'ALL'
        ) {
          return;
        }

        query.set(
          key,
          String(value)
        );
      }
    );

    const queryString =
      query.toString();

    return apiRequest(
      `/pengurus/audit-logs${
        queryString
          ? `?${queryString}`
          : ''
      }`
    );
  },

  getLog(
    publicId
  ) {
    return apiRequest(
      `/pengurus/audit-logs/${encodeURIComponent(
        publicId
      )}`
    );
  },
};

window.AuditApi =
  AuditApi;