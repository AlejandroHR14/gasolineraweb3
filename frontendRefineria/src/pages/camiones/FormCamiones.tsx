import { ROUTES } from '@routes/Routes';
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem } from '@nextui-org/react';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { User } from '@models/User';
import { CamionService } from '@services/CamionService';
import { UserService } from '@services/UserService';
type DatosForm = {
    nombre: string,
    capacidad: number,
    tipo_combustible: string,
    user_id: number
}

function FormCamiones() {

    const { id } = useParams<{ id: string }>();

    const {
        handleSubmit,
        setError,
        setValue,
        formState: { errors, isSubmitting },
        control
    } = useForm<DatosForm>({
        defaultValues: {
            nombre: '',
            capacidad: 0,
            tipo_combustible: '',
            user_id: 0
        },
        reValidateMode: 'onSubmit',
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const optionsTipoCombustible = [
        { value: 1, label: 'Gasolina' },
        { value: 2, label: 'Gas' },
        { value: 3, label: 'Diesel' },
    ]

    const [users, setusers] = useState<User[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                CamionService.get(parseInt(id!)).then((response) => {
                    setValue('nombre', response.nombre);
                    setValue('capacidad', response.capacidad);
                    optionsTipoCombustible.forEach((option) => {
                        if (option.label === response.tipo_combustible) {
                            setValue('tipo_combustible', String(option.value));
                        }
                    });
                    setValue('user_id', response.user_id);
                });

            } catch (error: any) {
                console.error(error);
            }
        }
        async function fetchUsers() {
            try {
                const response = await UserService.listChoferes();
                setusers(response);
            } catch (error) {
                console.error(error)
            }
        }

        fetchUsers();
        if (id) {
            fetchData();
        }
    }, [id, setValue])

    const onFormSubmit: SubmitHandler<DatosForm> = async (data: any) => {
        try {
            if (!id) {
                data.user_id = parseInt(data.user_id);
                data.tipo_combustible_id = parseInt(data.tipo_combustible);
                // borrar el tipo de combustible
                delete data.tipo_combustible;
                await CamionService.create(data).then(() => {
                    navigate(ROUTES.LIST_CAMION);
                });
            } else {
                data.user_id = parseInt(data.user_id);
                data.tipo_combustible_id = parseInt(data.tipo_combustible);
                // borrar el tipo de combustible
                delete data.tipo_combustible;
                await CamionService.update(parseInt(id), data).then(() => {
                    navigate(ROUTES.LIST_CAMION);
                });
            }
        } catch (error: any) {
            console.error(error);
            setError('root', {
                type: 'manual',
                message: error.response.data.error,
            });
        }
    }

    return (
        <div className='container m-auto h-full'>
            <Card className='w-full max-w-md m-auto'>
                <CardHeader>
                    <h1 className='text-2xl font-bold p-2'>Registrar camion</h1>
                </CardHeader>
                <CardBody>
                    <form noValidate onSubmit={handleSubmit(onFormSubmit)} className='flex flex-col gap-4'>
                        <Controller
                            control={control}
                            name='nombre'
                            rules={{
                                required: 'El nombre es requerido',
                                validate: (value) => {
                                    if (value === "") {
                                        return "Debes escribir un nombre";
                                    }
                                    return true;
                                }
                            }}
                            render={({ field }) => (
                                <Input {...field}
                                    label='Nombre' placeholder='Nombre'
                                    errorMessage={errors.nombre?.message}
                                    isRequired
                                    {...errors.nombre && { isInvalid: true }}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name='capacidad'
                            rules={{
                                required: 'La capacidad es requerida',
                                validate: (value) => {
                                    if (value === 0) {
                                        return "Debes escribir una capacidad";
                                    }
                                    return true;
                                }
                            }}
                            render={({ field }) => (
                                <Input {...field}
                                    label='Capacidad' placeholder='Capacidad' type='number'
                                    errorMessage={errors.capacidad?.message}
                                    isRequired
                                    {...errors.capacidad && { isInvalid: true }}
                                />
                            )}
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

                        <Controller
                            control={control}
                            name='user_id'
                            rules={{ required: 'La usuario es requerido' }}
                            render={({ field }) => (
                                <Select placeholder='Chofer'
                                    label='Chofer'
                                    {...field}
                                    errorMessage={errors.user_id?.message}
                                    {...(errors.user_id && { isInvalid: true })}
                                    items={users.map((opcion) => ({ key: opcion.id, label: opcion.first_name.concat(' ', opcion.last_name) }))}
                                    selectedKeys={new Set([String(field.value)])}
                                    isRequired
                                >
                                    {users.map((opcion) => (
                                        <SelectItem key={opcion.id} value={opcion.id}>
                                            {opcion.first_name.concat(' ', opcion.last_name)}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                        />

                        {errors.root &&
                            <p
                                className='text-red-500 text-sm text-center font-bold'
                            >{errors.root?.message}</p>
                        }
                        <Button
                            isLoading={isSubmitting}
                            type='submit'
                        >
                            {id ? 'Editar' : 'Crear'}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}

export default FormCamiones
