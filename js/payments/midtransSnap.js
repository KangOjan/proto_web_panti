const MidtransSnap = (() => {
  let loadPromise = null;

  const getConfig = () => {
    const config =
      window.SIMK_CONFIG || {};

    const environment =
      config.MIDTRANS_ENVIRONMENT ===
      'production'
        ? 'production'
        : 'sandbox';

    const clientKey =
      String(
        config.MIDTRANS_CLIENT_KEY ||
          ''
      ).trim();

    if (!clientKey) {
      throw new Error(
        'Midtrans Client Key belum dikonfigurasi.'
      );
    }

    return {
      environment,
      clientKey,
    };
  };

  const getScriptUrl = (
    environment
  ) => {
    return environment ===
      'production'
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';
  };

  const load = () => {
    if (
      window.snap &&
      typeof window.snap.pay ===
        'function'
    ) {
      return Promise.resolve();
    }

    if (loadPromise) {
      return loadPromise;
    }

    loadPromise =
      new Promise(
        (resolve, reject) => {
          const {
            environment,
            clientKey,
          } = getConfig();

          const existing =
            document.querySelector(
              'script[data-simk-midtrans-snap="true"]'
            );

          if (existing) {
            existing.addEventListener(
              'load',
              () => resolve(),
              {
                once: true,
              }
            );

            existing.addEventListener(
              'error',
              () =>
                reject(
                  new Error(
                    'Gagal memuat Midtrans Snap.'
                  )
                ),
              {
                once: true,
              }
            );

            return;
          }

          const script =
            document.createElement(
              'script'
            );

          script.src =
            getScriptUrl(
              environment
            );

          script.type =
            'text/javascript';

          script.async =
            true;

          script.setAttribute(
            'data-client-key',
            clientKey
          );

          script.setAttribute(
            'data-simk-midtrans-snap',
            'true'
          );

          script.onload =
            () => {
              if (
                window.snap &&
                typeof window
                  .snap.pay ===
                  'function'
              ) {
                resolve();

                return;
              }

              reject(
                new Error(
                  'Midtrans Snap tidak tersedia setelah script dimuat.'
                )
              );
            };

          script.onerror =
            () => {
              loadPromise = null;

              reject(
                new Error(
                  'Gagal memuat Midtrans Snap.'
                )
              );
            };

          document.head.appendChild(
            script
          );
        }
      );

    return loadPromise;
  };

  const pay = async (
    snapToken,
    callbacks = {}
  ) => {
    const token =
      String(
        snapToken || ''
      ).trim();

    if (!token) {
      throw new Error(
        'Snap token tidak tersedia.'
      );
    }

    await load();

    window.snap.pay(
      token,
      {
        onSuccess:
          callbacks.onSuccess,

        onPending:
          callbacks.onPending,

        onError:
          callbacks.onError,

        onClose:
          callbacks.onClose,

        language:
          'id',
      }
    );
  };

  return {
    load,
    pay,
  };
})();

window.MidtransSnap =
  MidtransSnap;