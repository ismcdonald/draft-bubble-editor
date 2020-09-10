import * as React from 'react'
import { usePageLoader, useViewNav } from '../../model/ps/usePageLoader'
import Link from 'redux-first-router-link'
import HomeIcon from '@material-ui/icons/Home';

type Props = {
  rurl:string
}

export const Projects = ({rurl}:Props) => {
  var nav = useViewNav(rurl)  
  const page = usePageLoader(rurl)


  return (
    <div>
 <div className="bubble-breadcrumbs-bar">
        <Link to="/">
          <HomeIcon  />
        </Link> 
      </div>
      <h1>Lea's Projects:</h1>      
      <Link to={nav("/project/lea/essay")}>essay</Link>{" "}
    </div>)
}