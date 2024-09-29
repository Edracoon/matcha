import { useState, useEffect, useRef } from 'react';
import apiService from '../services/apiService';
import { useCookies } from 'react-cookie';
import { useAuth } from '../contexts/authProvider';
import Navbar from '../components/Navbar';
import { socket } from '../socket';
import { handleDisconnectWithData } from '../socket';

function ChatComponent({match}) {

    const [cookies] = useCookies();
    const {user} = useAuth();

    // console.log("From Chat Component", match);

    interface Message {
        senderId: number;
        receiverId: number;
        content: string;
        date: Date;
    }

    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);


    const sendMessage = () => {
        console.log("Sending message", currentMessage);
        socket.emit('sendMessage', {token: cookies.accessToken, receiverId: match.id, content: currentMessage});
        setMessages((prevMessages) => [...prevMessages, {senderId: user.id, receiverId: match.id, content: currentMessage, date: new Date()}]);
        setCurrentMessage('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    useEffect(() => {
        if (!match) return;
        apiService({
            method: 'POST',
            path: '/getMessages',
            token: cookies.accessToken,
            options: { data: { receiverId: match.id } },
            onSuccess: (data) => {
                console.log("Messages : ", data);
                setMessages(data);
            },
            onError: (error) => {
                console.log(error);
            }
        }); 

        // socket.connect();

        // if (cookies.accessToken) {
        //     socket.emit('auth', cookies.accessToken);
        // }

        socket.on('receiveMessage', (message) => {
            console.log("Received message", message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
			// socket.off('receiveMesage'); // Supprimer l'écoute de l'événement 'Notif'
		};
    }, [cookies.accessToken, match]);


    return (
        <div className="h-full flex flex-col justify-between flex-1 p-3">
            <div className="flex flex-col space-y-4 overflow-y-auto px-6">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            message.senderId === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-xs p-3 rounded-lg shadow ${
                                message.senderId === user?.id
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-gray-300 text-black rounded-bl-none'
                            }`}
                        >
                            <p>{message.content}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(message.date).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className='flex '>
                <input
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={(e) => {if (e.key === 'Enter') sendMessage()}}
                        id="password"
                        name="Message"
                        value={currentMessage}
                        required
                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
            </div>
        </div>
    );
}

function MatchCards({match, onClicked}) {


    // useEffect(() => {
        
    //     })}, []);

    return (
            <li key={match.id} className="flex justify-between gap-x-6 py-5" onClick={onClicked}>
              <div className="flex min-w-0 gap-x-4">
                <img alt="" src={match.pictures[0]} className="h-12 w-12 flex-none rounded-full bg-gray-800 object-cover" />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-white">{match.firstname}</p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-400">{match.age}</p>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-white">{match.distance}</p>
                {!match.isConnected ? (
                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    Last seen <time dateTime={match.lastConnection}>{match.lastConnection}</time>
                  </p>
                ) : (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-400">Online</p>
                  </div>
                )}
              </div>
            </li>
      )
}

export default function ChatView() {
    const { user } = useAuth();
    const [cookies] = useCookies();
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);

    useEffect(() => {
        
        apiService({
            method: 'GET',
            path: '/getMatches',
            token: cookies.accessToken,
            onSuccess: (data) => {
                console.log(data);
                setMatches(data);
            },
            onError: (error) => {
                console.log(error);
            }
        });


       
    }, [cookies.accessToken]);

    useEffect(() => {
        socket.on('userDisconnected', (data) => {
            apiService({
                method: 'GET',
                path: '/getMatches',
                token: cookies.accessToken,
                onSuccess: (data) => {
                    console.log(data);
                    setMatches(data);
                },
                onError: (error) => {
                    console.log(error);
                }
            });
        });

        socket.on('userConnected', (data) => {
            apiService({
                method: 'GET',
                path: '/getMatches',
                token: cookies.accessToken,
                onSuccess: (data) => {
                    console.log(data);
                    setMatches(data);
                },
                onError: (error) => {
                    console.log(error);
                }
            });
        });

        return () => {
            socket.off('userDisconnected');
        }
    }, [matches]);


    return (
        <div className='h-screen flex flex-grow flex-col'>
            <Navbar />
            <div className='flex flex-grow flex-row overflow-hidden'>
                <div className="w-96 bg-indigo-500 p-4 overflow-y-scroll">
                    <ul role="list" className="divide-y divide-gray-800">
                        { matches.map((match) => (
                            <MatchCards match={match} onClicked={() => setSelectedMatch(match)}/>
                        ))}
                    </ul>
                </div>
                <ChatComponent match={selectedMatch}/>
            </div>
        </div>
    );
}
