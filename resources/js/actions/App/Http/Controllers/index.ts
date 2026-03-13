import PageController from './PageController'
import LeadController from './LeadController'
import Ledger from './Ledger'
import AccountStatementController from './AccountStatementController'
import PaymentController from './PaymentController'
import Api from './Api'
import Admin from './Admin'
import AdminController from './AdminController'
import Settings from './Settings'

const Controllers = {
    PageController: Object.assign(PageController, PageController),
    LeadController: Object.assign(LeadController, LeadController),
    Ledger: Object.assign(Ledger, Ledger),
    AccountStatementController: Object.assign(AccountStatementController, AccountStatementController),
    PaymentController: Object.assign(PaymentController, PaymentController),
    Api: Object.assign(Api, Api),
    Admin: Object.assign(Admin, Admin),
    AdminController: Object.assign(AdminController, AdminController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers