import { ROUTES } from '@routes/Routes';
import { Button, Card, CardBody, CardHeader, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@nextui-org/react';
// import TablaBalance from '@components/balance/tabla-balance';
// import TablaEstados from '@components/balance/tabla-estados';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Bomba } from '@models/Surtidor';
import { SurtidorService } from '@services/SurtidorService';
import { VentaService } from '@services/VentaService';
type DatosForm = {
    nombre_factura: string;
    nit_factura: string;
    cliente: string;
    correo: string;
    monto: number;
    precio_actual_producto: number;
    cantidad_producto: number;
    surtidor: string;
    bomba: string;
};

function FormVenta() {

    const {
        handleSubmit,
        setError,
        setValue,
        formState: {
            errors,
            isSubmitting
        },
        control,
        watch
    } = useForm<DatosForm>({
        defaultValues: {
            nombre_factura: '',
            nit_factura: '',
            cliente: '',
            correo: '',
            monto: 0,
            precio_actual_producto: 0,
            cantidad_producto: 0,
            surtidor: '',
            bomba: '',
        },
        reValidateMode: 'onSubmit',
    });

    const navigate = useNavigate();
    const [bombas, setBombas] = useState<Bomba[]>([]);

    const precioActualProducto = watch("precio_actual_producto");
    const cantidadProducto = watch("cantidad_producto");
    const bombaId = watch("bomba");

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [mensajeDeSuccess, setmensajeDeSuccess] = useState('');

    useEffect(() => {

        async function fetchBombas() {
            try {
                const user = JSON.parse(localStorage.getItem('user')!);
                const role = user.groups[0];
                if (role != 4) {
                    navigate(ROUTES.LIST_SURTIDOR);
                }
                const surtidor_id = user.surtidor.id;
                const response = await SurtidorService.listBombas(surtidor_id);
                setBombas(response);
            } catch (error: any) {
                console.error(error);
            }
        }
        fetchBombas();
    }, [navigate, setValue])

    useEffect(() => {
        setValue('monto', precioActualProducto * cantidadProducto);
    }, [precioActualProducto, cantidadProducto, setValue]);

    useEffect(() => {
        async function fetchPrecioProducto() {
            if (bombaId) {
                const usuario = JSON.parse(localStorage.getItem('user')!);
                const surtidor_id = usuario.surtidor.id;
                await SurtidorService.precioActual({surtidor_id:surtidor_id, bomba_id:bombaId}).then((response) => {
                    setValue('precio_actual_producto', response.precio);
                });
            }
        }
        fetchPrecioProducto();
    }, [bombaId, bombas, setValue]);

    const onFormSubmit: SubmitHandler<DatosForm> = async (data: any) => {
        try {
            const user = JSON.parse(localStorage.getItem('user')!);
            data.surtidor = user.surtidor.id;
            await VentaService.create(data).then((response) => {
                // si response tiene success
                if (response.success) {
                    setmensajeDeSuccess('Venta creada con éxito');
                    setValue('nombre_factura', '');
                    setValue('nit_factura', '');
                    setValue('cliente', '');
                    setValue('correo', '');
                    setValue('monto', 0);
                    setValue('precio_actual_producto', 0);
                    setValue('cantidad_producto', 0);
                    setValue('surtidor', '');
                    onOpen();
                }else{
                    setError('root', {
                        type: 'manual',
                        message: response.error || 'Error al crear venta',
                    });
                }
                });
        } catch (error: any) {
            console.error(error);
            setError('root', {
                type: 'manual',
                message: error.response.data.error || 'Error al crear venta',
            });
        }
    }

    return (
        <div className='container m-auto h-full'>
            <Card className='w-full max-w-md m-auto'>
                <CardHeader className='text-center' title='Crear Factura' />
                <CardBody>
                    <form noValidate onSubmit={handleSubmit(onFormSubmit)} className='flex flex-col gap-4'>
                        <Controller
                            control={control}
                            name='nombre_factura'
                            rules={{ required: 'El nombre de la factura es requerido' }}
                            render={({ field }) => (
                                <Input {...field}
                                    label='Nombre Factura' placeholder='Nombre Factura'
                                    errorMessage={errors.nombre_factura?.message}
                                    isRequired
                                    {...errors.nombre_factura && { isInvalid: true }}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name='nit_factura'
                            rules={{ required: 'El NIT de la factura es requerido' }}
                            render={({ field }) => (
                                <Input {...field}
                                    label='NIT Factura' placeholder='NIT Factura'
                                    errorMessage={errors.nit_factura?.message}
                                    isRequired
                                    {...errors.nit_factura && { isInvalid: true }}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name='cliente'
                            rules={{ required: 'El cliente es requerido' }}
                            render={({ field }) => (
                                <Input {...field}
                                    label='Cliente' placeholder='Cliente'
                                    errorMessage={errors.cliente?.message}
                                    isRequired
                                    {...errors.cliente && { isInvalid: true }}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name='correo'
                            rules={{ required: 'El correo es requerido' }}
                            render={({ field }) => (
                                <Input {...field}
                                    label='Correo' placeholder='Correo'
                                    errorMessage={errors.correo?.message}
                                    isRequired
                                    {...errors.correo && { isInvalid: true }}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name='bomba'
                            rules={{ required: 'La bomba es requerida' }}
                            render={({ field }) => (
                                <Select placeholder='Bomba'
                                    label='Bomba'
                                    {...field}
                                    errorMessage={errors.bomba?.message}
                                    {...(errors.bomba && { isInvalid: true })}
                                    items={bombas.map((opcion) => ({ key: opcion.id, label: opcion.codigo.concat(' - ', opcion.tipo)}))}
                                    isRequired
                                >
                                    {bombas.map((opcion) => (
                                        <SelectItem key={opcion.id} value={opcion.id}>
                                            {opcion.codigo.concat(' - ', opcion.tipo)}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                        />
                        <Controller
                            control={control}
                            name='precio_actual_producto'
                            rules={{ required: 'El precio del producto es requerido' }}
                            render={({ field }) => (
                                <Input {...field}
                                    label='Precio Actual del Producto' placeholder='Precio Actual del Producto'
                                    type='number'
                                    errorMessage={errors.precio_actual_producto?.message}
                                    isRequired
                                    isReadOnly
                                    {...errors.precio_actual_producto && { isInvalid: true }}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name='cantidad_producto'
                            rules={{ required: 'La cantidad del producto es requerida' }}
                            render={({ field }) => (
                                <Input {...field}
                                    label='Cantidad del Producto' placeholder='Cantidad del Producto'
                                    type='number'
                                    errorMessage={errors.cantidad_producto?.message}
                                    isRequired
                                    {...errors.cantidad_producto && { isInvalid: true }}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name='monto'
                            render={({ field }) => (
                                <Input {...field}
                                    label='Monto' placeholder='Monto'
                                    value={field.value}
                                    isReadOnly
                                />
                            )}
                        />
                        
                        {errors.root && <p className='text-red-500 text-sm text-center font-bold'>{errors.root?.message}</p>}
                        <Button isLoading={isSubmitting} type='submit'>
                            Crear
                        </Button>
                    </form>
                </CardBody>
            </Card>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xs">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Exito</ModalHeader>
                                <ModalBody>
                                    <p>
                                        {mensajeDeSuccess}
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
    )
}

export default FormVenta
