import { Request, Response } from "express";
import prisma from "../prisma";

export default class CategoryController {
	async create(req: Request, res: Response) {
		const { names } = req.body as { names: string[] }

		try {
			const dataNames = names.map(name => {
				return {
					name
				}
			})

			const category = await prisma.category.createMany({
				data: dataNames
			})

			return res.status(201).json(category)
		} catch (error) {
			const erro = error as Error
			return res.status(400).json({
				message: erro.message
			})
		}
	}
}