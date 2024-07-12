import { ROUTES } from '@routes/Routes';
import './App.css'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { AuthService } from '@services/AuthService';
// import TablaBalance from '@components/balance/tabla-balance';
// import TablaEstados from '@components/balance/tabla-estados';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
type DatosForm = {
  username : string,
  password : string,
}

function App() {

  const {
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    control
  } = useForm<DatosForm>({
    defaultValues: {
      username: '',
      password: '',
    },
    reValidateMode: 'onSubmit',
  });

  const navigate = useNavigate();


  const onFormSubmit : SubmitHandler<DatosForm> = async (data : any) => {
    try {
        await AuthService.login({username: data.username, password: data.password})
        .then(() => {
          navigate(ROUTES.LIST_USUARIO);
        })
    } catch (error : any) {
        console.error(error);
        setError('root', {
            type: 'manual',
            message: 'Error al iniciar sesión',
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
                  type='password'
                  errorMessage={errors.password?.message}
                  isRequired
                  {...errors.password && { isInvalid: true }}
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
              Iniciar Sesión
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}

export default App
