import { Request, Response } from "express";
import prisma from "../prisma";

export default class AuthorController {
	async create(req: Request, res: Response) {
		const { name, email, bio, cpf, pais, profileDescription } = req.body

		try {
			const emailExists = await prisma.author.findUnique({
				where: {
					email
				}
			})

			if (emailExists) {
				return res.status(400).json({
					message: 'O email informado já existe'
				})
			}

			const profile = !profileDescription ? undefined : {
				description: profileDescription
			}

			const author = await prisma.author.create({
				data: {
					name,
					email,
					bio,
					cpf,
					pais,
					profile: {
						create: profile
					}
				}
			})

			return res.status(201).json(author)
		} catch (error) {
			const erro = error as Error
			return res.status(400).json({
				message: erro.message
			})
		}
	}

	async createProfile(req: Request, res: Response) {
		const { description } = req.body
		const { id } = req.params

		try {
			const author = await prisma.author.findUnique({
				where: {
					id: Number(id)
				}
			})

			if (!author) {
				return res.status(404).json({
					message: 'O author não existe'
				})
			}

			const profile = await prisma.profile.create({
				data: {
					description,
					authorId: author.id
				}
			})

			return res.status(201).json(profile)
		} catch (error) {
			const erro = error as Error
			return res.status(400).json({
				message: erro.message
			})
		}
	}

	async list(req: Request, res: Response) {
		try {
			const auhtors = await prisma.author.findMany({
				include: {
					profile: true,
					posts: true
				}
			})

			return res.status(200).json(auhtors)
		} catch (error) {
			const erro = error as Error
			return res.status(400).json({
				message: erro.message
			})
		}
	}

	async show(req: Request, res: Response) {
		const { id } = req.params
		try {
			// retorna apenas um registro filtrado pelo id ou outro campo unico
			// const auhtor = await prisma.author.findUnique({
			// 	where: {
			// 		id: Number(id)
			// 	}
			// })

			// retorna apenas o primeiro registro encontrado, mesmo que seja filtrado por qualquer campo
			const auhtor = await prisma.author.findFirst({
				where: {
					id: Number(id)
				}
			})

			if (!auhtor) {
				return res.status(404).json({
					message: 'Author não encontrado'
				})
			}

			return res.status(200).json(auhtor)
		} catch (error) {
			const erro = error as Error
			return res.status(400).json({
				message: erro.message
			})
		}
	}

	async update(req: Request, res: Response) {
		const { id } = req.params
		const { name, email, bio, cpf, pais } = req.body

		try {
			const auhtor = await prisma.author.findFirst({
				where: {
					id: Number(id)
				}
			})

			if (!auhtor) {
				return res.status(404).json({
					message: 'Author não encontrado'
				})
			}

			const emailExists = await prisma.author.findUnique({
				where: {
					email
				}
			})

			if (emailExists && emailExists.email !== email) {
				return res.status(400).json({
					message: 'O email informado já existe'
				})
			}

			await prisma.author.update({
				where: {
					id: Number(id)
				},
				data: {
					name,
					email,
					bio,
					cpf,
					pais
				}
			})

			return res.status(204).send()
		} catch (error) {
			const erro = error as Error
			return res.status(400).json({
				message: erro.message
			})
		}
	}

	async delete(req: Request, res: Response) {
		const { id } = req.params

		try {
			const auhtor = await prisma.author.findFirst({
				where: {
					id: Number(id)
				}
			})

			if (!auhtor) {
				return res.status(404).json({
					message: 'Author não encontrado'
				})
			}

			await prisma.author.delete({
				where: {
					id: Number(id)
				}
			})

			return res.status(204).send()
		} catch (error) {
			const erro = error as Error
			return res.status(400).json({
				message: erro.message
			})
		}
	}
}