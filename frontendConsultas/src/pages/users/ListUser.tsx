import { User } from '@models/User'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { ROUTES } from '@routes/Routes'
import { UserService } from '@services/UserService'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ListUserPage = () => {
    const columns = [
        {
            key: 'id',
            label: 'Id',
        },
        {
            key: 'username',
            label: 'Username',
        },
        {
            key: 'fullname',
            label: 'Nombre completo',
        },
        {
            key: 'email',
            label: 'Email',
        },
        {
            key: 'role',
            label: 'Role',
        },
        {
            key: 'surtidor_id',
            label: 'Surtidor',
        },
        {
            key: 'actions',
            label: 'Acciones',
        }
    ]

    //     1,Administrador de Accesos
    // 2,Administrador de refinería
    // 3,Administrador de surtidor
    // 4,Vendedor
    // 5,Chofer

    const roles: { [key: number]: string } = {
        1: 'Administrador de Accesos',
        2: 'Administrador de refinería',
        3: 'Administrador de surtidor',
        4: 'Vendedor',
        5: 'Chofer'
    }


    const [usuarios, setUsuarios] = useState<User[]>([]);
    const navigate = useNavigate();

    const fetchUsuarios = async () => {
        try {
            const response = await UserService.list();
            setUsuarios(response)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchUsuarios()
    }, [])

    const goToEdit = (id: number) => {
        navigate(ROUTES.EDITAR_USUARIO_PARAMS(id))
    }

    const deleteCuenta = async (id:number) => {
        try {
            await UserService.delete(id);
            fetchUsuarios();
        } catch (error : any) {
            console.error(error);
        }
    }


    return (
        <div className='container m-auto h-full'>
            <Table isStriped>
                <TableHeader columns={columns}>
                    {columns.map((column) => (
                        <TableColumn key={column.key}
                            className={column.key === 'actions' ? 'flex justify-end items-center' : ''}
                        >
                            {column.label}
                            {column.key === 'actions' &&
                                <Button color="success" className='ml-2' onPress={() => navigate(ROUTES.CREAR_USUARIO)}>Crear Usuario</Button>
                            }
                        </TableColumn>
                    ))}
                </TableHeader>
                <TableBody items={usuarios}>
                    {usuarios.map((usuario) => (
                        <TableRow key={usuario.id}>
                            <TableCell>{usuario.id}</TableCell>
                            <TableCell>{usuario.username}</TableCell>
                            <TableCell>{usuario.first_name} {usuario.last_name}</TableCell>
                            <TableCell>{usuario.email}</TableCell>
                            <TableCell>{roles[usuario.groups[0]]}</TableCell>
                            <TableCell>{usuario.surtidor?.nombre}</TableCell>
                            <TableCell className='flex justify-end items-center gap-2'>
                                <Button color="primary" onPress={() => goToEdit(usuario.id!)} >
                                    Editar
                                </Button>

                                <Button color="danger" onPress={() => deleteCuenta(usuario.id!)}>
                                    Eliminar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ListUserPage