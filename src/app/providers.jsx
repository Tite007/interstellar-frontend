// app/providers.jsx
'use client';

import {HeroUIProvider} from "@heroui/system";

export default function Providers({ children }) {
  return (
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  );
}
