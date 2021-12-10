import {Box, Stack, useMediaQuery} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {query as q, Client} from 'faunadb'
import rw from 'random-words'


function App() {

  let [isMobile] = useMediaQuery("(max-width:600px)");
  let [leaderboard, setLeaderboard] = useState(null)
  let client = new Client({
    secret: process.env.REACT_APP_FAUNA_CLIENT_SECRET
  })
  let stream
  const startStream = () => {
    stream = client.stream.document(q.Ref(q.Collection('scores'), process.env.REACT_APP_LEADERBOARD_ID))
    .on('snapshot', snapshot => {
      console.log("S", snapshot)
      setLeaderboard(snapshot.data)
    })
    .on('version', version => {
      console.log("V", version)
      setLeaderboard(version.document.data)
    })
    .on('error', error => {
      console.log('Error:', error)
      stream.close()
      setTimeout(startStream, 1000)
    })
    .start()
  }

  useEffect(()=>{

    if(! window.localStorage.getItem("user_id")){
      window.localStorage.setItem("user_id", `${rw()}_${Math.floor((Math.random() * 999) + 900)}` )
    }
    startStream()
    
  }, [])
  
  return (
    <div className="">
      <Stack direction={isMobile ? "column" : "column"} p="64">
        <h3>Leaderboard</h3>
        {leaderboard && Object.keys(leaderboard).map((k)=>{
          console.log(k,)
          return <><h4>{`${k} ------------ ${leaderboard[k]}`}</h4><br/></>
        })} 
      </Stack>
    
    </div>
  );
}

export default App;
