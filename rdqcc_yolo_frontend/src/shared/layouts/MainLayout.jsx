import {Outlet, NavLink} from 'react-router-dom';
import {useState} from 'react';
import {useAppConfig} from '../hooks/useAppConfig';

const MainLayout = () => {
    const {isProduction} = useAppConfig();
    const [currentYear] = useState(new Date().getFullYear());

    return (
        <div className="flex flex-col min-h-screen bg-neutral-light-gray">
            <header
                className="bg-gradient-primary text-neutral-white px-6 md:px-10 py-5 shadow-header flex justify-between items-center border-b-3 border-accent-pink">
                <h1 className="text-2xl font-semibold text-shadow">
                    <NavLink to="/">Defect-AI</NavLink>
                </h1>
                <nav>
                    <ul className="flex gap-8">
                        <li>
                            <NavLink
                                to="/predict"
                                className={({isActive}) =>
                                    `text-neutral-white font-medium py-2 relative transition-colors hover:text-accent-light-pink
                  ${isActive ? 'text-accent-light-pink after:w-full' : 'after:w-0'} 
                  after:content-[""] after:absolute after:h-0.5 after:bg-accent-pink after:bottom-[-2px] after:left-0 after:transition-all`
                                }
                            >
                                Image Inference
                            </NavLink>
                        </li>
                        {!isProduction && (
                            <li>
                                <NavLink
                                    to="/train"
                                    className={({isActive}) =>
                                        `text-neutral-white font-medium py-2 relative transition-colors hover:text-accent-light-pink
                    ${isActive ? 'text-accent-light-pink after:w-full' : 'after:w-0'} 
                    after:content-[""] after:absolute after:h-0.5 after:bg-accent-pink after:bottom-[-2px] after:left-0 after:transition-all`
                                    }
                                >
                                    Model Training
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </nav>
            </header>

            <main className="flex-grow p-4 md:p-6 lg:p-8 w-full mx-auto my-4 bg-neutral-white rounded-lg shadow-main">
                <Outlet/>
            </main>

            <footer className="bg-primary-dark-blue text-neutral-light-gray text-center p-4 text-sm">
                <p>&copy; {currentYear} Defect-AI</p>
            </footer>
        </div>
    );
};

export default MainLayout;