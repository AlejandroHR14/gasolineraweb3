import { Surtidor } from "@models/Surtidor";
import { Avatar, Badge, Button, Card, CardBody, CardFooter, CardHeader, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { ROUTES } from "@routes/Routes";
import { SurtidorService } from "@services/SurtidorService";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const DetailSurtidor = () => {

    const { id } = useParams<{ id: string }>();
    const [isOpenBomba, setIsOpenBomba] = useState(false);
    const [isOpenCombustible, setIsOpenCombustible] = useState(false);
    const [codigo, setCodigo] = useState('');
    const [precioActual, setprecioActual] = useState(0);
    const [saldo, setSaldo] = useState("0");
    const [tipo_id, setTipoId] = useState(0);

    const [combustibles, setCombustibles] = useState([
        { id: 1, tipo: 'Gasolina' },
        { id: 2, tipo: 'Gas' },
        { id: 3, tipo: 'Diesel' }
    ]);

    const handleChangeCodigo = (e: any) => setCodigo(e.target.value)
    const handleChangeTipo = (e: any) => setTipoId(e.target.value)
    const handleChangeSaldo = (e: any) => setSaldo(e.target.value)

    const [surtidor, setSurtidor] = useState<Surtidor>({ id: 0, nombre: '', latitud: '', longitud: '', bombas: [], combustibles: [] });
    const navigate = useNavigate();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [mensajeDeError, setMensajeDeError] = useState('');


    useEffect(() => {
        async function fetchData() {
            const user = JSON.parse(localStorage.getItem('user')!);
            const role = user.groups[0];
            if (role != 3) {
                navigate(ROUTES.CREAR_VENTA);
            }
            try {
                SurtidorService.get(parseInt(id!)).then((response) => {
                    setSurtidor(response);
                    response.bombas.map((bomba) => {
                        if (bomba.tipo == "Gasolina") {
                            bomba.img = "/bomba.png"
                        } else if (bomba.tipo == "Gas") {
                            bomba.img = "/gas.png"
                        } else if (bomba.tipo == "Diesel") {
                            bomba.img = "/diesel.png"
                        }
                    });
                });
            } catch (error: any) {
                console.error(error);
            }
        }
        if (id) {
            fetchData();
        }
    }, [id])

    const onOpenBomba = () => {
        setIsOpenBomba(true);
    };

    const onOpenBombaChange = (open: boolean) => {
        setIsOpenBomba(open);
    };

    const onOpenCombustible = () => {
        setIsOpenCombustible(true);
    };

    const onOpenCombustibleChange = (open: boolean) => {
        setIsOpenCombustible(open);
    };

    const onSubmitBomba = async () => {
        try {
            if (id) {
                if (codigo == "") {
                    setMensajeDeError('El código de la bomba es requerido');
                    onOpen();
                    return
                }
                if (tipo_id == 0) {
                    setMensajeDeError('El tipo de combustible es requerido');
                    onOpen();
                    return
                }
                await SurtidorService.createBomba({ codigo, surtidor_id: parseInt(id), tipo_id: tipo_id })
                    .then(() => {
                        setCodigo('');
                        setTipoId(0);
                        setIsOpenBomba(false);
                        SurtidorService.get(parseInt(id)).then((response) => {
                            setSurtidor(response);
                        });
                    })
            }
        } catch (error: any) {
            console.error(error);
        }
    };

    const onSubmitCombustible = async () => {
        try {
            if (id) {
                if (tipo_id == 0) {
                    setMensajeDeError('El tipo de combustible es requerido');
                    onOpen();
                    return
                }
                if (saldo == "") {
                    setMensajeDeError('El saldo es requerido');
                    onOpen();
                    return
                }
                if (precioActual <= 0) {
                    setMensajeDeError('El precio actual es requerido');
                    onOpen();
                    return
                }
                await SurtidorService.insertTipoCombustible({ saldo, surtidor_id: parseInt(id), tipo_id: tipo_id, precio: precioActual})
                    .then(() => {
                        setCodigo('');
                        setTipoId(0);
                        setprecioActual(0.0);
                        setIsOpenCombustible(false);
                        SurtidorService.get(parseInt(id)).then((response) => {
                            setSurtidor(response);
                        });
                    })
            }
        } catch (error: any) {
            console.error(error);
        }
    };

    return (
        <div className='container m-auto h-full'>
            <Card className="max-w-[500px] m-auto" >
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <small className="text-default-500"><strong>Id:</strong> {surtidor.id}</small>
                    <h4 className="font-bold text-large">{surtidor.nombre}</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                    <Image
                        alt="Card background"
                        className="object-cover rounded-xl"
                        width={'100%'}
                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${surtidor.latitud},${surtidor.longitud}&zoom=14&size=500x500&maptype=roadmap&markers=color:red%7C${surtidor.latitud},${surtidor.longitud}&key=AIzaSyDiYrVmVxvk0uCYS6qgj78f0CG35j2Lchg`}
                    />
                </CardBody>
            </Card>
            <div className="flex gap-4 items-center mt-4">
                <Button color='warning' onPress={onOpenBomba}>Crear bomba</Button>
                <Modal
                    isOpen={isOpenBomba}
                    onOpenChange={onOpenBombaChange}
                    placement="top-center"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Crear bomba</ModalHeader>
                                <ModalBody>
                                    <Input
                                        autoFocus
                                        name="codigo"
                                        label="Codigo"
                                        value={codigo}
                                        onChange={handleChangeCodigo}
                                        required
                                        placeholder="Ingresa el código de la bomba"
                                        variant="bordered"
                                    />
                                    {/* select de tipo */}
                                    <Select placeholder='Tipo'
                                        label='Tipo'
                                        items={combustibles.map((opcion) => ({ key: opcion.id, label: opcion.tipo }))}
                                        value={tipo_id}
                                        onChange={handleChangeTipo}
                                        isRequired
                                    >
                                        {combustibles.map((opcion) => (
                                            <SelectItem key={opcion.id} value={opcion.tipo}>
                                                {opcion.tipo}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button color="primary" onPress={onSubmitBomba}>
                                        Crear
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                <Button color='warning' onPress={onOpenCombustible}>Insertar tipo combustible</Button>
                <Modal
                    isOpen={isOpenCombustible}
                    onOpenChange={onOpenCombustibleChange}
                    placement="top-center"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Insertar Tipo Combustible</ModalHeader>
                                <ModalBody>
                                    {/* input para precio actual float */}
                                    <Input
                                        autoFocus
                                        name="precio"
                                        label="Precio Actual"
                                        value={precioActual}
                                        type="number"
                                        onChange={(e) => setprecioActual(parseFloat(e.target.value))}
                                        required
                                        placeholder="Ingresa el precio actual"
                                        variant="bordered"
                                    />

                                    <Input
                                        autoFocus
                                        name="saldo"
                                        label="Saldo"
                                        value={saldo}
                                        type="number"
                                        onChange={handleChangeSaldo}
                                        required
                                        placeholder="Ingresa el código de la bomba"
                                        variant="bordered"
                                    />
                                    {/* select de tipo */}
                                    <Select placeholder='Tipo'
                                        label='Tipo'
                                        items={combustibles.map((opcion) => ({ key: opcion.id, label: opcion.tipo }))}
                                        value={tipo_id}
                                        onChange={handleChangeTipo}
                                        isRequired
                                    >
                                        {combustibles.map((opcion) => (
                                            <SelectItem key={opcion.id} value={opcion.tipo}>
                                                {opcion.tipo}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button color="primary" onPress={onSubmitCombustible}>
                                        Insertar
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xs">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Error</ModalHeader>
                                <ModalBody>
                                    <p>
                                        {mensajeDeError}
                                    </p>
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

            <h1 className='text-2xl font-bold p-2'>Bombas</h1>
            <div className="flex gap-4 items-center mb-4">
                {surtidor.bombas.map((bomba) => (
                    <Badge content={bomba.codigo} color="danger" shape="rectangle" showOutline={false}>
                        <Avatar
                            isBordered
                            radius="md"
                            src={bomba.img}
                        />
                    </Badge>
                ))}
            </div>

            {/* saldos disponibles */}
            <h1 className='text-2xl font-bold p-2'>Saldos Combustibles</h1>
            {/* {surtidor.combustibles!.map((combustible) => (
                <div className='flex flex-col gap-4' key={combustible.id}>
                    <p><strong>Combustible:</strong> {combustible.tipo}</p>
                    <p><strong>Saldo:</strong> {combustible.saldo}</p>
                </div>
            ))} */}
            <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                {surtidor.combustibles!.map((combustible, index) => (
                    <Card shadow="sm" key={index} isPressable onPress={() => console.log("item pressed")}>
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={combustible.tipo}
                                className="w-full object-cover h-[140px]"
                                // src={item.img}
                                src="/surtidor.jpg"
                            />
                        </CardBody>
                        <CardFooter className="text-small justify-between">
                            <b>{combustible.tipo}</b>
                            <p className="text-default-500">{combustible.saldo}L</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default DetailSurtidor