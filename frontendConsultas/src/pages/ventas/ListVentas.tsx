import { Surtidor } from '@models/Surtidor'
import { Venta } from '@models/Venta'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { ROUTES } from '@routes/Routes'
import { SurtidorService } from '@services/SurtidorService'
import { VentaService } from '@services/VentaService'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// id:                     number;
//     tipo_producto:          string | null;
//     nombre_factura:         string;
//     nit_factura:            string;
//     cliente:                string;
//     correo:                 string;
//     monto:                  number;
//     precio_actual_producto: number;
//     cantidad_producto:      number;
//     fecha_hora:             Date | null;
//     isDeleted:              boolean;
//     surtidor:               number | string;
//     bomba:                  number;
const ListVentasPage = () => {
    const columns = [
        {
            key: 'surtidor',
            label: 'Surtidor',
        },
        {
            key: 'cliente',
            label: 'Cliente',
        },
        {
            key: 'monto',
            label: 'Monto',
        },
        {
            key: 'precio_actual_producto',
            label: 'Precio',
        },
        {
            key: 'cantidad_producto',
            label: 'Cantidad',
        },
        {
            key: 'fecha_hora',
            label: 'Fecha',
        },
        {
            key: 'actions',
            label: 'Acciones',
        }
    ]


    const [ventas, setVentas] = useState<Venta[]>([]);
    const [role, setrole] = useState(0);
    const navigate = useNavigate();

    const fetchVentas = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user')!);
            const role = user.groups[0];
            setrole(role);
            if (role == 3) {
                const response = await VentaService.list();
                setVentas(response)
            } else if (role == 4) {
                const surtidor_id = user.surtidor.id;
                const response = await VentaService.listBySurtidor(surtidor_id);
                setVentas(response)
            }

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchVentas()
    }, [])

    const parseFechaHora = (fechaHora: string) => {
        const date = new Date(fechaHora);
        return date.toLocaleString();
    };

    const anular = async (id: number) => {
        try {
            await VentaService.anular(id)
                .then(() => {
                    fetchVentas();
                })
        } catch (error: any) {
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
                        </TableColumn>
                    ))}
                </TableHeader>
                <TableBody items={ventas}>
                    {ventas.map((venta) => (
                        <TableRow key={venta.id}>
                            <TableCell>{venta.surtidor}</TableCell>
                            <TableCell>{venta.cliente}</TableCell>
                            <TableCell>{venta.monto}Bs</TableCell>
                            <TableCell>{venta.precio_actual_producto}Bs</TableCell>
                            <TableCell>{venta.cantidad_producto}L</TableCell>
                            <TableCell>{venta.fecha_hora ? parseFechaHora(venta.fecha_hora) : null}</TableCell>

                            <TableCell className='flex justify-end items-center gap-2'>
                                {/* si el rol es 3 mostrar el boton*/}
                                {role === 3 && (
                                    <Button color="danger" onPress={() => anular(venta.id)} >
                                        Anular
                                    </Button>
                                )}
                                {/* si el rol es 4 mostrar un texto */}
                                {role === 4 && (
                                    <span>No permitido</span>
                                )}

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ListVentasPage