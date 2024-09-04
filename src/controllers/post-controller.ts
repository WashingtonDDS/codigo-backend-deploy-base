import { Request, Response } from "express";
import prisma from "../prisma";

type BodyPost = {
	title: string
	content: string
	author_id: number
	categories: string[]
}

export default class PostController {
	async create(req: Request, res: Response) {
		const { title, content, author_id, categories } = req.body as BodyPost

		try {
			const author = await prisma.author.findUnique({
				where: {
					id: Number(author_id)
				}
			})

			if (!author) {
				return res.status(404).json({
					message: 'O author não existe'
				})
			}

			const categoriesExists = await prisma.category.findMany({
				where: {
					id: { in: categories }
				}
			})

			if (categories.length !== categoriesExists.length) {
				return res.status(404).json({
					message: 'Alguma categoria informada não foi encontrada'
				})
			}

			const post = await prisma.post.create({
				data: {
					title,
					content,
					authorId: author.id,
					postCategory: {
						create: categoriesExists.map(category => {
							return {
								categoryId: category.id
							}
						})
					}
				}
			})

			return res.status(201).json(post)
		} catch (error) {
			const erro = error as Error
			return res.status(400).json({
				message: erro.message
			})
		}
	}

	async list(req: Request, res: Response) {
		try {
			const posts = await prisma.post.findMany({
				include: {
					author: true,
					postCategory: {
						include: {
							category: true
						}
					}
				}
			})

			const result = posts.map(post => {
				return {
					...post,
					postCategory: undefined,
					categories: post.postCategory.map(category => {
						return {
							categoryId: category.categoryId,
							name: category.category.name
						}
					})
				}
			})

			return res.status(200).json(result)
		} catch (error) {
			const erro = error as Error
			return res.status(400).json({
				message: erro.message
			})
		}
	}
}