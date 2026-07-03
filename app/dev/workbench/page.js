import { notFound } from 'next/navigation'

import WorkbenchClient from './WorkbenchClient'
import '../../../styles/pages/workbench.css'

export const metadata = {
  title: 'Component Workbench (dev only)',
  robots: { index: false, follow: false },
}

/**
 * Dev-only component workbench (#269): renders complex components with mock
 * data inside drag-resizable container harnesses, with a season switcher.
 * Hard-gated out of production builds.
 * @returns {JSX.Element} the workbench page
 */
export default function WorkbenchPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }
  return <WorkbenchClient />
}
