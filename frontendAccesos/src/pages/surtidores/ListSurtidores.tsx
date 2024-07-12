import { Surtidor } from '@models/Surtidor'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { ROUTES } from '@routes/Routes'
import { SurtidorService } from '@services/SurtidorService'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ListSurtidoresPage = () => {
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
            key: 'latitud',
            label: 'Latitud',
        },
        {
            key: 'longitud',
            label: 'Longitud',
        },
        {
            key: 'actions',
            label: 'Acciones',
        }
    ]


    const [surtidores, setSurtidores] = useState<Surtidor[]>([]);
    const navigate = useNavigate();

    const fetchSurtidores = async () => {
        try {
            const response = await SurtidorService.list();
            setSurtidores(response)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchSurtidores()
    }, [])

    const goToEdit = (id: number) => {
        navigate(ROUTES.EDITAR_SURTIDOR_PARAMS(id))
    }

    const deleteCuenta = async (id:number) => {
        try {
            await SurtidorService.delete(id);
            fetchSurtidores();
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
                                <Button color="success" className='ml-2' onPress={() => navigate(ROUTES.CREAR_SURTIDOR)}>Crear Surtidor</Button>
                            }
                        </TableColumn>
                    ))}
                </TableHeader>
                <TableBody items={surtidores}>
                    {surtidores.map((surtidor) => (
                        <TableRow key={surtidor.id}>
                            <TableCell>{surtidor.id}</TableCell>
                            <TableCell>{surtidor.nombre}</TableCell>
                            <TableCell>{surtidor.latitud}</TableCell>
                            <TableCell>{surtidor.longitud}</TableCell>
                            <TableCell className='flex justify-end items-center gap-2'>
                                <Button color="primary" onPress={() => goToEdit(surtidor.id!)} >
                                    Editar
                                </Button>

                                <Button color="danger" onPress={() => deleteCuenta(surtidor.id!)}>
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

export default ListSurtidoresPage