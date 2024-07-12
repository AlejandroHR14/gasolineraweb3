export const ROUTES = {
    HOME: '/',

    LIST_CAMION: '/list-camion',
    CREAR_CAMION: '/crear-camion',
    EDITAR_CAMION: '/editar-camion/:id',
    EDITAR_CAMION_PARAMS: (id: number) => `/editar-camion/${id}`,

    LIST_RUTAS: '/list-ruta',
    CREAR_RUTA: '/crear-ruta',
    DETAIL_RUTA: '/detail-ruta/:id',
    DETAIL_RUTA_PARAMS: (id: number) => `/detail-ruta/${id}`,
}