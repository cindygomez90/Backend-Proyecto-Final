const { userService } = require ('../repositories/index.js')
const { CustomError } = require ('../utils/errors/customError.js')
const { EErrors } = require ('../utils/errors/enums.js')
const { generateUserErrorInfo } = require ('../utils/errors/info.js')
const { sendMail } = require('../utils/sendMail.js')

class UserController {
    constructor () {
        this.userService = userService
    }
    
    getUsers = async (req, res) => {
        const { limit = 10, page = 1 } = req.query;
        try {
            const result = await this.userService.getUsers(Number(limit), Number(page))
            const users = Array.isArray(result.docs) ? result.docs : []
            
            const userData = users.map(user => ({
                name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }))

            res.json({
                status: 'success',
                result: userData
            });
        } catch (error) {
            console.log(error);
        }
    }
    
    getUser =  async (request, responses)=>{
        try {
            const { uid } = request.params
            const user = await this.userService.getUser ({_id: uid})
            responses.json({
                status: 'success',
                result: user
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    createUser = async (request, responses, next)=>{      
        try {
            const { first_name, last_name, email, password } = request.body
            
            
            //si alguno de los campos no viene se va a instanciar el error
            if(!first_name || !last_name || !email) {
                throw CustomError.createError({
                    name: 'Error en la creación de usuario',
                    cause: generateUserErrorInfo({
                        first_name,
                        last_name,
                        email
                    }),
                    message: 'Error al crear el usuario',
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }

            const newUser = {
                first_name,
                last_name,
                email,
                password, 
                last_connection: new Date()
            }
            
            const result = await this.userService.createUser (newUser)
    
            responses.status(200).send({
                status: 'success',
                usersCreate: result
            })
        } catch (error) {
            next(error)  
        }
    }
    
    updateUser = async (request, responses)=>{
        try {
            const {uid} = request.params
            const userUpdate = request.body
            const result = await this.userService.updateUser (uid, userUpdate)
            responses.status (200).send ({
                status:'sucess',
                message: result
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    deleteUser = async (request, responses)=>{
        try {
            const { uid}  = request.params
            const result = await this.userService.deleteUser (uid)
            responses.status(200).send({
                status: 'succes',
                message: result
            })
        } catch (error) {
            console.log(error)
        }
    }

    deleteInactiveUsers = async (req, res) => {
        try {
            const inactiveUsers = await this.userService.getInactiveUsers()
            console.log('Usuarios inactivos:', inactiveUsers)
            
            for (const user of inactiveUsers) {
                console.log('Eliminando usuario:', user._id)
                await this.userService.deleteUser(user._id)
                await sendMail(user.email, 'Cuenta eliminada por inactividad', `<p>Estimado ${user.first_name},</p><p>Tu cuenta ha sido eliminada debido a inactividad.</p>`);
            }
            res.status(200).send({
                status: 'success',
                message: 'Usuarios eliminados y notificados por inactividad.'
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 'error', message: "Error del servidor" });
        }
    }

    changeUserRole = async (req, res) => {
        try {
            const { uid } = req.params;
            const { role } = req.body;
    
            const user = await this.userService.getUser({ _id: uid })
            console.log("Usuario obtenido de la base de datos:", user)
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuario no encontrado',
                });
            }
    
            // Verificar si el usuario ya tiene el rol premium
            if (user.role === 'USER_PREMIUM') {
                return res.status(400).json({
                    status: 'error',
                    message: 'El usuario ya tiene el rol premium',
                });
            }
    
            // Verificar si el usuario ha cargado los documentos requeridos
            const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta']
            const uploadedDocuments = user.documents.map(doc => doc.name);
            console.log("Documentos subidos por el usuario:", uploadedDocuments)

            
            const normalizedUploadedDocuments = uploadedDocuments.map(doc => doc.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_'));
            const normalizedRequiredDocuments = requiredDocuments.map(doc => doc.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

            console.log("Documentos subidos normalizados:", normalizedUploadedDocuments)
            console.log("Documentos requeridos normalizados:", normalizedRequiredDocuments)


            const missingDocuments = normalizedRequiredDocuments.filter(doc => !normalizedUploadedDocuments.includes(doc))
            
            console.log("Documentos faltantes:", missingDocuments)
            if (missingDocuments.length > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El usuario no ha cargado todos los documentos requeridos',
                    missingDocuments: missingDocuments,
                });
            }
    
            // Actualizar el rol del usuario a premium
            user.role = role
            await user.save()
            console.log("Respuesta enviada:", res)
            res.json({
                status: 'success',
                message: 'Rol de usuario actualizado a premium',
            });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 'error',
                message: 'Error al cambiar el rol del usuario',
            })
        }
    }
    
    uploadDocuments = async (req, res) => {
        try {
            const { uid } = req.params
            console.log("UserID:", uid)
            const uploadedFiles = req.files
            console.log("Uploaded files:", uploadedFiles)

    
            if (!uploadedFiles || Object.keys(uploadedFiles).length === 0) {
                console.log("No files uploaded")
                return res.status(400).send({
                    status: "error",
                    message: "Error al subir los documentos",
                })
            }
            
            const user = await this.userService.getUser ({_id: uid})
    
            if (!user) {
                return res.status(404).send({
                    status: "error",
                    message: "Usuario no encontrado",
                })
            }

            const documents = uploadedFiles.documents ? uploadedFiles.documents.map(file => ({
                name: file.originalname,
                reference: file.filename
            })) : []

            const profiles = uploadedFiles.profiles ? uploadedFiles.profiles.map(file => ({
                name: file.originalname,
                reference: file.filename
            })) : []
    
            const products = uploadedFiles.products ? uploadedFiles.products.map(file => ({
                name: file.originalname,
                reference: file.filename
            })) : []
    
            user.documents = [...user.documents, ...documents]
            user.profiles = [...user.profiles, ...profiles]
            user.products = [...user.products, ...products]
    
            await user.save()
    
            res.status(201).send({
                status: "success",
                message: "Documentos cargados exitosamente",
                files: uploadedFiles 
            })
        } catch (error) {
            console.error("Error:", error)
            res.status(500).send({
                status: "error",
                message: "Error del servidor",
            })
        }
    }    

    changeUserRoleAdmin = async (req, res) => {
        try {
            const { uid } = req.params;
            const { role } = req.body;

            const user = await this.userService.getUser({ _id: uid })
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuario no encontrado',
                });
            }

            user.role = role
            await user.save()

            res.json({
                status: 'success',
                message: 'Rol de usuario actualizado',
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 'error',
                message: 'Error al cambiar el rol del usuario',
            });
        }
    }
}


module.exports = UserController