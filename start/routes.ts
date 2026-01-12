import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')

const ProfissionaisController = () => import('#controllers/profissionais_controller')
const DisponibilidadesController = () => import('#controllers/disponibilidades_controller')
const ConsultasController = () => import('#controllers/consultas_controller')
const PacientesController = () => import('#controllers/pacientes_controller')


router.post('/auth/register', [AuthController, 'register'])
router.post('/auth/login', [AuthController, 'login'])

router.get('/profissionais', [ProfissionaisController, 'index'])
router.get('/profissionais/:id', [ProfissionaisController, 'show'])
router.put('/profissionais', [ProfissionaisController, 'update'])
router.get('/disponibilidades/:profissional_id', [DisponibilidadesController, 'show'])


router.group(() => {
 
router.post('/profissionais', [ProfissionaisController, 'store'])
  
  
router.post('/disponibilidades', [DisponibilidadesController, 'store'])
  
  

router.post('/consultas', [ConsultasController, 'store'])
router.get('/consultas', [ConsultasController, 'index'])
router.put('/consultas/:id', [ConsultasController, 'update'])
router.delete('/consultas/:id', [ConsultasController, 'destroy'])
  

router.get('/pacientes/me', [PacientesController, 'show'])
router.put('/pacientes/me', [PacientesController, 'update'])
  
}).use(middleware.auth())