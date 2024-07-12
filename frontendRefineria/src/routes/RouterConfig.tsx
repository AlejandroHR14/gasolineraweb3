import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./Routes";
import Layout from "@components/layout/layout";
import App from "@pages/home/App";
import FormRutaPage from "@pages/rutas/FormRutas";
import ListRutasPage from "@pages/rutas/ListRutas";
import DetailRutaPage from "@pages/rutas/DetailRuta";
import ListCamionesPage from "@pages/camiones/ListCamiones";
import FormCamiones from "@pages/camiones/FormCamiones";

export const routerConfig = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: ROUTES.HOME,
                element: <App></App>
            },
            {
                path: ROUTES.LIST_CAMION,
                element: <ListCamionesPage></ListCamionesPage>
            },
            {
                path: ROUTES.CREAR_CAMION,
                element: <FormCamiones></FormCamiones>
            },
            {
                path: ROUTES.EDITAR_CAMION,
                element: <FormCamiones></FormCamiones>
            },
            {
                path: ROUTES.LIST_RUTAS,
                element: <ListRutasPage></ListRutasPage>
            }
            ,
            {
                path: ROUTES.CREAR_RUTA,
                element: <FormRutaPage></FormRutaPage>
            },
            {
                path: ROUTES.DETAIL_RUTA,
                element: <DetailRutaPage></DetailRutaPage>
            }
        ]
    }
])