import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import { ROUTES } from '@routes/Routes'
import api from '@services/interceptors';
import { Link, useNavigate } from 'react-router-dom'

const NavBarMenu = () => {
    const navigate = useNavigate();

    function limpiarLocalStorageYApi() {
        localStorage.clear();
        api.defaults.headers.common['Authorization'] = '';
        navigate(ROUTES.HOME);
    }

    return (
        <Navbar>
            <NavbarBrand>
                <p className="font-bold text-inherit">Refineria</p>
            </NavbarBrand>
            <NavbarContent style={{
                justifyContent: 'flex-end'
            }}>
                <NavbarItem className='flex gap-4'>
                    <Link to={ROUTES.LIST_CAMION}>
                        <Button>Camiones</Button>
                    </Link>
                    <Link to={ROUTES.LIST_RUTAS}>
                        <Button>Rutas</Button>
                    </Link>
                    {/* <Link to={ROUTES.LIST_SURTIDOR}>
                        <Button>Surtidores</Button>
                    </Link> */}
                    <Button color='warning' onClick={limpiarLocalStorageYApi}>Cerrar sesión</Button>

                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}

export default NavBarMenu