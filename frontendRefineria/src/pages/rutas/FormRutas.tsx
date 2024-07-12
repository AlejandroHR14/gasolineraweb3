import { Camion } from '@models/Camion';
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem } from '@nextui-org/react';
import { ROUTES } from '@routes/Routes';
import { CamionService } from '@services/CamionService';
import { RutaService } from '@services/RutaService';
import { SurtidorService } from '@services/SurtidorService';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type SurtidorForm = {
    surtidor_id: number,
    litros_entrega: number,
}

type RutaForm = {
    nombre: string,
    fecha: string,
    camion: number,
    litros_combustible: number,
    tipo_combustible: string,
    precio_por_litro: number,
    surtidores: SurtidorForm[],
}

const FormRutaPage = () => {
    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, isSubmitting },
    } = useForm<RutaForm>({
        defaultValues: {
            surtidores: [{ surtidor_id: 0, litros_entrega: 0 }],
        },
        reValidateMode: 'onSubmit',
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'surtidores',
    });

    const navigate = useNavigate();
    const [surtidores, setSurtidores] = useState<any[]>([]);
    // camiones 
    const [camiones, setCamiones] = useState<Camion[]>([]);

    const optionsTipoCombustible = [
        { value: 1, label: 'Gasolina' },
        { value: 2, label: 'Gas' },
        { value: 3, label: 'Diesel' },
    ]

    const fetchSurtidores = async () => {
        try {
            const response = await SurtidorService.list();
            setSurtidores(response)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchCamiones = async () => {
        try {
            const response = await CamionService.list();
            setCamiones(response);
        } catch (error) {
            console.error(error
            )
        }
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')!);
        const role = user.groups[0];
        if (role == 5) {
            navigate(ROUTES.LIST_RUTAS);
        }
        fetchSurtidores()
        fetchCamiones()
    }, [])

    const onFormSubmit: SubmitHandler<RutaForm> = async (data) => {
        try {
            const bodyRuta = {
                nombre: data.nombre,
                fecha: data.fecha,
                camion_id: parseInt(data.camion),
                litros_combustible: data.litros_combustible,
                tipo_combustible: parseInt(data.tipo_combustible),
                precio_por_litro: data.precio_por_litro,
                surtidores: data.surtidores,
            }

            await RutaService.create(bodyRuta);
            navigate(ROUTES.LIST_RUTAS);
        } catch (error: any) {
            console.error(error);
            setError('root', {
                type: 'manual',
                message: 'Error al crear la ruta',
            });
        }
    }

    return (
        <div className='container m-auto h-full'>
            <Card className='w-full max-w-md m-auto'>
                <CardHeader>
                    <h1 className='text-2xl font-bold p-2'>Registrar ruta</h1>
                </CardHeader>
                <CardBody>
                    <form noValidate onSubmit={handleSubmit(onFormSubmit)} className='flex flex-col gap-4'>
                        <Input
                            label='Nombre de la Ruta'
                            {...register('nombre', { required: 'Este campo es requerido' })}
                            errorMessage={errors.nombre?.message}
                            isRequired
                            {...errors.nombre && { isInvalid: true }}
                        />
                        <Input
                            label='Fecha'
                            type='date'
                            {...register('fecha', { required: 'Este campo es requerido' })}
                            errorMessage={errors.fecha?.message}
                            isRequired
                            {...errors.fecha && { isInvalid: true }}
                        />
                        <Controller
                            control={control}
                            name='camion'
                            rules={{ required: 'Este campo es requerido' }}
                            render={({ field }) => (
                                <Select placeholder='Camion'
                                    label='Camion'
                                    {...field}
                                    errorMessage={errors.camion?.message}
                                    {...(errors.camion && { isInvalid: true })}
                                    items={camiones.map((opcion) => ({ key: opcion.id, label: opcion.nombre }))}
                                    isRequired
                                >
                                    {camiones.map((opcion) => (
                                        <SelectItem key={opcion.id} value={opcion.id}>
                                            {opcion.nombre}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                        />
                        <Input
                            label='Litros de Combustible'
                            {...register('litros_combustible', { required: 'Este campo es requerido' })}
                            errorMessage={errors.litros_combustible?.message}
                            isRequired
                            type='number'
                            {...errors.litros_combustible && { isInvalid: true }}
                        />
                        <Controller
                            name='tipo_combustible'
                            control={control}
                            rules={{
                                required: 'El tipo de combustible es requerido',
                                validate: (value) => {
                                    if (value === "") {
                                        return "Debes seleccionar un tipo de combustible";
                                    }
                                    return true;
                                }
                            }}
                            render={({ field }) => (
                                <Select placeholder='Tipo de combustible'
                                    label='Tipo de combustible'
                                    {...field}
                                    errorMessage={errors.tipo_combustible?.message}
                                    {...(errors.tipo_combustible && { isInvalid: true })}
                                    items={optionsTipoCombustible.map((opcion) => ({ key: opcion.value, label: opcion.label }))}
                                    selectedKeys={new Set([String(field.value)])}
                                    isRequired
                                >
                                    {optionsTipoCombustible.map((opcion) => (
                                        <SelectItem key={opcion.value} value={opcion.value}>
                                            {opcion.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                        />
                        <Input
                            label='Precio por Litro'
                            {...register('precio_por_litro', { required: 'Este campo es requerido' })}
                            errorMessage={errors.precio_por_litro?.message}
                            isRequired
                            type='number'
                            {...errors.precio_por_litro && { isInvalid: true }}
                        />
                        <h2>Surtidores a entregar</h2>
                        {fields.map((field, index) => (
                            <div key={field.id} className='flex flex-col gap-4'>
                                <Select
                                    label={`Surtidor ${index + 1}`}
                                    {...register(`surtidores.${index}.surtidor_id`, { required: 'Este campo es requerido' })}
                                    errorMessage={errors.surtidores?.[index]?.surtidor_id?.message}
                                    isRequired
                                    {...errors.surtidores?.[index]?.surtidor_id && { isInvalid: true }}
                                >
                                    {surtidores.map(surtidor => (
                                        <SelectItem key={surtidor.id} value={surtidor.id}>
                                            {surtidor.nombre}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Input
                                    label={`Litros de Entrega ${index + 1}`}
                                    {...register(`surtidores.${index}.litros_entrega`, { required: 'Este campo es requerido' })}
                                    errorMessage={errors.surtidores?.[index]?.litros_entrega?.message}
                                    isRequired
                                    type='number'
                                    {...errors.surtidores?.[index]?.litros_entrega && { isInvalid: true }}
                                />
                                <Button
                                    onPress={() => remove(index)}
                                    color='warning'
                                >
                                    Eliminar
                                </Button>
                            </div>
                        ))}
                        <Button
                            onPress={() => append({ surtidor_id: 0, litros_entrega: 0 })}
                            color='secondary'
                        >
                            Agregar Surtidor
                        </Button>
                        {errors.root &&
                            <p className='text-red-500 text-sm text-center font-bold'>
                                {errors.root?.message}
                            </p>
                        }
                        <Button
                            className='w-full'
                            color='success'
                            disabled={isSubmitting}
                            type='submit'
                        >
                            Registrar Ruta
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}

export default FormRutaPage