import { ROUTES } from '@routes/Routes';
import { Button, Card, CardBody, CardHeader, Input} from '@nextui-org/react';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { SurtidorService } from '@services/SurtidorService';
type DatosForm = {
    nombre: string,
    latitud: string,
    longitud: string
}

function FormSurtidores() {

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
            latitud: '',
            longitud: ''
        },
        reValidateMode: 'onSubmit',
    });

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                SurtidorService.get(parseInt(id!)).then((response) => {
                    setValue('nombre', response.nombre);
                    setValue('latitud', response.latitud);
                    setValue('longitud', response.longitud);
                });

            } catch (error : any) {
                console.error(error);
            }
        }
        if (id) {
            fetchData();
        }

    }, [id, setValue])

    const onFormSubmit: SubmitHandler<DatosForm> = async (data: any) => {
        try {
            if (!id) {
                await SurtidorService.create(data)
                    .then(() => {
                        navigate(ROUTES.LIST_SURTIDOR);
                    })
            } else {
                await SurtidorService.update(parseInt(id), data)
                    .then(() => {
                        navigate(ROUTES.LIST_SURTIDOR);
                    })
            }
        } catch (error: any) {
            console.error(error);
            setError('root', {
                type: 'manual',
                message: 'Error al crear surtidor',
            });
        }
    }

    return (
        <div className='container m-auto h-full'>
            <Card className='w-full max-w-md m-auto'>
                <CardHeader className='text-center' title='Login' />
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
                        {/* latitud */}
                        <Controller
                            control={control}
                            name='latitud'
                            rules={{
                                required: 'La latitud es requerida',
                                validate: (value) => {
                                    if (value === "") {
                                        return "Debes escribir una latitud";
                                    }
                                    return true;
                                }
                            }}
                            render={({ field }) => (
                                <Input {...field}
                                    label='Latitud' placeholder='Latitud' 
                                    errorMessage={errors.latitud?.message}
                                    isRequired
                                    {...errors.latitud && { isInvalid: true }}
                                />
                            )}
                        />

                        {/* longitud */}
                        <Controller
                            control={control}
                            name='longitud'
                            rules={{
                                required: 'La longitud es requerida',
                                validate: (value) => {
                                    if (value === "") {
                                        return "Debes escribir una longitud";
                                    }
                                    return true;
                                }
                            }}
                            render={({ field }) => (
                                <Input {...field}
                                    label='Longitud' placeholder='Longitud'
                                    errorMessage={errors.longitud?.message}
                                    isRequired
                                    {...errors.longitud && { isInvalid: true }}
                                />
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

export default FormSurtidores
