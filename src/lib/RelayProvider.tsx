'use client';

import { ReactNode, useMemo } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { createRelayEnvironment } from './relay-environment';

export function RelayProvider({ children }: { children: ReactNode }) {
  const environment = useMemo(() => createRelayEnvironment(), []);
  return <RelayEnvironmentProvider environment={environment}>{children}</RelayEnvironmentProvider>;
}
