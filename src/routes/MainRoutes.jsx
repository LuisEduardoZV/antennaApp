// import GuestGuard from 'utils/route-guard/GuestGuard'

// login routing
import MainLayout from '../layout/MainLayout'
import Clients from '../views/clients'
import Contacts from '../views/contacts'
import Linking from '../views/linking'
import Reportes from '../views/reports'
import SuperUsers from '../views/superusers'
import Terminals from '../views/terminals'
import TerminalsAssigned from '../views/terminalsAssigned'
import Users from '../views/users'

import AuthGuard from '../utils/AuthGuard'

// ==============================|| AUTH ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/linking',
      element: <Linking />
    },
    {
      path: '/clients',
      element: <Clients />
    },
    {
      path: '/clients/:clientid/contacts',
      element: <Contacts />
    },
    {
      path: '/clients/:clientid/users',
      element: <Users />
    },
    {
      path: '/terminalsAssigned',
      element: <TerminalsAssigned />
    },
    {
      path: '/terminals',
      element: <Terminals />
    },
    {
      path: '/admins',
      element: <SuperUsers />
    },
    {
      path: '/reports',
      element: <Reportes />
    }
  ]
}

export default MainRoutes
