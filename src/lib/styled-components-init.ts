import React from 'react';

if (typeof globalThis !== 'undefined' && !(globalThis as any).React) {
  (globalThis as any).React = React;
}
