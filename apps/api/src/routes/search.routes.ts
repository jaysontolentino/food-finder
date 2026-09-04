import { Router } from "express";

import { searchController } from "../container";

const router = Router();

router.get("/recent", searchController.getRecent.bind(searchController));

export default router;
