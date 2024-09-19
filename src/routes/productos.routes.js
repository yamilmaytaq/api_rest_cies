import {Router, request} from "express";
import {methods as productosController} from "../controllers/fproductos.controller.js";

const router = Router();

//fprodcuctos.controller.js
//listar productos - categorias - proveedores
router.get("/", productosController.listarProductosDisponibles);
router.get("/no", productosController.listarProductosNoDisponibles);
router.get("/categoriamed", productosController.listarProductosCategorias);
router.get("/proveedoresmed", productosController.listarProveedoresproductos);

//insercion de productos
router.post("/registrar", productosController.addProductos);
router.post("/registrarcategoria",productosController.addProductosCategorias);

//editarpropiedadesProductos
router.put("/modificar/:id", productosController.updateProductos);

//eliminar producto
router.put("/eliminar/:id",productosController.deleteProducto);
router.put("/eliminarProductos",productosController.deleteProductos);

//regresar produtos a disponibles
router.put("/regresar/:id",productosController.returnProducto);
router.put("/regresarProductos" , productosController.returnProductos);


export default router;