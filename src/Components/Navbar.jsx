import React, { Suspense, useState , useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LogIn } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { userState} from '../store/atom/userAtom';
import axios from '../utils/axios';
import Preloader from './Preloader';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userState);
  // const currentUser = useRecoilValue(currentUserSelector);

console.log(user.username);

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'CheckList', path: '/checklist', requiresAuth: true },
    { name: 'Docs', path: '/docs', requiresAuth: true },
    { name: 'Create Docs', path: '/createdocs', requiresAuth: true , isCreator: true}, ,
    { name: 'Admin', path: '/admin', requiresAuth: true },
    { name: 'UserProfile', path: '/profile', requiresAuth: true },
  ];

  const getUser = async () => {
    try {
      const response = await axios.get("/user/current-user", {
        withCredentials: true,
      });
      setUser(response.data.data)
    }
    catch (error) {
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post('/user/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const filteredNavigation = navigation.filter(item =>{
    if (item.isCreator && user.isCreator == true) {
      return true;  
    }
    if (( !item.requiresAuth || user.username != undefined ))
    {
      return true;
    }
  });

  return (
    <Suspense fallback={<Preloader />}>
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and brand name */}
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="ml-2 text-xl font-bold text-white">JBM</span>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {filteredNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`${isActivePath(item.path)
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                  >
                    {item.name}
                  </Link>
                ))}

                {user.username != undefined ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-slate-300 hover:bg-slate-700 hover:text-white 
                    px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                ) :
                  <Link
                    to={"/login"}
                    className="flex items-center w-full text-left text-slate-300 hover:bg-slate-700 
                hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 
              hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 
              focus:ring-inset focus:ring-white transition-colors duration-200"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${isActivePath(item.path)
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {user.username != undefined? (
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left text-slate-300 hover:bg-slate-700 
                hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            ) :
              <Link
                to={"/login"}
                className="flex items-center w-full text-left text-slate-300 hover:bg-slate-700 
                hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            }

          </div>
        </div>
      </nav>
    </Suspense>
  );
};

export default Navbar;