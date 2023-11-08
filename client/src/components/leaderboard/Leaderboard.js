import React from 'react'
import './Leaderboard.css'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { Link } from 'react-router-dom'
const Leaderboard = () => {
  const data = useSelector((state) => state.leaderboard)

  return (
    // <img class="gold-medal" src="https://github.com/malunaridev/Challenges-iCodeThis/blob/master/4-leaderboard/assets/gold-medal.png" alt="gold medal"/>
    <div className='parent'>

      <main className='leaderboardbody'>
        <div id="header">
          <h1>Leaderboard</h1>
          {/* <button class="share">
          <i class="ph ph-share-network"></i>
        </button> */}
        </div>
        <div id="leaderboard">
          <div class="ribbon"></div>
          <table>
            {
              data.data.map((obj) => (
                <tr>
                  <td class="number">{data.data.indexOf(obj) + 1}</td>
                  <td class="name">{obj.name}</td>
                  {obj.total_cost && <td class="points">
                    ₹ {obj.total_cost}
                  </td>}
                  {!obj.total_cost && <td class="points">
                    ₹ 0
                  </td>}
                </tr>
              ))
            }


          </table>
          <div id="buttons">
            <Link to={'/dashboard'}><button class="exit">Exit</button></Link>
            {/* <button class="continue">Continue</button> */}
          </div>
        </div>
      </main>

    </div>
  )
}

export default Leaderboard