import OversightController from './OversightController'
import HealthController from './HealthController'

const Admin = {
    OversightController: Object.assign(OversightController, OversightController),
    HealthController: Object.assign(HealthController, HealthController),
}

export default Admin