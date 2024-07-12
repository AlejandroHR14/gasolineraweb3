import { Camion } from '@models/Camion';
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { ROUTES } from '@routes/Routes';
import { RutaService } from '@services/RutaService'; // Asegúrate de crear este servicio
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Ruta = {
    id: number;
    nombre: string;
    fecha: Date;
    camion: Camion;
    litros_combustible: number;
    tipo_combustible: string;
    precio_por_litro: number;
    surtidores: any[];
}

const ListRutasPage = () => {
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
            key: 'fecha',
            label: 'Fecha',
        },
        {
            key: 'camion',
            label: 'Camión',
        },
        {
            key: 'litros_combustible',
            label: 'Litros de Combustible',
        },
        {
            key: 'tipo_combustible',
            label: 'Tipo de Combustible',
        },
        {
            key: 'precio_por_litro',
            label: 'Precio por Litro',
        },
        {
            key: 'cantidad_surtidores',
            label: 'Cantidad de Surtidores',
        },
        {
            key: 'actions',
            label: 'Acciones',
        },
    ];

    const optionsTipoCombustible = [
        { value: "1", label: 'Gasolina' },
        { value: "2", label: 'Gas' },
        { value: "3", label: 'Diesel' },
    ]

    const [role, setrole] = useState(0);

    const [rutas, setRutas] = useState<Ruta[]>([]);
    const navigate = useNavigate();

    const fetchRutas = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user')!);
            const role = user.groups[0];
            setrole(role);
            if (role == 5) {
                // traer las rutas del chofer
                const response = await RutaService.listByChofer(user.id);
                setRutas(response);
            } else if(role == 2) {
                const response = await RutaService.list();
                setRutas(response);
            }

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRutas();
    }, []);

    const goToDetail = (id: number) => {
        navigate(ROUTES.DETAIL_RUTA_PARAMS(id));
    };

    const parseTipoCombustible = (tipo: string) => {
        const tipoCombustible = optionsTipoCombustible.find((option) => option.value === tipo);
        return tipoCombustible?.label;
    };

    return (
        <div className='container m-auto h-full'>
            <Table isStriped>
                <TableHeader columns={columns}>
                    {columns.map((column) => (
                        <TableColumn key={column.key}>
                            {column.label}
                            {/* cuando sea la columna de acciones y cuando el role sea 2 */}
                            {column.key === 'actions' && role === 2 && (
                                <Button color="success" className='ml-2' onPress={() => navigate(ROUTES.CREAR_RUTA)}>
                                    Crear Ruta
                                </Button>
                            )}
                        </TableColumn>
                    ))}
                </TableHeader>
                <TableBody items={rutas}>
                    {rutas.map((ruta) => (
                        <TableRow key={ruta.id}>
                            <TableCell>{ruta.id}</TableCell>
                            <TableCell>{ruta.nombre}</TableCell>
                            <TableCell>{new Date(ruta.fecha).toLocaleDateString()}</TableCell>
                            <TableCell>{ruta.camion.nombre}</TableCell>
                            <TableCell>{ruta.litros_combustible}L</TableCell>
                            <TableCell>{parseTipoCombustible(ruta.tipo_combustible)}</TableCell>
                            <TableCell>{ruta.precio_por_litro}Bs</TableCell>
                            <TableCell>{ruta.surtidores.length}</TableCell>
                            <TableCell className='flex justify-end items-center gap-2'>
                                <Button color="primary" onPress={() => goToDetail(ruta.id)}>
                                    Ver Detalle
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ListRutasPage;