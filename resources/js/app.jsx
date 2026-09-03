import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { SimkProvider } from './Context/SimkContext';

createInertiaApp({
  title: (title) => title ? `${title} - SIMK-Panti` : 'SIMK-Panti Asuhan Kasih Bunda',
  resolve: (name) => {
    const pages = import.meta.glob(['./Pages/**/*.jsx', './Modules/**/Pages/*.jsx'], { eager: true });
    
    if (pages[`./Pages/${name}.jsx`]) {
      return pages[`./Pages/${name}.jsx`].default;
    }
    if (pages[`./Modules/${name}.jsx`]) {
      return pages[`./Modules/${name}.jsx`].default;
    }

    const parts = name.split('/');
    if (parts.length === 2) {
      const modulePath = `./Modules/${parts[0]}/Pages/${parts[1]}.jsx`;
      if (pages[modulePath]) {
        return pages[modulePath].default;
      }
    }

    throw new Error(`Inertia Page [${name}] not found.`);
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <SimkProvider>
        <App {...props} />
      </SimkProvider>
    );
  },
});
