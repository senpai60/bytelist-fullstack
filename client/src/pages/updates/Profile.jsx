import "./profile.css"

import LeftMenu from '../../components/layout/LeftMenu'
import Header from "../../components/layout/updates/Header"

function Profile({user}) {
  return (
    <section className="profile-update">
        
        <Header/>
        <section className="top"></section>


        {/* className = "main" */}

        <section className="main">
        <div className="upper">
          <div className="left">
            <div className="card1"></div>
            <div className="card2"></div>
            <div className="card3"></div>
            <div className="card4"></div>
          </div>
          <div className="right"></div>
        </div>
        <div className="lower">
          <div className="left"></div>
          <div className="mid"></div>
          <div className="right"></div>
        </div>
      </section>
    </section>
  )
}

export default Profile