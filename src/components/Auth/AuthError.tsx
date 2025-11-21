// src/components/AuthError.js
import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function AuthError () {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('message');

  return (
    <div>
      <h2>Login Failed</h2>
      <p>{error}</p>
      <button onClick={() => window.location.href = '/login'}>
        Try Again
      </button>
    </div>
  );
};