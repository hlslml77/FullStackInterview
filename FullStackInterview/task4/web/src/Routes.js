// web/src/Routes.js
import { Router, Route } from '@redwoodjs/router'

const Routes = () => {
  return (
    <Router>
      <Route path="/articles" page={ArticlesPage} name="articles" />
      // ...其他路由
    </Router>
  )
}

export default Routes
