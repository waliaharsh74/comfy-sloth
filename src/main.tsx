
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'


import { ProductsProvider } from "./context/products_context.ts";
import { FilterProvider } from "./context/filter_context.ts";
import { CartProvider } from "./context/cart_context.ts";
import { UserProvider } from "./context/user_context.ts";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById('root')!).render(
    <Auth0Provider
        domain={process.env.REACT_APP_AUTH_DOMAIN!}
        clientId={process.env.REACT_APP_AUTH_CLIENT_ID!}
        authorizationParams={{
            redirect_uri: window.location.origin,
        }}
    >
        <UserProvider>
            <ProductsProvider>
                <FilterProvider>
                    <CartProvider>
                        <StrictMode>
                            <App />
                        </StrictMode>,
                    </CartProvider>
                </FilterProvider>
                {/* /\ */}
            </ProductsProvider>
        </UserProvider >
    </Auth0Provider >
)
