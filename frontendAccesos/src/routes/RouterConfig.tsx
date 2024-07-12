import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./Routes";
import Layout from "@components/layout/layout";
import App from "@pages/home/App";
import ListUserPage from "@pages/users/ListUser";
import FormUser from "@pages/users/FormUser";
import ListSurtidoresPage from "@pages/surtidores/ListSurtidores";
import FormSurtidores from "@pages/surtidores/FormSurtidores";
// import ListCuentasPage from "@pages/cuentas/ListCuentasPage";
// import FormCuentasPage from "@pages/cuentas/form-cuentas/FormCuentasPage";
// import PageBalance from "@pages/balance-general/page";
// import PageEstadoResultados from "@pages/estado-resultados/page";
// import RegistrarTransaccionPage from "@pages/transacciones/form/RegistrarTransaccionPage";
// import ListTransacciones from "@pages/transacciones/ListTransacciones";
// import DetailTransaccion from "@pages/transacciones/detail/DetailTransaccion";

export const routerConfig = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: ROUTES.HOME,
                element: <App></App>
            },
            {
                path: ROUTES.LIST_USUARIO,
                element: <ListUserPage></ListUserPage>
            },
            {
                path: ROUTES.CREAR_USUARIO,
                element: <FormUser></FormUser>
            },
            {
                path: ROUTES.EDITAR_USUARIO,
                element: <FormUser></FormUser>
            },
            {
                path: ROUTES.LIST_SURTIDOR,
                element: <ListSurtidoresPage></ListSurtidoresPage>
            },
            {
                path: ROUTES.CREAR_SURTIDOR,
                element: <FormSurtidores></FormSurtidores>
            },
            {
                path: ROUTES.EDITAR_SURTIDOR,
                element: <FormSurtidores></FormSurtidores>
            },
            // {
            //     path: ROUTES.BALANCE_GENERAL,
            //     element: <PageBalance></PageBalance>
            // },
            // {
            //     path: ROUTES.ESTADO_RESULTADOS,
            //     element: <PageEstadoResultados></PageEstadoResultados>
            // },
            // {
            //     path: ROUTES.LIST_TRANSACCIONES,
            //     element: <ListTransacciones></ListTransacciones>
            // },
            // {
            //     path: ROUTES.REGISTRAR_TRANSACCION,
            //     element: <RegistrarTransaccionPage></RegistrarTransaccionPage>
            // },
            // {
            //     path: ROUTES.DETALLE_TRANSACCION,
            //     element: <DetailTransaccion></DetailTransaccion>
            // }
        ]
    }
])