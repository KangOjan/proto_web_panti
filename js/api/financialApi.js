const FINANCIAL_CATEGORY_LABELS = {
  donation_routine: 'Donasi Rutin',
  infak_zakat: 'Infak/Zakat',
  government_grant:
    'Bantuan Pemerintah/APBD',
  other_income: 'Lainnya',

  consumption: 'Konsumsi',
  education: 'SPP/Pendidikan',
  operational: 'Operasional',

  health: 'Kesehatan',
  other_expense: 'Lainnya',
};

const FINANCIAL_CATEGORY_VALUES = {
  'Donasi Rutin':
    'donation_routine',

  'Infak/Zakat':
    'infak_zakat',

  'Bantuan Pemerintah/APBD':
    'government_grant',

  Konsumsi:
    'consumption',

  'SPP/Pendidikan':
    'education',

  Operasional:
    'operational',

  Kesehatan:
    'health',
};

const normalizePaymentMethodLabel = (
  paymentMethod,
  paymentChannel
) => {
  const value =
    paymentMethod?.value ||
    null;

  if (!value) {
    return '-';
  }

  if (value === 'qris') {
    return 'Scan QRIS Dinamis';
  }

  if (value === 'bank_transfer') {
    return paymentChannel
      ? `Transfer Bank (${paymentChannel})`
      : 'Transfer Bank';
  }

  if (value === 'cash') {
    return 'Tunai';
  }

  if (value === 'midtrans') {
    return paymentChannel
      ? `Midtrans (${paymentChannel})`
      : 'Midtrans';
  }

  return (
    paymentMethod?.label ||
    'Lainnya'
  );
};

const normalizeFinancialTransaction = (
  transaction
) => {
  const typeValue =
    transaction?.type?.value ||
    transaction?.type;

  const categoryValue =
    transaction?.category?.value ||
    transaction?.category;

  const sourceValue =
    transaction?.source?.value ||
    transaction?.source;

  return {
    id:
      transaction.public_id,

    publicId:
      transaction.public_id,

    date:
      transaction.transaction_date,

    type:
      typeValue === 'expense'
        ? 'pengeluaran'
        : 'pemasukan',

    backendType:
      typeValue,

    category:
      FINANCIAL_CATEGORY_LABELS[
        categoryValue
      ] ||
      transaction?.category?.label ||
      categoryValue ||
      'Lainnya',

    categoryValue,

    donorName:
      transaction.party_name ||
      '',

    partyName:
      transaction.party_name ||
      '',

    phone:
      transaction.phone ||
      '',

    description:
      transaction.description ||
      '',

    amount:
      Number(
        transaction.amount ||
        0
      ),

    paymentMethod:
      normalizePaymentMethodLabel(
        transaction.payment_method,
        transaction.payment_channel
      ),

    paymentMethodValue:
      transaction
        ?.payment_method
        ?.value ||
      null,

    paymentChannel:
      transaction.payment_channel ||
      null,

    source:
      sourceValue,

    sourceLabel:
      transaction?.source?.label ||
      sourceValue ||
      '-',

    editable:
      transaction.editable === true,

    donation:
      transaction.donation ||
      null,

    createdBy:
      transaction?.created_by
        ?.name ||
      transaction?.created_by
        ?.username ||
      (
        sourceValue ===
        'donation'
          ? 'Sistem Donasi'
          : '-'
      ),

    createdAt:
      transaction?.timestamps
        ?.created_at ||
      null,

    updatedAt:
      transaction?.timestamps
        ?.updated_at ||
      null,
  };
};

const resolveCategoryValue = (
  transaction
) => {
  if (
    transaction.category ===
    'Lainnya'
  ) {
    return transaction.type ===
      'pengeluaran'
      ? 'other_expense'
      : 'other_income';
  }

  return (
    FINANCIAL_CATEGORY_VALUES[
      transaction.category
    ] ||
    transaction.categoryValue ||
    null
  );
};

const resolvePayment = (
  transaction
) => {
  if (
    transaction.type ===
    'pengeluaran'
  ) {
    return {
      payment_method: null,
      payment_channel: null,
    };
  }

  const method =
    String(
      transaction.paymentMethod ||
      ''
    );

  if (
    method.includes(
      'Transfer Bank'
    )
  ) {
    const match =
      method.match(
        /\(([^)]+)\)/
      );

    return {
      payment_method:
        'bank_transfer',

      payment_channel:
        match?.[1] ||
        null,
    };
  }

  if (
    method
      .toLowerCase()
      .includes('qris')
  ) {
    return {
      payment_method: 'qris',
      payment_channel: null,
    };
  }

  if (
    method
      .toLowerCase()
      .includes('tunai') ||
    method
      .toLowerCase()
      .includes('kas')
  ) {
    return {
      payment_method: 'cash',
      payment_channel: null,
    };
  }

  return {
    payment_method: 'other',
    payment_channel: null,
  };
};

const buildFinancialTransactionPayload = (
  transaction
) => {
  const partyName =
    String(
      transaction.donorName ||
      transaction.partyName ||
      ''
    ).trim();

  let description =
    String(
      transaction.description ||
      ''
    ).trim();

  /*
   * Modal prototype sebelumnya
   * menggabungkan partyName ke description.
   *
   * Backend sekarang menyimpan keduanya
   * secara terpisah, jadi prefix tersebut
   * dihapus sebelum request.
   */
  const descriptionPrefix =
    partyName
      ? `${partyName} - `
      : '';

  if (
    descriptionPrefix &&
    description.startsWith(
      descriptionPrefix
    )
  ) {
    description =
      description
        .slice(
          descriptionPrefix.length
        )
        .trim();
  }

  const payment =
    resolvePayment(
      transaction
    );

  return {
    transaction_date:
      transaction.date,

    type:
      transaction.type ===
      'pengeluaran'
        ? 'expense'
        : 'income',

    category:
      resolveCategoryValue(
        transaction
      ),

    amount:
      Number(
        transaction.amount
      ),

    party_name:
      partyName,

    phone:
      String(
        transaction.phone ||
        ''
      ).trim() ||
      null,

    payment_method:
      payment.payment_method,

    payment_channel:
      payment.payment_channel,

    description:
      description ||
      null,
  };
};

const FinancialApi = {
  getTransactions(
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
      `/pengurus/financial-transactions${
        queryString
          ? `?${queryString}`
          : ''
      }`
    );
  },

  createTransaction(
    payload
  ) {
    return apiRequest(
      '/pengurus/financial-transactions',
      {
        method: 'POST',
        body:
          JSON.stringify(
            payload
          ),
      }
    );
  },

  updateTransaction(
    publicId,
    payload
  ) {
    return apiRequest(
      `/pengurus/financial-transactions/${encodeURIComponent(
        publicId
      )}`,
      {
        method: 'PUT',
        body:
          JSON.stringify(
            payload
          ),
      }
    );
  },

  deleteTransaction(
    publicId
  ) {
    return apiRequest(
      `/pengurus/financial-transactions/${encodeURIComponent(
        publicId
      )}`,
      {
        method:
          'DELETE',
      }
    );
  },

  getDashboard(year) {
    const query =
      year
        ? `?year=${encodeURIComponent(
            year
          )}`
        : '';

    return apiRequest(
      `/pengurus/financial-dashboard${query}`
    );
  },

  getPublicTransparency(
    year
  ) {
    const query =
      year
        ? `?year=${encodeURIComponent(
            year
          )}`
        : '';

    return apiRequest(
      `/financial-transparency${query}`,
      {
        auth: false,
      }
    );
  },

  normalizeTransaction:
    normalizeFinancialTransaction,

  buildTransactionPayload:
    buildFinancialTransactionPayload,
};

window.FinancialApi =
  FinancialApi;