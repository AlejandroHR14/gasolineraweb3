export const ROUTES = {
    HOME: '/',

    LIST_VENTA: '/list-venta',
    CREAR_VENTA: '/crear-venta',

    LIST_SURTIDOR: '/list-surtidor',
    DETAIL_SURTIDOR: '/detail-surtidor/:id',
    DETAIL_SURTIDOR_PARAMS: (id: number) => `/detail-surtidor/${id}`,
}