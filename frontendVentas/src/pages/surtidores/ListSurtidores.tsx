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
            const user = JSON.parse(localStorage.getItem('user')!);
            const role = user.groups[0];
            if (role != 3) {
                navigate(ROUTES.CREAR_VENTA);
            }
            const response = await SurtidorService.list();
            setSurtidores(response)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchSurtidores()
    }, [])

    const goToDetail = (id: number) => {
        navigate(ROUTES.DETAIL_SURTIDOR_PARAMS(id))
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
                                <Button color="primary" onPress={() => goToDetail(surtidor.id!)} >
                                    Ver detalle
                                </Button>

                                {/* <Button color="danger" onPress={() => deleteCuenta(surtidor.id!)}>
                                    Eliminar
                                </Button> */}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ListSurtidoresPage