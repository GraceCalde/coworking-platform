import { createContext, useContext, useState } from 'react';
import { iniciarSesion } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        () => localStorage.getItem('token')
    );

    const [usuario, setUsuario] = useState(() => {
        const usuarioGuardado = localStorage.getItem('usuario');

        return usuarioGuardado
            ? JSON.parse(usuarioGuardado)
            : null;
    });

    async function login(datos) {
        const resultado = await iniciarSesion(datos);

        setToken(resultado.token);
        setUsuario(resultado.usuario);

        localStorage.setItem('token', resultado.token);
        localStorage.setItem(
            'usuario',
            JSON.stringify(resultado.usuario)
        );

        return resultado.usuario;
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        setToken(null);
        setUsuario(null);
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                usuario,
                autenticado: Boolean(token),
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const contexto = useContext(AuthContext);

    if (!contexto) {
        throw new Error(
            'useAuth debe utilizarse dentro de AuthProvider'
        );
    }

    return contexto;
}
