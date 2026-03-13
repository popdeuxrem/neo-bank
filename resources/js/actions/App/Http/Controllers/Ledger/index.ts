import LedgerController from './LedgerController'
import AccountController from './AccountController'
import TransactionController from './TransactionController'

const Ledger = {
    LedgerController: Object.assign(LedgerController, LedgerController),
    AccountController: Object.assign(AccountController, AccountController),
    TransactionController: Object.assign(TransactionController, TransactionController),
}

export default Ledger