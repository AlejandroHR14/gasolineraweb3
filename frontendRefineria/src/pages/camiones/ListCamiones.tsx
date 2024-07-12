import { Camion } from '@models/Camion'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { ROUTES } from '@routes/Routes'
import { CamionService } from '@services/CamionService'
import { UserService } from '@services/UserService'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ListCamionesPage = () => {
    const columns = [
        {
            key: 'id',
            label: 'Id',
        },
        {
            key: 'nombre',
            label: 'Nombre',
        },
        {
            key: 'capacidad',
            label: 'Capacidad',
        },
        {
            key: 'tipo_combustible',
            label: 'Tipo de combustible',
        },
        {
            key: 'user_id',
            label: 'Usuario',
        },
        {
            key: 'actions',
            label: 'Acciones',
        }
    ]

    const [camiones, setCamiones] = useState<Camion[]>([]);
    const [choferes, setChoferes] = useState<any[]>([]);
    const navigate = useNavigate();

    const fetchCamiones = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user')!);
            const role = user.groups[0];
            if (role == 5) {
                navigate(ROUTES.LIST_RUTAS);
            }
            const response = await CamionService.list();
            setCamiones(response);
        } catch (error) {
            console.error(error)
        }
    }

    const fetchChoferes = async () => {
        try {
            const response = await UserService.listChoferes();
            setChoferes(response);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchChoferes();
        fetchCamiones();
    }, [])

    const goToDetail = (id: number) => {
        navigate(ROUTES.EDITAR_CAMION_PARAMS(id))
    }

    const deleteCamion = async (id: number) => {
        try {
            await CamionService.delete(id);
            fetchCamiones();
        } catch (error) {
            console.error(error)
        }
    }

    const parsearANombre = (id: number) => {
        const chofer = choferes.find((chofer) => chofer.id === id);
        return chofer ? chofer.first_name.concat(' ').concat(chofer.last_name) : '';
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
                                <Button color="success" className='ml-2' onPress={() => navigate(ROUTES.CREAR_CAMION)}>Crear Camion</Button>
                            }
                        </TableColumn>
                    ))}
                </TableHeader>
                <TableBody items={camiones}>
                    {camiones.map((camion) => (
                        <TableRow key={camion.id}>
                            <TableCell>{camion.id}</TableCell>
                            <TableCell>{camion.nombre}</TableCell>
                            <TableCell>{camion.capacidad}</TableCell>
                            <TableCell>{camion.tipo_combustible}</TableCell>
                            <TableCell>{parsearANombre(camion.user_id)}</TableCell>
                            <TableCell className='flex justify-end items-center gap-2'>
                                <Button color="primary" onPress={() => goToDetail(camion.id!)} >
                                    Editar
                                </Button>

                                <Button color="danger" onPress={() => deleteCamion(camion.id!)}>
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

export default ListCamionesPage