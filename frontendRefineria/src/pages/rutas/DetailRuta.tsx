import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Image } from "@nextui-org/react";

import { Card, CardBody, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { RutaService } from '@services/RutaService';
import { Camion } from '@models/Camion';
import { SurtidorService } from '@services/SurtidorService';
import React from 'react';


type Surtidor = {
    id: number;
    surtidor_id: number;
    nombre: string;
    latitud: number;
    longitud: number;
    litros_entrega: number;
    completado: boolean;
    urgente : boolean;
    link_mapa: string;
};

type Ruta = {
    id: number;
    nombre: string;
    fecha: Date;
    camion: Camion;
    litros_combustible: number;
    tipo_combustible: string;
    precio_por_litro: number;
    surtidores: Surtidor[];
};

const DetailRutaPage = () => {
    const { id } = useParams<{ id: string }>();
    const [ruta, setRuta] = useState<Ruta | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();
    const [role, setrole] = useState(0);


    const fetchRuta = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user')!);
            const role = user.groups[0];
            setrole(role);
            const response = await RutaService.get(parseInt(id!));
            const surtidores = await Promise.all(response.surtidores.map(async (surtidor: Surtidor) => {
                const surtidorDetails = await SurtidorService.get(surtidor.surtidor_id);
                return { ...surtidor, nombre: surtidorDetails.nombre, latitud: surtidorDetails.latitud, longitud: surtidorDetails.longitud, link_mapa: `https://www.google.com/maps?q=${surtidorDetails.latitud},${surtidorDetails.longitud}` };
            }));
            setRuta({ ...response, surtidores });
            console.log(ruta);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const optionsTipoCombustible = [
        { value: "1", label: 'Gasolina' },
        { value: "2", label: 'Gas' },
        { value: "3", label: 'Diesel' },
    ]

    const parseTipoCombustible = (tipo: string) => {
        const tipoCombustible = optionsTipoCombustible.find((option) => option.value === tipo);
        return tipoCombustible?.label;
    };

    const marcarComoEntregado = (surtidorId: number, rutaId: number) => async () => {
        try {
            await RutaService.marcarComoEntregado(surtidorId, rutaId);
            fetchRuta();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRuta();
    }, [id]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!ruta) {
        return <div>No se encontró la ruta.</div>;
    }

    const validSurtidores = ruta.surtidores.filter(surtidor => surtidor.latitud && surtidor.longitud);
    const markers = validSurtidores
        .map(surtidor => `${surtidor.latitud},${surtidor.longitud}`)
        .join('|');

    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=512x512&maptype=roadmap&markers=size:mid|color:red|${markers}&zoom=15&key=AIzaSyDiYrVmVxvk0uCYS6qgj78f0CG35j2Lchg`;

    return (
        <div className='container m-auto h-full'>
            <Card
                isBlurred
                className="border-none bg-background/60 dark:bg-default-100/50 max-w-[90%] mt-5"
                shadow="sm"
            >
                <CardBody>
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                        <div className="relative col-span-6 md:col-span-4">
                            <Image
                                alt="Album cover"
                                className="object-cover"
                                height={200}
                                shadow="md"
                                src={mapUrl}
                                width="100%"
                            />
                        </div>

                        <div className="flex flex-col col-span-6 md:col-span-8">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-0">
                                    <h3><strong>Camión:</strong> {ruta.camion.nombre}</h3>
                                    <p><strong>Litros de Combustible:</strong> {ruta.litros_combustible}</p>
                                    <p><strong>Tipo de Combustible:</strong> {parseTipoCombustible(ruta.tipo_combustible)}</p>
                                    <p><strong>Fecha:</strong> {new Date(ruta.fecha).toLocaleDateString()}</p>
                                    <h1 className="text-large font-medium mt-2"><strong>Ruta:</strong> {ruta.nombre}</h1>
                                    {ruta.completado && (
                                        <span className="text-green-500">Ruta completada</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex w-full items-center justify-center">
                                <Table isStriped>
                                    <TableHeader>
                                        <TableColumn>ID</TableColumn>
                                        <TableColumn>Nombre</TableColumn>
                                        <TableColumn>Litros de Entrega</TableColumn>
                                        <TableColumn>Entregado</TableColumn>
                                        <TableColumn>Navegar</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {ruta.surtidores.map(surtidor => (
                                            <TableRow key={surtidor.id} className={surtidor.urgente ? 'bg-red-300' : ''}>
                                                <TableCell>{surtidor.id}</TableCell>
                                                <TableCell>{surtidor.nombre}</TableCell>
                                                <TableCell>{surtidor.litros_entrega}</TableCell>
                                                {role === 5 && surtidor.completado==false ? (
                                                    <TableCell>
                                                        <Button onPress={marcarComoEntregado(surtidor.surtidor_id, ruta.id)}>Marcar como entregado</Button>
                                                    </TableCell>
                                                ) : <TableCell>{surtidor.completado ? 'Sí' : 'No'}</TableCell>}

                                                <TableCell>
                                                    <a href={surtidor.link_mapa} target='blank' className='btn'>Ver en el mapa</a>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default DetailRutaPage;