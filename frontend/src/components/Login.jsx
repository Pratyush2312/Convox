import { useState } from 'react'
import { useNavigate } from 'react-router'
import { io } from 'socket.io-client'

const socket = io.connect("http://localhost:3000")
const Login = () => {
  const [roomId, setroomId] = useState('')
  const [userName, setuserName] = useState('')
  const navigate=useNavigate()
  const handleJoin=async(e)=>{
    e.preventDefault()
    if(!userName.trim()||!roomId.trim()) return;
    navigate(`/room/${roomId}`,{state:{userName,roomId}})
    socket.emit("join-room", roomId, userName);
  
  }
  return (
    <div>
      <div className='bg-white text-black flex flex-col justify-center items-center min-h-screen gap-12'>
        <h1 className='font-extrabold text-2xl md:text-3xl sm:text-4xl'>Welcome to Convox!</h1>
        <form className="bg-[#fff7dd] w-[360px] rounded-2xl p-8 shadow-lg flex flex-col gap-6">
          <input type="text" value={userName} placeholder='Enter username' className='rounded-lg p-2 text-black' onChange={(e)=>{setuserName(e.target.value)}} />
          <input type="password" placeholder='Enter roomid' value={roomId} className='rounded-lg p-2 text-black' onChange={(e)=>{setroomId(e.target.value)}}/>
          <button className='w-full py-3 rounded-full bg-amber-300 
                   font-semibold text-gray-900 disabled:bg-amber-200
                   hover:bg-amber-400 transition-all duration-200' disabled={!userName.trim() || !roomId.trim()}    onClick={handleJoin}>Join</button>
        </form>
      </div>
    </div>
  )
}

export default Login
