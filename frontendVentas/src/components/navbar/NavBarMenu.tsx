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
                <p className="font-bold text-inherit">Venta de gasolina</p>
            </NavbarBrand>
            <NavbarContent style={{
                justifyContent: 'flex-end'
            }}>
                <NavbarItem className='flex gap-4'>
                    <Link to={ROUTES.CREAR_VENTA}>
                        <Button>Registrar Venta</Button>
                    </Link>
                    <Link to={ROUTES.LIST_VENTA}>
                        <Button>Ventas</Button>
                    </Link>
                    <Link to={ROUTES.LIST_SURTIDOR}>
                        <Button>Surtidores</Button>
                    </Link>
                    <Button color='warning' onClick={limpiarLocalStorageYApi}>Cerrar sesión</Button>

                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}

export default NavBarMenu