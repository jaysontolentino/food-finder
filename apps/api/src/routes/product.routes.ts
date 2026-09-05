import { Router } from "express";
import { productController } from "../container";

const router = Router();

router.get("/search", productController.search.bind(productController));

router.get("/:barcode", productController.getByBarcode.bind(productController));

export default router;
