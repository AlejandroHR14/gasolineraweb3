export interface Venta {
    id:                     number;
    tipo_producto:          string | null;
    nombre_factura:         string;
    nit_factura:            string;
    cliente:                string;
    correo:                 string;
    monto:                  number;
    precio_actual_producto: number;
    cantidad_producto:      number;
    fecha_hora:             Date | null;
    isDeleted:              boolean;
    surtidor:               number | string;
    bomba:                  number;
}