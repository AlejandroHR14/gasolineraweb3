import NavBarMenu from '@components/navbar/NavBarMenu';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>  
            <NavBarMenu></NavBarMenu>
            <Outlet></Outlet>
        </>
    )
}

export default Layout