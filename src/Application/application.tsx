/* 
Manticore Technologies
(c) 2025
application.tsx */

import NavigationBar from "./components/navigation/navigation-bar/navigation-bar";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Footer from "./components/navigation/footer/footer";
import { ThemeProvider } from "./contexts/theme-context";
import Home from "./pages/home/home";



const Application: React.FC = () => {
    return (
        <ThemeProvider>
            <Router>
                <div className="App">
                    <NavigationBar />
                    <div className="main">

                        <Routes>
                            
                            <Route path="/" element={<Home />} />

                        </Routes>

                    </div>
                    <Footer />
                </div>
            </Router>
        </ThemeProvider>
    );
};

export default Application;