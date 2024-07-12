import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import { ROUTES } from '@routes/Routes'
import api from '@services/interceptors';
import { Link } from 'react-router-dom'

const NavBarMenu = () => {

    return (
        <Navbar>
            <NavbarBrand>
                <p className="font-bold text-inherit">Consulta de gasolina</p>
            </NavbarBrand>
            <NavbarContent style={{
                justifyContent: 'flex-end'
            }}>
                <NavbarItem className='flex gap-4'>
                    <Link to={ROUTES.CREAR_VENTA}>
                        <Button>Sistema de Ventas</Button>
                    </Link>
                    <Link to={ROUTES.LIST_VENTA}>
                        <Button>Sistema de Acceso</Button>
                    </Link>
                    <Link to={ROUTES.LIST_SURTIDOR}>
                        <Button>Sistema de refineria</Button>
                    </Link>
                    <Button color='warning'>Voy a feria? :)</Button>

                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}

export default NavBarMenu