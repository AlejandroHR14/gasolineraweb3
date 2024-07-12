import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Badge, Button, Card, CardBody, CardFooter, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { Surtidor } from '@models/Surtidor';



const SurtidorList: React.FC = () => {
  const [tipoProducto, setTipoProducto] = useState<string>('');
  const [surtidorSeleccionado, setSurtidorSeleccionado] = useState<number>(0);
  const [surtidores, setSurtidores] = useState<Surtidor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();


  const fetchSurtidores = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8001/api/surtidores/lista/', {
        tipo_id: tipoProducto,
      });
      setSurtidores(response.data);
    
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSurtidores = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8001/api/surtidores/lista/');
      setSurtidores(response.data);
    
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tipoProducto) {
      fetchSurtidores();
    }else{
      fetchAllSurtidores();
    }
  }, [tipoProducto]);

  const handleProductoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoProducto(event.target.value);
  };

  const handleOpen = (index : number) => {
    console.log(index);
    setSurtidorSeleccionado(index);
    onOpen();
  }

  // ordenar primero los surtidores con mas saldo
  // const sortedSurtidores = surtidores.sort((a, b) => {
  //   const saldoA = a.combustibles?.find(c => c.tipo === tipoProducto)?.saldo || 0;
  //   const saldoB = b.combustibles?.find(c => c.tipo === tipoProducto)?.saldo || 0;
  //   return saldoB - saldoA;
  // });

  return (
    <div className="container m-auto h-full">
      <div className="my-4">
        <label htmlFor="tipoProducto" className="block mb-2">
          Tipo de Producto
        </label>
        <select
          id="tipoProducto"
          value={tipoProducto}
          onChange={handleProductoChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Seleccionar</option>
          <option value="1">Gasolina</option>
          <option value="2">Gas</option>
          <option value="3">Diésel</option>
        </select>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}

      <div className="gap-2 grid grid-cols-2 sm:grid-cols-3">
        {surtidores.map((surtidor, index) => {
          return (
            <Card
              shadow="sm"
              key={index}
              isPressable
              onPress={() => handleOpen(index)}
            >
              <CardBody className="overflow-visible p-0">
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  alt={surtidor.nombre}
                  className="w-full object-cover h-[140px]"
                  src={`https://maps.googleapis.com/maps/api/staticmap?size=512x512&maptype=roadmap&markers=size:mid|color:red|${surtidor.latitud},${surtidor.longitud}&key=AIzaSyDiYrVmVxvk0uCYS6qgj78f0CG35j2Lchg`}
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b>{surtidor.nombre}</b>
                {tipoProducto && <p className="text-default-500">{surtidor.combustibles[0]?.saldo} litros - {surtidor.combustibles[0]?.precio} bs/L</p>}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xs">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Saldos</ModalHeader>
                                <ModalBody>
                                  {surtidores[surtidorSeleccionado].combustibles.map((combustible, index) => {
                                      return (
                                        <div>
                                          <p>Tipo: {combustible.tipo}</p>
                                          <p>Saldo: {combustible.saldo}</p>
                                          <p>Precio: {combustible.precio}</p>
                                        </div>
                                      );
                                    })}
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Cerrar
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
    </div>
  );
};

export default SurtidorList;