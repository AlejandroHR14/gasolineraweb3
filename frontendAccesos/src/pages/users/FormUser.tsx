import { ROUTES } from '@routes/Routes';
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem } from '@nextui-org/react';
// import TablaBalance from '@components/balance/tabla-balance';
// import TablaEstados from '@components/balance/tabla-estados';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserService } from '@services/UserService';
import { Surtidor } from '@models/Surtidor';
import { SurtidorService } from '@services/SurtidorService';
type DatosForm = {
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    email: string,
    groups: string,
    surtidor_id: string,
}

function FormUser() {

    const { id } = useParams<{ id: string }>();

    const {
        handleSubmit,
        setError,
        setValue,
        formState: { errors, isSubmitting },
        control
    } = useForm<DatosForm>({
        defaultValues: {
            username: '',
            password: '',
            first_name: '',
            last_name: '',
            email: '',
            groups: "0",
            surtidor_id: "",
        },
        reValidateMode: 'onSubmit',
    });

    const optionsRoles = [
        { value: "1", label: 'Administrador de Accesos' },
        { value: "2", label: 'Administrador de refinería' },
        { value: "3", label: 'Administrador de surtidor' },
        { value: "4", label: 'Vendedor' },
        { value: "5", label: 'Chofer' },
    ]

    const navigate = useNavigate();
    const [surtidores, setSurtidores] = useState<Surtidor[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                UserService.get(parseInt(id!)).then((response) => {
                    setValue('username', response.username);
                    setValue('first_name', response.first_name);
                    setValue('last_name', response.last_name);
                    setValue('email', response.email);
                    setValue('groups', response.groups[0].toString());
                    setValue('surtidor_id', response.surtidor?.id.toString() ?? "");
                    if (response.surtidor === null) {
                        setValue('surtidor_id', "");
                    }
                });

            } catch (error: any) {
                console.error(error);
            }
        }
        async function fetchSurtidores() {
            try {
                const response = await SurtidorService.list();
                setSurtidores(response);
            } catch (error: any) {
                console.error(error);
            }
        }
        if (id) {
            fetchData();
        }
        fetchSurtidores();
    }, [id, setValue])

    const onFormSubmit: SubmitHandler<DatosForm> = async (data: any) => {
        try {
            // si no hay id, es un nuevo usuario
            if (!id) {
                // si no hay surtidor seleccionado, se manda vacío
                if (data.surtidor_id === 0) {
                    data.surtidor_id = "";
                }
                await UserService.create(data)
                    .then(() => {
                        navigate(ROUTES.LIST_USUARIO);
                    })
            } else {
                if (data.surtidor_id === 0) {
                    data.surtidor_id = "";
                }
                await UserService.update(parseInt(id), data)
                    .then(() => {
                        navigate(ROUTES.LIST_USUARIO);
                    })
            }
        } catch (error: any) {
            console.error(error);
            setError('root', {
                type: 'manual',
                message: 'Error al crear usuario',
            });
        }
    }

    return (
        <div className='container m-auto h-full'>
            <Card className='w-full max-w-md m-auto'>
                <CardHeader>
                    <h1>{id ? 'Editar Usuario' : 'Crear Usuario'}</h1>
                </CardHeader>
                <CardBody>
                    <form noValidate onSubmit={handleSubmit(onFormSubmit)} className='flex flex-col gap-4'>
                        <Controller
                            control={control}
                            name='username'
                            rules={{
                                required: 'El username es requerido',
                                validate: (value) => {
                                    if (value === "") {
                                        return "Debes escribir un nombre de usuario";
                                    }
                                    return true;
                                }
                            }}
                            render={({ field }) => (
                                <Input {...field}
                                    label='Username' placeholder='Username'
                                    errorMessage={errors.username?.message}
                                    isRequired
                                    {...errors.username && { isInvalid: true }}
                                />
                            )}
                        />
                        {!id &&
                            <Controller
                                control={control}
                                name='password'
                                rules={{
                                    required: 'El password es requerido',
                                    validate: (value) => {
                                        if (value === "") {
                                            return "Debes escribir una contraseña";
                                        }
                                        return true;
                                    }
                                }}
                                render={({ field }) => (
                                    <Input {...field}
                                        label='Password' placeholder='Password'
                                        errorMessage={errors.password?.message}
                                        isRequired
                                        {...errors.password && { isInvalid: true }}
                                    />
                                )}
                            />
                        }

                        {id &&
                            <Controller
                                control={control}
                                name='password'
                                render={({ field }) => (
                                    <Input {...field}
                                        label='Password' placeholder='Password'
                                        errorMessage={errors.password?.message}
                                        isRequired
                                        {...errors.password && { isInvalid: true }}
                                    />
                                )}
                            />
                        }

                        {/* email */}
                        <Controller
                            control={control}
                            name='email'
                            render={({ field }) => (
                                <Input {...field}
                                    label='Email' placeholder='Email' type='email'
                                    errorMessage={errors.email?.message}
                                    isRequired
                                    {...errors.email && { isInvalid: true }}
                                />
                            )}
                        />

                        {/* first name */}
                        <Controller
                            control={control}
                            name='first_name'
                            render={({ field }) => (
                                <Input {...field}
                                    label='Nombre' placeholder='Nombre'
                                    errorMessage={errors.first_name?.message}
                                    isRequired
                                    {...errors.first_name && { isInvalid: true }}
                                />
                            )}
                        />

                        {/* last name */}
                        <Controller
                            control={control}
                            name='last_name'
                            render={({ field }) => (
                                <Input {...field}
                                    label='Apellido' placeholder='Apellido'
                                    errorMessage={errors.last_name?.message}
                                    isRequired
                                    {...errors.last_name && { isInvalid: true }}
                                />
                            )}
                        />

                        {/* roles */}
                        <Controller
                            name='groups'
                            control={control}
                            rules={{
                                required: 'El rol es requerido',
                                validate: (value) => {
                                    if (value === "0") {
                                        return "Debes seleccionar un rol";
                                    }
                                    return true;
                                }
                            }}
                            render={({ field }) => (
                                <Select placeholder='Rol'
                                    label='Rol'
                                    {...field}
                                    errorMessage={errors.groups?.message}
                                    {...(errors.groups && { isInvalid: true })}
                                    items={optionsRoles.map((opcion) => ({ key: opcion.value, label: opcion.label }))}
                                    selectedKeys={new Set([String(field.value)])}
                                    isRequired
                                >
                                    {optionsRoles.map((opcion) => (
                                        <SelectItem key={opcion.value} value={opcion.value}>
                                            {opcion.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                        />

                        {/* surtidor puede ser null */}
                        <Controller
                            name='surtidor_id'
                            control={control}
                            render={({ field }) => (
                                <Select placeholder='Surtidor'
                                    label='Surtidor'
                                    {...field}
                                    items={surtidores.map((surtidor) => ({ key: surtidor.id, label: surtidor.nombre }))}
                                    selectedKeys={new Set([String(field.value)])}
                                >
                                    {surtidores.map((surtidor) => (
                                        <SelectItem key={surtidor.id} value={surtidor.id}>
                                            {surtidor.nombre}
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

export default FormUser
