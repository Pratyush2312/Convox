import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import io from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL
const socket = io.connect(SOCKET_URL)

const Client = () => {
    const joinedRef = useRef(false)
    const scrollRef = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()
    if (!location.state) {
        navigate('/')
        return;
    }
    const { userName, roomId } = location.state
    const [message, setmessage] = useState("")
    const [chat, setchat] = useState([])
    const handleSend = (e) => {
        e.preventDefault()
        const payload = {
            id: nanoid(),
            message,
            userName: userName,
            roomId: roomId,
            time: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        }

        setchat(prev => [...prev, payload])
        socket.emit('chat', payload)
        setmessage("")
    }

    useEffect(() => {
        if (joinedRef.current) return;

        socket.emit("join-room", { roomId, userName });
        joinedRef.current = true;
    }, [roomId, userName])
    useEffect(() => {
        const handleConnected = (userName) => {
            setchat(prev => [...prev, {
                type: 'system',
                message: `${userName} joined the room`
            }])
        }
        socket.on("user-connected", handleConnected)
        return () => socket.off('user-connected', handleConnected)
    }, []);

    useEffect(() => {
        const handleChat = (payload) => {
            setchat(prev => [...prev, payload])
        };

        socket.on('chat', handleChat);

        return () => socket.off('chat', handleChat);
    }, );
    useEffect(() => {
        const handleDisconnect = (userName) => {
            setchat(prev => [...prev, {
                type: 'system',
                message: `${userName} left the room`
            }])
        }
        socket.on('user-disconnected', handleDisconnect)
        return () => socket.off('user-disconnected', handleDisconnect)
    }, [])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chat])


    return (
        <>
            <div className='flex flex-col bg-amber-100 w-full h-screen border rounded-lg p-4'>
                <div className='flex-1 overflow-y-auto pr-5'>
                    {chat.map((payload, idx) => {
                        if (payload.type === 'system') {
                            return (
                                <div key={idx}>{payload.message}</div>
                            );
                        }
                        return payload.userName === userName ? (
                            <div key={idx} className=" flex flex-col items-end mb-2 ">
                                <span className='text-xs ml-auto'>{payload.userName}</span>
                                <span className='ml-auto inline-block bg-yellow-200 px-3 py-1 rounded-lg max-w-[70%] '>{payload.message}</span>
                                <span className='text-xs inline-block ml-auto'>{payload.time}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-start mb-2" key={idx}>
                                <span className='text-xs'>{payload.userName}</span>
                                <span className='mr-auto inline-block bg-yellow-200 px-3 py-1 rounded-lg max-w-[70%]'>
                                    {payload.message}
                                </span>
                                <span className='text-xs inline-block mr-auto'>{payload.time}</span>
                            </div>
                        )
                    })}
                    <div ref={scrollRef}></div>

                </div>
                <form className="flex gap-2" onSubmit={handleSend}>
                    <input type="text" value={message} placeholder='Type a message...' onChange={(e) => { setmessage(e.target.value) }} className='flex-1 p-2 rounded-lg bg-amber-50' />
                    <button type='submit' disabled={message.trim() === ""} className='rounded-md bg-amber-300 border disabled:bg-amber-200 border-transparent p-2 w-24'>Send</button>

                </form>
            </div>

        </>
    )
}

export default Client
