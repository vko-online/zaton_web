import { Link, useRouteMatch } from 'react-router-dom'
import classNames from 'classnames'
import { Button } from 'evergreen-ui'
import './Nav.css'

interface Props {
  label: string
  to: string
  exact: boolean
}
export default function Component ({ label, to, exact }: Props) {
  const match = useRouteMatch({
    path: to,
    exact
  })

  return (
    <div className={classNames('navButton', { active: match })}>
      <Link to={to}>{label}</Link>
    </div>
  )
}
