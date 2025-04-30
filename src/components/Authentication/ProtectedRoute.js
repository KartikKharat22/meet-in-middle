import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ component: Component, requiredRole, ...rest }) {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      element={(props) => {
        if (!user) {
          return (
            <Navigate
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
              replace 
            />
          );
        }

        if (requiredRole && user.role !== requiredRole) {
          return <Navigate to="/" replace />; 
        }

        return <Component {...props} />;
      }}
    />
  );
}

export default ProtectedRoute;