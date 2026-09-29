const buildUserApprovalQuery = (
  filters = {}
) => {
  const params =
    new URLSearchParams();

  Object.entries(
    filters
  ).forEach(
    ([key, value]) => {
      if (
        value === null ||
        value === undefined ||
        value === ''
      ) {
        return;
      }

      params.set(
        key,
        String(value)
      );
    }
  );

  const query =
    params.toString();

  return query
    ? `?${query}`
    : '';
};

const normalizeApprovalUser = (
  user
) => {
  if (!user) {
    return null;
  }

  const roleLabelMap = {
    pengurus_harian:
      'Pengurus Harian',

    pemimpin_lembaga:
      'Pemimpin Lembaga',
  };

  const statusLabelMap = {
    pending:
      'Pending Approval',

    approved:
      'Approved',

    rejected:
      'Rejected',
  };

  return {
    id:
      user.id,

    fullName:
      user.name || '',

    username:
      user.username || '',

    nik:
      user.nik || '',

    email:
      user.email || '',

    phone:
      user.phone || '',

    address:
      user.address || '',

    roleCode:
      user.role || '',

    role:
      user.role_label ||
      roleLabelMap[
        user.role
      ] ||
      user.role ||
      '-',

    statusCode:
      user.account_status || '',

    status:
      statusLabelMap[
        user.account_status
      ] ||
      user.account_status_label ||
      user.account_status ||
      '-',

    registeredAt:
      user.registered_at ||
      null,

    approvedAt:
      user.approved_at ||
      null,

    approvedBy:
      user.approved_by
        ?.name ||
      null,

    approvedByUsername:
      user.approved_by
        ?.username ||
      null,
  };
};

const UserApprovalApi = {
  getUsers(
    filters = {}
  ) {
    return apiRequest(
      `/pemimpin/users${
        buildUserApprovalQuery(
          filters
        )
      }`
    );
  },

  approveUser(
    userId
  ) {
    return apiRequest(
      `/pemimpin/users/${
        encodeURIComponent(
          userId
        )
      }/approve`,
      {
        method: 'PATCH',
      }
    );
  },

  rejectUser(
    userId
  ) {
    return apiRequest(
      `/pemimpin/users/${
        encodeURIComponent(
          userId
        )
      }/reject`,
      {
        method: 'PATCH',
      }
    );
  },

  normalizeUser:
    normalizeApprovalUser,
};

window.UserApprovalApi =
  UserApprovalApi;
