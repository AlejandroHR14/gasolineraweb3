export const ROUTES = {
    HOME: '/',

    LIST_USUARIO: '/list-usuario',
    CREAR_USUARIO: '/crear-usuario',
    EDITAR_USUARIO: '/editar-usuario/:id',
    EDITAR_USUARIO_PARAMS: (id: number) => `/editar-usuario/${id}`,

    LIST_SURTIDOR: '/list-surtidor',
    CREAR_SURTIDOR: '/crear-surtidor',
    EDITAR_SURTIDOR: '/editar-surtidor/:id',
    EDITAR_SURTIDOR_PARAMS: (id: number) => `/editar-surtidor/${id}`,
}