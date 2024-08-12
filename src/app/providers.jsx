// app/providers.jsx
'use client';

import {NextUIProvider} from "@nextui-org/system";

export default function Providers({ children }) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  );
}
